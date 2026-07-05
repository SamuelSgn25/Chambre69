import os
import json
import zipfile
import re
import shutil
from xml.etree import ElementTree

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
    description = ""
    images = []
    
    # Walk to find Word files and images
    for root, dirs, files in os.walk(cat_path):
        for file in files:
            file_path = os.path.join(root, file)
            if file.lower().endswith((".docx", ".doc")):
                # Extract description if not already found or append
                text = extract_text_from_docx(file_path)
                if text:
                    description += text + "\n"
            elif file.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                # Generate a safe filename and copy to public
                rel_path = os.path.relpath(file_path, REPO_ROOT)
                # target_name = rel_path.replace(os.sep, "_")
                # Instead of flattening, let's keep a structure or just use a hash
                import hashlib
                h = hashlib.md5(file_path.encode()).hexdigest()[:10]
                ext = os.path.splitext(file)[1]
                target_filename = f"{h}{ext}"
                target_path = os.path.join(FRONTEND_PUBLIC, target_filename)
                
                shutil.copy2(file_path, target_path)
                images.append(f"/products/{target_filename}")

    # Clean up description (remove multiple newlines, etc.)
    description = re.sub(r'\n+', '\n', description).strip()
    if not description:
        description = f"Découvrez notre collection raffinée de {category}."

    # Map to Brand interface
    # brand_data = {
    #   id: string;
    #   name: string;
    #   description: string;
    #   image_url: string;
    #   products: (Product & { variants: ProductVariant[] })[];
    # }
    
    products = []
    for i, img in enumerate(images):
        prod_id = f"{brand_id}-p{i}"
        products.append({
            "id": prod_id,
            "category_id": brand_id,
            "name": f"{category} Item {i+1}",
            "slug": f"{brand_id}-item-{i+1}",
            "description": description[:200] + "..." if len(description) > 200 else description,
            "image_url": img,
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
        "description": description,
        "image_url": images[0] if images else "",
        "products": products
    })

output = {"brands": brands_data}
with open(DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Data generation complete. {len(brands_data)} brands processed.")
