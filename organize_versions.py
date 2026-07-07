import os
import shutil

root_dir = "C:/Users/juanf/OneDrive/Desktop/Escritorio/Trabajos IA/Paginas Web/Smoke_bloom_store"
v1_dir = os.path.join(root_dir, "Version_1_Hostinger")
v2_dir = os.path.join(root_dir, "Version_2_Localhost")

# Create directories
os.makedirs(v1_dir, exist_ok=True)
os.makedirs(v2_dir, exist_ok=True)

# 1. Move V1 files from documentos/despliegue_hostinger_v01 to Version_1_Hostinger
v1_source = os.path.join(root_dir, "documentos", "despliegue_hostinger_v01")
if os.path.exists(v1_source):
    for item in os.listdir(v1_source):
        s = os.path.join(v1_source, item)
        d = os.path.join(v1_dir, item)
        if os.path.exists(d):
            if os.path.isdir(d):
                shutil.rmtree(d)
            else:
                os.remove(d)
        shutil.move(s, d)

# 2. Move V2 files (current root website files) to Version_2_Localhost
v2_items_to_move = [
    'css', 'js', 'assets', 'data'
]
# Add all HTML files
for f in os.listdir(root_dir):
    if f.endswith('.html') and f not in v2_items_to_move:
        v2_items_to_move.append(f)
        
# Add robots.txt and sitemap.xml
for f in ['robots.txt', 'sitemap.xml']:
    if os.path.exists(os.path.join(root_dir, f)):
        v2_items_to_move.append(f)

for item in v2_items_to_move:
    s = os.path.join(root_dir, item)
    d = os.path.join(v2_dir, item)
    if os.path.exists(s):
        if os.path.exists(d):
            if os.path.isdir(d):
                shutil.rmtree(d)
            else:
                os.remove(d)
        shutil.move(s, d)

print("Versions separated successfully.")
