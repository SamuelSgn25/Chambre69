import os, json, re, shutil, datetime

ROOT = '/home/samuel25/Chambre69/project_room69'
DATA = os.path.join(ROOT, 'src', 'data', 'shop-data.json')

def norm(s):
    return re.sub(r'[^a-z0-9]+','-', s.lower()).strip('-')

with open(DATA, 'r', encoding='utf-8') as f:
    data = json.load(f)

brands = data.get('brands', [])
brand_map = {b['id']: b for b in brands}
brand_name_map = {norm(b.get('name','')): b for b in brands}

modified = False

# Helper to add brand if missing
def add_brand_if_missing(id_hint, display_name, description=None):
    global modified
    bid = norm(id_hint)
    if bid in brand_map or bid in brand_name_map:
        return False
    brand = {
        'id': bid,
        'name': display_name,
        'description': description or f'Découvrez notre collection raffinée de {display_name}.',
        'image_url': '',
        'products': []
    }
    data['brands'].append(brand)
    brand_map[bid] = brand
    brand_name_map[norm(display_name)] = brand
    modified = True
    print('Added brand:', bid)
    return True

# 1) Add Miraclesuit and Krizalid if missing
added_miracle = add_brand_if_missing('miraclesuit', 'Miraclesuit', 'Spécialiste du gainant et maillots sculptants.')
added_krizalid = add_brand_if_missing('krizalid', 'Krizalid', 'Krizalid — collection et visuels.')

# 2) Group LingaDore nuisettes into single subcategory
linga = None
for b in data['brands']:
    if b.get('id') == 'linga-dore' or 'lingadore' in norm(b.get('name','')) or 'linga' in norm(b.get('name','')):
        linga = b
        break
if linga:
    changed_count = 0
    for p in linga.get('products', []):
        sub = (p.get('subcategory') or '').lower()
        coll = (p.get('collection') or '').lower()
        name = (p.get('name') or '').lower()
        if 'nui' in sub or 'nui' in coll or 'nui' in name:
            if p.get('subcategory') != 'Nuisette':
                p['subcategory'] = 'Nuisette'
                changed_count += 1
    if changed_count:
        modified = True
        print(f'Grouped {changed_count} LingaDore products into "Nuisette" subcategory')
else:
    print('LingaDore brand not found; skipping grouping')

# 3) Reorder Lingerie Sexy so items with original index >=43 move to front
sexy = None
for b in data['brands']:
    if b.get('id') == 'lingerie-sexy' or 'lingerie-sexy' in b.get('id','') or 'lingerie sexy' in norm(b.get('name','')):
        sexy = b
        break
if sexy:
    prods = sexy.get('products', [])
    if len(prods) >= 43:
        # rotate so that index 42 (43rd) and onward come first
        new_order = prods[42:] + prods[:42]
        sexy['products'] = new_order
        modified = True
        print('Reordered Lingerie Sexy products: moved items >=43 to front')
    else:
        print('Lingerie Sexy has less than 43 products; no reordering applied')
else:
    print('Lingerie Sexy brand not found; skipping reorder')

# Write backup and save
if modified:
    bak = DATA + '.bak.' + datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')
    shutil.copy2(DATA, bak)
    with open(DATA, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Saved changes to', DATA)
    print('Backup created at', bak)
else:
    print('No changes necessary')
