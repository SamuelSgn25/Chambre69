import os, json, hashlib, shutil, datetime, re

ROOT = '/home/samuel25/Chambre69/project_room69'
INSPECT = os.path.join(ROOT, 'public', 'inspect_images')
PRODUCTS = os.path.join(ROOT, 'public', 'products')
DATA = os.path.join(ROOT, 'src', 'data', 'shop-data.json')

os.makedirs(PRODUCTS, exist_ok=True)

def norm(s):
    return re.sub(r'[^a-z0-9]+','-', s.lower()).strip('-')

with open(DATA, 'r', encoding='utf-8') as f:
    data = json.load(f)

brand_map = {b['id']: b for b in data['brands']}
brand_name_map = {norm(b.get('name','')): b for b in data['brands']}

copied = 0
created = 0
modified = False

for bf in sorted(os.listdir(INSPECT)):
    bf_path = os.path.join(INSPECT, bf)
    if not os.path.isdir(bf_path):
        continue
    bid = norm(bf)
    brand = None
    if bid in brand_map:
        brand = brand_map[bid]
    elif bid in brand_name_map:
        brand = brand_name_map[bid]
    else:
        # try partial match
        for k,v in list(brand_name_map.items()):
            if k and k in bid:
                brand = v
                break
    if not brand:
        # create brand
        brand = {
            'id': bid,
            'name': bf,
            'description': f'Découvrez notre collection raffinée de {bf}.',
            'image_url': '',
            'products': []
        }
        data['brands'].append(brand)
        brand_map[bid] = brand
        brand_name_map[norm(bf)] = brand
        modified = True
    # collect images recursively
    imgs = []
    for root, dirs, files in os.walk(bf_path):
        for f in sorted(files):
            if f.lower().endswith(('.jpg','.jpeg','.png','.webp')):
                imgs.append(os.path.join(root,f))
    if not imgs:
        continue
    # if brand has no products, create one per image
    if not brand.get('products'):
        for i, src in enumerate(imgs):
            # create target
            relname = os.path.relpath(src, bf_path)
            prefix = hashlib.md5((brand['id'] + relname).encode()).hexdigest()[:6]
            tgt_name = f"{prefix}_{os.path.basename(relname).replace(' ','_')}"
            tgt = os.path.join(PRODUCTS, tgt_name)
            try:
                if not os.path.exists(tgt):
                    shutil.copy2(src, tgt)
                    copied += 1
            except Exception as e:
                print('Copy failed', src, e)
                continue
            prod_id = f"{brand['id']}-auto-{i+1}"
            prod = {
                'id': prod_id,
                'category_id': brand['id'],
                'name': f"{brand['name']} {i+1}",
                'slug': prod_id,
                'description': f"Produit importé: {os.path.dirname(relname) or 'default'}",
                'image_url': '/products/' + tgt_name,
                'subcategory': os.path.basename(os.path.dirname(relname)) or 'default',
                'collection': os.path.basename(os.path.dirname(relname)) or 'default',
                'is_featured': False,
                'created_at': '2026-07-05T00:00:00Z',
                'variants': [{
                    'id': f'v-{prod_id}',
                    'product_id': prod_id,
                    'color': 'Standard',
                    'sizes': ['S','M','L'],
                    'created_at': '2026-07-05T00:00:00Z'
                }]
            }
            brand['products'].append(prod)
            created += 1
            modified = True
    else:
        # ensure brand has image_url set
        if not brand.get('image_url'):
            # pick first image
            relname = os.path.relpath(imgs[0], bf_path)
            prefix = hashlib.md5((brand['id'] + relname).encode()).hexdigest()[:6]
            tgt_name = f"{prefix}_{os.path.basename(relname).replace(' ','_')}"
            tgt = os.path.join(PRODUCTS, tgt_name)
            try:
                if not os.path.exists(tgt):
                    shutil.copy2(imgs[0], tgt)
                    copied += 1
            except Exception as e:
                print('Copy failed', imgs[0], e)
                continue
            brand['image_url'] = '/products/' + tgt_name
            modified = True

# After creation, set brand.image_url where empty to first product image
for b in data['brands']:
    if (not b.get('image_url')) and b.get('products'):
        b['image_url'] = b['products'][0].get('image_url','')
        modified = True

if modified:
    bak = DATA + '.bak.' + datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    shutil.copy2(DATA, bak)
    with open(DATA, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Copied:', copied, 'Created products:', created, 'Backup:', bak)
else:
    print('No changes')
