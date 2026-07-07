import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

navbar_template = """  <div class="navbar__inner">
    <!-- Links Izquierda -->
    <div class="navbar__links navbar__links--left" style="display: flex; gap: var(--space-5); justify-content: flex-end; align-items: center; width: 100%;">
      <a class="navbar__link {active_inicio}" href="/" data-i18n="nav.home">Inicio</a>
      <div class="nav-dropdown">
        <a class="navbar__link {active_tienda}" href="tienda" data-i18n="nav.shop">Tienda ▾</a>
        <div class="nav-dropdown__menu">
          <a href="accesorios" class="{active_accesorios}" data-i18n="nav.accessories">Accesorios</a>
          <a href="ropa" class="{active_ropa}" data-i18n="nav.apparel">Ropa</a>
          <a href="lifestyle" class="{active_lifestyle}" data-i18n="nav.lifestyle">Lifestyle</a>
        </div>
      </div>
    </div>

    <!-- Logo Centro -->
    <a class="navbar__brand" href="/">
      <img src="assets/images/logo.jpg" alt="Smoke & Bloom Logo">
    </a>

    <!-- Links Derecha + Acciones -->
    <div class="navbar__links navbar__links--right" style="display: flex; gap: var(--space-5); justify-content: flex-start; align-items: center; width: 100%;">
      <a class="navbar__link {active_guias}" href="guias" data-i18n="nav.guides">Guías</a>
      <a class="navbar__link {active_nosotros}" href="sobre-nosotros" data-i18n="nav.about">Nosotros</a>
      
      <div class="navbar__actions" style="margin-left: auto;">
        <span class="material-symbols-outlined navbar__search">search</span>
        <span class="navbar__lang" style="cursor:pointer; font-size:0.75rem; font-weight:600; display:none;">ES/EN</span>
        <div class="navbar__hamburger" id="hamburger"><span></span><span></span><span></span></div>
      </div>
    </div>
  </div>"""

for fname in html_files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    acts = {
        'active_inicio': 'active' if fname == 'index.html' else '',
        'active_tienda': 'active' if fname == 'tienda.html' else '',
        'active_guias': 'active' if fname == 'guias.html' else '',
        'active_nosotros': 'active' if fname == 'sobre-nosotros.html' else '',
        'active_accesorios': 'active' if fname == 'accesorios.html' else '',
        'active_ropa': 'active' if fname == 'ropa.html' else '',
        'active_lifestyle': 'active' if fname == 'lifestyle.html' else ''
    }

    new_inner = navbar_template.format(**acts)

    # Replace everything between <div class="navbar__inner"> and </div> before <div class="navbar__mobile-menu">
    # Note: re.sub needs to match the inner content accurately.
    # Since navbar__inner ends right before <div class="navbar__mobile-menu"
    content = re.sub(
        r'<div class="navbar__inner">.*?</div>\s*<div class="navbar__mobile-menu"',
        f'{new_inner}\n  <div class="navbar__mobile-menu"',
        content,
        flags=re.DOTALL
    )

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

print("Navbar structurally centered in all HTML files.")
