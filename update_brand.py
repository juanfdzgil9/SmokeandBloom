import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# Replace brand in all HTML files
for fname in html_files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # The current navbar brand block looks like this:
    # <a class="navbar__brand" href="/" style="display: flex; align-items: center; gap: 10px;">
    #   <img src="assets/images/logo.jpg" alt="Smoke & Bloom Logo" style="height: 48px; border-radius: 50%;">
    #   Smoke &amp; Bloom
    # </a>
    # Or in some files (if not replaced):
    # <a class="navbar__brand" href="/">Smoke &amp; Bloom</a>
    
    # We will just replace everything between <div class="navbar__inner"> and <div class="navbar__links">
    new_brand = """<a class="navbar__brand" href="/">
      <img src="assets/images/logo.jpg" alt="Smoke & Bloom Logo">
      STORE
    </a>"""
    
    content = re.sub(
        r'<a class="navbar__brand".*?</a>',
        new_brand,
        content,
        flags=re.DOTALL
    )

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

# Now update the hero section ONLY in index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

new_hero = """<!-- HERO -->
<section class="hero-cover" id="hero" style="background-image: url('assets/images/hero-lifestyle.png');">
  <div class="hero-cover__overlay"></div>
  <div class="hero-cover__inner">
    <h1 class="display-lg hero-cover__title" data-i18n="home.hero.title">RITUAL, NOT ROUTINE.</h1>
    <p class="hero-cover__desc" data-i18n="home.hero.desc">Elevate your daily moments with curated cannabis essentials.</p>
    <div class="hero-cover__actions">
      <a class="btn btn--secondary btn--lg" href="tienda" data-i18n="home.hero.btn_primary" style="background: rgba(255,255,255,0.9); color: #000; border: none; font-weight: bold;">EXPLORE COLLECTIONS</a>
    </div>
  </div>
</section>
"""

index_content = re.sub(
    r'<!-- HERO -->.*?<!-- CATEGORIES -->',
    new_hero + '\n<!-- CATEGORIES -->',
    index_content,
    flags=re.DOTALL
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_content)

print("Navbar brand and Hero updated.")
