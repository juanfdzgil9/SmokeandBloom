import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for fname in html_files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove inline styles from the left and right link containers
    content = content.replace(
        '<div class="navbar__links navbar__links--left" style="display: flex; gap: var(--space-5); justify-content: flex-end; align-items: center; width: 100%;">',
        '<div class="navbar__links navbar__links--left">'
    )
    content = content.replace(
        '<div class="navbar__links navbar__links--right" style="display: flex; gap: var(--space-5); justify-content: flex-start; align-items: center; width: 100%;">',
        '<div class="navbar__links navbar__links--right">'
    )

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

print("Inline styles removed.")
