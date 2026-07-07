import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

desktop_template = """      <a class="navbar__link {active_inicio}" href="/" data-i18n="nav.home">Inicio</a>
      <div class="nav-dropdown">
        <a class="navbar__link {active_tienda}" href="tienda" data-i18n="nav.shop">Tienda ▾</a>
        <div class="nav-dropdown__menu">
          <a href="accesorios" class="{active_accesorios}" data-i18n="nav.accessories">Accesorios</a>
          <a href="ropa" class="{active_ropa}" data-i18n="nav.apparel">Ropa</a>
          <a href="lifestyle" class="{active_lifestyle}" data-i18n="nav.lifestyle">Lifestyle</a>
        </div>
      </div>
      <a class="navbar__link {active_guias}" href="guias" data-i18n="nav.guides">Guías</a>
      <a class="navbar__link {active_nosotros}" href="sobre-nosotros" data-i18n="nav.about">Nosotros</a>
"""

mobile_template = """  <div class="navbar__mobile-menu" id="mobileMenu">
    <a class="navbar__link {active_inicio}" href="/" data-i18n="nav.home">Inicio</a>
    <a class="navbar__link {active_tienda}" href="tienda" data-i18n="nav.shop">Tienda</a>
    <div class="mobile-sublinks">
      <a class="navbar__link navbar__link--sub {active_accesorios}" href="accesorios" data-i18n="nav.accessories">Accesorios</a>
      <a class="navbar__link navbar__link--sub {active_ropa}" href="ropa" data-i18n="nav.apparel">Ropa</a>
      <a class="navbar__link navbar__link--sub {active_lifestyle}" href="lifestyle" data-i18n="nav.lifestyle">Lifestyle</a>
    </div>
    <a class="navbar__link {active_guias}" href="guias" data-i18n="nav.guides">Guías</a>
    <a class="navbar__link {active_nosotros}" href="sobre-nosotros" data-i18n="nav.about">Nosotros</a>
  </div>"""

for fname in html_files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine actives
    acts = {
        'active_inicio': 'active' if fname == 'index.html' else '',
        'active_tienda': 'active' if fname == 'tienda.html' else '',
        'active_guias': 'active' if fname == 'guias.html' else '',
        'active_nosotros': 'active' if fname == 'sobre-nosotros.html' else '',
        'active_accesorios': 'active' if fname == 'accesorios.html' else '',
        'active_ropa': 'active' if fname == 'ropa.html' else '',
        'active_lifestyle': 'active' if fname == 'lifestyle.html' else ''
    }

    desktop_block = desktop_template.format(**acts)
    mobile_block = mobile_template.format(**acts)

    # Replace desktop links
    content = re.sub(
        r'<div class="navbar__links">.*?</div>',
        f'<div class="navbar__links">\n{desktop_block}    </div>',
        content,
        flags=re.DOTALL
    )

    # Replace mobile menu
    content = re.sub(
        r'<div class="navbar__mobile-menu" id="mobileMenu">.*?</div>',
        mobile_block,
        content,
        flags=re.DOTALL
    )

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

print("Navbar updated in all HTML files.")
