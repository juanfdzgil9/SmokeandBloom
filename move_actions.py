import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for fname in html_files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Move navbar__actions outside of navbar__links--right
    pattern = r'(<div class="navbar__links navbar__links--right">.*?)(\s*<div class="navbar__actions".*?</div>\s*)(</div>)'
    
    # We replace it with group(1) + group(3) + group(2)
    def repl(m):
        return m.group(1) + m.group(3) + m.group(2)
        
    content = re.sub(pattern, repl, content, flags=re.DOTALL)

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

print("Navbar actions moved out of right links container.")
