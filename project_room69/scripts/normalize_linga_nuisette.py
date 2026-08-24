import os, json, shutil, datetime, re
ROOT = '/home/samuel25/Chambre69/project_room69'
DATA = os.path.join(ROOT, 'src', 'data', 'shop-data.json')

with open(DATA, 'r', encoding='utf-8') as f:
    data = json.load(f)

modified = False
for b in data.get('brands', []):
    if b.get('id') == 'linga-dore' or 'lingadore' in re.sub(r'[^a-z0-9]+','-', b.get('name','').lower()):
        for p in b.get('products', []):
            sub = p.get('subcategory') or ''
            if 'nui' in sub.lower():
                if p['subcategory'] != 'Nuisette':
                    p['subcategory'] = 'Nuisette'
                    modified = True
            coll = p.get('collection') or ''
            if 'nui' in coll.lower():
                if p['collection'] != 'Nuisette':
                    p['collection'] = 'Nuisette'
                    modified = True
if modified:
    bak = DATA + '.bak.' + datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    shutil.copy2(DATA, bak)
    with open(DATA, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Normalized LingaDore nuisette subcategories, backup at', bak)
else:
    print('No changes needed')
