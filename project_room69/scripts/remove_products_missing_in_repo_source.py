import os, json, shutil, datetime, re
ROOT = '/home/samuel25/Chambre69'
DATA = '/home/samuel25/Chambre69/project_room69/src/data/shop-data.json'

# Map brand folder names at repo root to normalized ids
root_brands = [d for d in os.listdir(ROOT) if os.path.isdir(os.path.join(ROOT, d))]

# Build a map of brand name -> set of source basenames
brand_sources = {}
for folder in root_brands:
    folder_path = os.path.join(ROOT, folder)
    # skip project and hidden dirs
    if folder.startswith('.') or folder in ('project_room69','backend'):
        continue
    images = set()
    for root, dirs, files in os.walk(folder_path):
        for f in files:
            if f.lower().endswith(('.jpg','.jpeg','.png','.webp')):
                images.add(f)
    if images:
        brand_sources[folder.lower()] = images

if not os.path.exists(DATA):
    print('Data file not found')
    raise SystemExit(1)

with open(DATA,'r',encoding='utf-8') as f:
    data = json.load(f)

modified = False
removed_count = 0
for b in data.get('brands', []):
    # try match by name to repo folder
    possible_folders = [k for k in brand_sources.keys() if k.startswith(b.get('name','').lower().split()[0]) or b.get('name','').lower() in k]
    if not possible_folders:
        continue
    folder = possible_folders[0]
    sources = brand_sources.get(folder, set())
    new_products = []
    for p in b.get('products', []):
        img = p.get('image_url','')
        if '/products/' in img:
            fname = img.split('/')[-1]
            # try extract original filename after first underscore
            if '_' in fname:
                orig = '_'.join(fname.split('_')[1:])
            else:
                orig = fname
            if orig not in sources:
                # remove product
                removed_count += 1
                modified = True
                continue
        new_products.append(p)
    if len(new_products) != len(b.get('products', [])):
        b['products'] = new_products

if modified:
    bak = DATA + '.bak.' + datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    shutil.copy2(DATA, bak)
    with open(DATA,'w',encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Removed products whose source images disappeared:', removed_count, 'backup:', bak)
else:
    print('No products removed')
