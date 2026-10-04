#!/usr/bin/env python3
"""Validate actual browser scripts and local asset references before Pages deploys."""
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import tempfile
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

class PortalParser(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.script = None
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        element_id = attrs.get('id')
        if element_id:
            if element_id in self.ids:
                errors.append(f'{self.path}: duplicate id {element_id}')
            self.ids.add(element_id)
        if tag == 'script':
            self.script = '' if not attrs.get('src') else None
        asset = attrs.get('src') if tag == 'script' else attrs.get('href') if tag == 'link' and attrs.get('rel') == 'stylesheet' else None
        if asset and not asset.startswith(('https:', 'http:', '//', 'data:')):
            target = self.path.parent / asset.split('?')[0]
            if not target.is_file():
                errors.append(f'{self.path}: missing asset {asset}')

    def handle_data(self, data):
        if self.script is not None:
            self.script += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.script is not None:
            check_js(self.script, str(self.path) + ' inline')
            self.script = None

def check_js(source, name):
    with tempfile.NamedTemporaryFile(suffix='.js', mode='w') as tmp:
        tmp.write(source)
        tmp.flush()
        result = subprocess.run(['node', '--check', tmp.name], text=True, capture_output=True)
        if result.returncode:
            errors.append(name + ': ' + result.stderr)

for script in (ROOT / 'novo').rglob('*.js'):
    check_js(script.read_text(), str(script.relative_to(ROOT)))
for path in [ROOT / 'novo/index.html']:
    parser = PortalParser(path)
    parser.feed(path.read_text())
    for page in ['home','vaga','candidatar','painel-candidato','painel-empresa','vagas-empresa','candidatos-empresa','publicar','login-empresa','cadastro-empresa','cadastro-candidato','planos','painel-admin']:
        if 'pagina-' + page not in parser.ids:
            errors.append(f'missing page: {page}')

if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print('Portal validated: JavaScript syntax, inline scripts, assets and required pages.')
