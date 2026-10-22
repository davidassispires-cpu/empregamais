"""Deployment must not insert scripts inside the embedded resume document."""
from pathlib import Path
from html.parser import HTMLParser
import os
import json
import subprocess
import sys
import tempfile
import textwrap

ROOT = Path(__file__).resolve().parents[1]
class Scripts(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=False)
        self.scripts = []
        self.current = None
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        if tag == 'script': self.current = []
    def handle_data(self, data):
        if self.current is not None: self.current.append(data)
    def handle_endtag(self, tag):
        if tag == 'script' and self.current is not None:
            self.scripts.append(''.join(self.current))
            self.current = None

source = (ROOT / 'index.html').read_text()
workflow = (ROOT / '.github/workflows/pages.yml').read_text()
code = textwrap.dedent(workflow.split("python - <<'PYTHON'\n", 1)[1].split('          PYTHON', 1)[0])
with tempfile.TemporaryDirectory() as directory:
    page = Path(directory) / 'index.html'
    page.write_text(source)
    subprocess.run([sys.executable, '-c', code], cwd=directory, env={**os.environ, 'DEPLOY_SHA': 'build-regression'}, check=True)
    built = page.read_text()
    assert Scripts(built).scripts == Scripts(source).scripts + [''], 'Embedded scripts were changed by asset injection'
    assert built.count('src="form-validation.js?v=build-regression"') == 1
    assert built.rfind('src="form-validation.js?v=build-regression"') > built.rfind('candidato-preparacao.js?v=build-regression')
print('PASS: generated page preserves every inline script and appends validation only once at document end')

# An accidental HTML insertion inside the printable resume used to terminate
# its script early and expose the remainder beneath the public footer.
subprocess.run(
    ['node', '-e', 'const vm=require("node:vm");const fs=require("node:fs");JSON.parse(fs.readFileSync(0,"utf8")).forEach(code=>new vm.Script(code));'],
    input=json.dumps(Scripts(built).scripts), text=True, check=True,
)
print('PASS: every inline script in the deployed HTML has valid JavaScript syntax')
