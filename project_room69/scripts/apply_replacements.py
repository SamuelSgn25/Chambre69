import os, json, shutil, hashlib, re

ROOT = '/home/samuel25/Chambre69/project_room69'
INSPECT = os.path.join(ROOT, 'public', 'inspect_images')
PRODUCTS = os.path.join(ROOT, 'public', 'products')
DATA = os.path.join(ROOT, 'src', 'data', 'shop-data.json')


def norm(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


with open(DATA, 'r', encoding='utf-8') as f:
    data = json.load(f)

brand_map = {}
for b in data['brands']:
    brand_map[b['id']] = b
    brand_map[norm(b['name'])] = b

copied = 0
changes = 0
added_brands = 0
removed_products = []

if not os.path.isdir(INSPECT):
    print('No inspect_images folder found, exiting')
    raise SystemExit(1)

for brand_folder in sorted(os.listdir(INSPECT)):
    bf_path = os.path.join(INSPECT, brand_folder)
    if not os.path.isdir(bf_path):
        continue
    bid = norm(brand_folder)
    brand = None
    if bid in brand_map:
        brand = brand_map[bid]
    else:
        for k, v in brand_map.items():
            if k and k in bid:
                brand = v
                break
    if not brand:
        new_id = bid
        brand = {
            'id': new_id,
            'name': brand_folder,
            'description': f'Découvrez notre collection raffinée de {brand_folder}.',
            'image_url': '',
            'products': []
        }
        data['brands'].append(brand)
        brand_map[new_id] = brand
        added_brands += 1
    # iterate collections inside
    for collection in sorted(os.listdir(bf_path)):
        col_path = os.path.join(bf_path, collection)
        if not os.path.isdir(col_path):
            continue
        imgs = [f for f in sorted(os.listdir(col_path)) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        if not imgs:
            continue
        dest_urls = []
        for img in imgs:
            src = os.path.join(col_path, img)
            prefix = hashlib.md5((brand['id'] + collection).encode()).hexdigest()[:6]
            tgt_name = f"{prefix}_{img.replace(' ', '_')}"
            tgt = os.path.join(PRODUCTS, tgt_name)
            try:
                if not os.path.exists(tgt):
                    shutil.copy2(src, tgt)
                    copied += 1
            except Exception as e:
                print('Copy error', src, e)
                continue
            dest_urls.append('/products/' + tgt_name)
        coll_norm = norm(collection)
        matched = [p for p in brand.get('products', []) if coll_norm in norm(str(p.get('collection', '')))]
        if not matched:
            matched = [p for p in brand.get('products', []) if coll_norm in norm(str(p.get('subcategory', '')))]
        if matched:
            for i, p in enumerate(matched):
                new_url = dest_urls[i % len(dest_urls)]
                if p.get('image_url') != new_url:
                    p['image_url'] = new_url
                    changes += 1
        else:
            for i, u in enumerate(dest_urls):
                prod_id = f"{brand['id']}-auto-{len(brand.get('products', [])) + 1}"
                prod = {
                    'id': prod_id,
                    'category_id': brand['id'],
                    'name': f"{brand['name']} {collection} {i+1}",
                    'slug': prod_id,
                    'description': f"Produit importé: {collection}",
                    'image_url': u,
                    'subcategory': collection,
                    'collection': collection,
                    'is_featured': False,
                    'created_at': '2026-07-05T00:00:00Z',
                    'variants': [{
                        'id': f'v-{prod_id}',
                        'product_id': prod_id,
                        'color': 'Standard',
                        'sizes': ['S', 'M', 'L'],
                        'created_at': '2026-07-05T00:00:00Z'
                    }]
                }
                brand['products'].append(prod)
                changes += 1

# Specific removals and replacements per user request
# Louisa bracq: remove products with Elise in name/collection
for b in data['brands']:
    if 'louisa' in b['id'] or 'louisa' in norm(b.get('name', '')):
        before = len(b['products'])
        b['products'] = [p for p in b['products'] if 'elise' not in (p.get('collection', '') + p.get('name', '')).lower()]
        removed = before - len(b['products'])
        if removed > 0:
            removed_products.append((b['id'], removed))

# Remove specific product name substrings across all brands
removals = ['smoothing mould bra', 'cate uw bra', 'soutien gorge briana thong']
for b in data['brands']:
    newprods = []
    for p in b.get('products', []):
        name_col = (p.get('name', '') + ' ' + p.get('collection', '')).lower()
        if any(r in name_col for r in removals):
            removed_products.append((b['id'], p['id']))
            continue
        # Remove 'brief' word from products classified as 'soutien'
        if 'soutien' in (p.get('subcategory') or '').lower():
            p['name'] = re.sub(r'\bbrief\b', '', p.get('name', ''), flags=re.IGNORECASE).strip()
            p['collection'] = re.sub(r'\bbrief\b', '', p.get('collection', ''), flags=re.IGNORECASE).strip()
        newprods.append(p)
    b['products'] = newprods

# Save data back
with open(DATA, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Copied images:', copied)
print('Data changes:', changes)
print('Added brands:', added_brands)
print('Removed products summary entries:', len(removed_products))
