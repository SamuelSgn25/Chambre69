import os, json, shutil, datetime, re
ROOT_REPO = '/home/samuel25/Chambre69'
DATA = os.path.join(ROOT_REPO, 'project_room69', 'src', 'data', 'shop-data.json')
PRODUCTS_DIR = os.path.join(ROOT_REPO, 'project_room69', 'public', 'products')
CURVY_SRC = os.path.join(ROOT_REPO, 'curvy kate')

if not os.path.exists(DATA):
    print('shop-data.json missing')
    raise SystemExit(1)

with open(DATA,'r',encoding='utf-8') as f:
    data = json.load(f)

# Build set of curvy source basenames
curvy_images = set()
for root,dirs,files in os.walk(CURVY_SRC):
    for fn in files:
        if fn.lower().endswith(('.jpg','.jpeg','.png','.webp')):
            curvy_images.add(fn)

removed = 0
# Process curvy-kate brand
for b in data.get('brands', []):
    if b.get('id') == 'curvy-kate' or 'curvy kate' in (b.get('name') or '').lower():
        new_products = []
        for p in b.get('products', []):
            img = p.get('image_url','')
            if img.startswith('/products/'):
                fname = os.path.basename(img)
                # original filename likely after first underscore
                if '_' in fname:
                    orig = '_'.join(fname.split('_')[1:])
                else:
                    orig = fname
                if orig not in curvy_images:
                    # product references removed source image -> drop
                    removed += 1
                    continue
            new_products.append(p)
        if len(new_products) != len(b.get('products', [])):
            b['products'] = new_products
            print(f'Curvy Kate: removed {removed} products referencing missing source images')
        break

# Remove unreferenced product files from public/products
referenced = set()
for b in data.get('brands', []):
    for p in b.get('products', []):
        if p.get('image_url','').startswith('/products/'):
            referenced.add(p['image_url'].split('/')[-1])

deleted_files = 0
for fn in os.listdir(PRODUCTS_DIR):
    if fn not in referenced:
        # only delete files that look like imported (has underscore prefix we used) to be safe
        if '_' in fn:
            try:
                os.remove(os.path.join(PRODUCTS_DIR, fn))
                deleted_files += 1
            except Exception as e:
                print('could not delete', fn, e)

# Ensure Krizalid/Miracle/Maternité brands have image_url set
fixed = 0
for name in ('krizalid','miracle-suit','miraclesuit','maternit-et-grossesse'):
    for b in data.get('brands', []):
        if b.get('id') == name or name in (b.get('id') or '').lower() or name in (b.get('name') or '').lower():
            if not b.get('image_url') and b.get('products'):
                b['image_url'] = b['products'][0].get('image_url','')
                fixed += 1

# Move content under Lingerie Traditionnelle Africaine into its Maternité subfolder
lroot = os.path.join(ROOT_REPO, 'Lingerie Traditionnelle Africaine')
msub = os.path.join(lroot, 'Maternité et Grossesse')
if os.path.isdir(lroot) and os.path.isdir(msub):
    moved = 0
    for item in os.listdir(lroot):
        src = os.path.join(lroot, item)
        # skip the target folder
        if os.path.abspath(src) == os.path.abspath(msub):
            continue
        try:
            shutil.move(src, msub)
            moved += 1
        except Exception as e:
            print('move failed', src, e)
    if moved:
        print('Moved', moved, 'items into', msub)
else:
    print('Lingerie Traditionnelle Africaine or its subfolder missing')

if removed or deleted_files or fixed or moved:
    bak = DATA + '.bak.' + datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    shutil.copy2(DATA, bak)
    with open(DATA,'w',encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Saved shop-data.json; backup at', bak)

print('Summary: removed products', removed, 'deleted files', deleted_files, 'fixed brands', fixed)
