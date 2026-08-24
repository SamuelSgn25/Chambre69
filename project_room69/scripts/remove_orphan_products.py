import os, json, shutil, datetime
ROOT = '/home/samuel25/Chambre69/project_room69'
DATA = os.path.join(ROOT, 'src', 'data', 'shop-data.json')
PRODUCTS_DIR = os.path.join(ROOT, 'public', 'products')

with open(DATA, 'r', encoding='utf-8') as f:
    data = json.load(f)

removed = 0
modified = False
for b in data.get('brands', []):
    new_products = []
    for p in b.get('products', []):
        img = p.get('image_url','')
        if img.startswith('/products/'):
            path = os.path.join(PRODUCTS_DIR, img.replace('/products/',''))
            if not os.path.exists(path):
                removed += 1
                modified = True
                continue
        new_products.append(p)
    if len(new_products) != len(b.get('products', [])):
        b['products'] = new_products

if modified:
    bak = DATA + '.bak.' + datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    shutil.copy2(DATA, bak)
    with open(DATA, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Removed orphan products:', removed, 'backup:', bak)
else:
    print('No orphan products found')
