import os
import json
import zipfile
import re
import shutil
from xml.etree import ElementTree
import hashlib

def extract_text_from_docx(path):
    try:
        with zipfile.ZipFile(path) as zf:
            xml_content = zf.read('word/document.xml')
            tree = ElementTree.fromstring(xml_content)
            
            # Namespace for word processingml
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = []
            for p in tree.findall('.//w:p', ns):
                texts = [t.text for t in p.findall('.//w:t', ns) if t.text]
                if texts:
                    paragraphs.append("".join(texts))
            
            return "\n".join(paragraphs)
    except Exception as e:
        print(f"Error reading {path}: {e}")
        return ""

def clean_to_single_sentence(text, category_name):
    if not text:
        return f"Découvrez notre collection raffinée de {category_name}."
    
    # Normalize newlines and spaces
    text_normalized = re.sub(r'\s+', ' ', text).strip()
    
    # Split on sentences (dot, exclamation or question followed by space or end of string)
    sentences = re.split(r'(?<=[.!?])\s+', text_normalized)
    
    for s in sentences:
        s = s.strip()
        # Clean up prefix labels
        s = re.sub(r'^(description|descriptif|caractéristiques|composition|soin|entretien|fiche technique)\s*:?\s*', '', s, flags=re.IGNORECASE).strip()
        s = re.sub(r'^[-•*\s]+', '', s).strip()
        
        # Ignore technical specifications, detail lines or very short fragments
        lower = s.lower()
        if len(lower) < 25:
            continue
        if lower.startswith(('code produit', 'référence', 'ref:', 'principal :', 'matière :', 'composition :')):
            continue
        if lower.startswith(('lavage', 'pas de', 'ne pas', '100%')):
            continue
        if ':' in s and len(s.split(':')[0]) < 15:
            continue
            
        s = s[0].upper() + s[1:]
        if not s[-1] in ['.', '!', '?']:
            s += '.'
        return s
        
    return f"Découvrez notre collection raffinée de {category_name}."

def find_first_docx_recursively(dir_path):
    if not os.path.exists(dir_path):
        return None
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.lower().endswith((".docx", ".doc")) and not file.startswith('~$'):
                return os.path.join(root, file)
    return None

def find_nearest_docx(directory, limit_path):
    if not os.path.exists(directory):
        return None
    for file in os.listdir(directory):
        if file.lower().endswith((".docx", ".doc")) and not file.startswith('~$'):
            return os.path.join(directory, file)
    
    parent = os.path.dirname(directory)
    if directory != limit_path and parent.startswith(limit_path):
        return find_nearest_docx(parent, limit_path)
    return None

def scan_and_collect_products(dir_path, limit_path, brand_id, subcategory=None, collection=None):
    prods = []
    if not os.path.exists(dir_path):
        return prods
        
    # Sort files to maintain deterministic order
    for item in sorted(os.listdir(dir_path)):
        full_path = os.path.join(dir_path, item)
        if os.path.isdir(full_path):
            if not subcategory:
                prods.extend(scan_and_collect_products(full_path, limit_path, brand_id, item, collection))
            else:
                new_collection = f"{collection} - {item}" if collection else item
                prods.extend(scan_and_collect_products(full_path, limit_path, brand_id, subcategory, new_collection))
        elif os.path.isfile(full_path) and item.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            prods.append((full_path, subcategory, collection))
    return prods

CATEGORIES = [
    "Chaines de taille",
    "curvy kate",
    "Dita von teese",
    "Elomi",
    "Empreinte",
    "Fantasie",
    "Freya",
    "Jouets pour adultes",
    "Kimonos",
    "Linga dore",
    "Lingerie Sexy",
    "Lingerie traditionnelle africaine",
    "Louisa bracq",
    "Senteurs, Encens et Huiles",
    "Wacoal",
    "Ysabel Mora"
]

REPO_ROOT = "/home/samuel25/Chambre69"
FRONTEND_PUBLIC = os.path.join(REPO_ROOT, "project_room69/public/products")
DATA_FILE = os.path.join(REPO_ROOT, "project_room69/src/data/shop-data.json")

if not os.path.exists(FRONTEND_PUBLIC):
    os.makedirs(FRONTEND_PUBLIC)

if not os.path.exists(os.path.dirname(DATA_FILE)):
    os.makedirs(os.path.dirname(DATA_FILE))

brands_data = []

for category in CATEGORIES:
    cat_path = os.path.join(REPO_ROOT, category)
    if not os.path.exists(cat_path):
        print(f"Skipping {category}, path not found.")
        continue
    
    brand_id = category.lower().replace(" ", "-")
    
    # 1. Representative Brand description and image
    brand_doc = find_first_docx_recursively(cat_path)
    brand_raw_desc = extract_text_from_docx(brand_doc) if brand_doc else ""
    brand_desc = clean_to_single_sentence(brand_raw_desc, category)
    
    # 2. Collect products using folder-based subcategories and collections
    collected_items = scan_and_collect_products(cat_path, cat_path, brand_id)
    
    products = []
    representative_image = ""
    
    for i, (file_path, sub, col) in enumerate(collected_items):
        prod_id = f"{brand_id}-p{i}"
        
        # Generate safe filename and copy to public
        h = hashlib.md5(file_path.encode()).hexdigest()[:10]
        ext = os.path.splitext(file_path)[1]
        target_filename = f"{h}{ext}"
        target_path = os.path.join(FRONTEND_PUBLIC, target_filename)
        
        try:
            shutil.copy2(file_path, target_path)
        except Exception as e:
            print(f"Error copying {file_path}: {e}")
            
        img_url = f"/products/{target_filename}"
        if not representative_image:
            representative_image = img_url
            
        # Get nearest docx for this specific product
        prod_dir = os.path.dirname(file_path)
        prod_doc = find_nearest_docx(prod_dir, cat_path)
        prod_raw_desc = extract_text_from_docx(prod_doc) if prod_doc else ""
        prod_desc = clean_to_single_sentence(prod_raw_desc, category)
        
        # Clean subcategory and collection names
        clean_sub = sub.strip() if sub else None
        clean_col = col.strip() if col else None
        if clean_col:
            clean_col = re.sub(r'collection', '', clean_col, flags=re.IGNORECASE).strip()
            clean_col = re.sub(r'-+', '-', clean_col).strip('-').strip()
            clean_col = clean_col.capitalize() if clean_col else None
        if not clean_col:
            clean_col = "Général"
            
        products.append({
            "id": prod_id,
            "category_id": brand_id,
            "name": f"{category} Item {i+1}",
            "slug": f"{brand_id}-item-{i+1}",
            "description": prod_desc,
            "image_url": img_url,
            "subcategory": clean_sub,
            "collection": clean_col,
            "is_featured": i == 0,
            "created_at": "2026-07-05T00:00:00Z",
            "variants": [
                {
                    "id": f"v-{prod_id}",
                    "product_id": prod_id,
                    "color": "Standard",
                    "sizes": ["S", "M", "L", "XL"],
                    "created_at": "2026-07-05T00:00:00Z"
                }
            ]
        })
        
    brands_data.append({
        "id": brand_id,
        "name": category,
        "description": brand_desc,
        "image_url": representative_image,
        "products": products
    })

output = {"brands": brands_data}
with open(DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Data generation complete. {len(brands_data)} brands processed.")
