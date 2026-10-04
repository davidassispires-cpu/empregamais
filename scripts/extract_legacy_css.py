"""Move historical inline CSS to three cacheable sheets without changing cascade order."""
import re
from pathlib import Path
path=Path('novo/index.html')
source=path.read_text()
head_end=source.index('</head>')
base_link=source.index('<link rel="stylesheet" href="assets/css/app.css')
groups={name:[] for name in ('legacy-before-app','legacy-after-app','legacy-pages')}
for match in re.finditer(r'<style\b([^>]*)>([\s\S]*?)</style>',source,re.I):
    name='legacy-pages' if match.start()>head_end else 'legacy-before-app' if match.start()<base_link else 'legacy-after-app'
    groups[name].append(match)
replacements=[]
for name,matches in groups.items():
    if not matches: continue
    css=[]
    for index,match in enumerate(matches):
        label=re.search(r'id=["\']([^"\']+)',match.group(1))
        css.append('/* '+(label.group(1) if label else 'Historical styles')+' */\n'+match.group(2).strip())
        replacements.append((match.start(),match.end(),f'<link rel="stylesheet" href="assets/css/{name}.css?v=20261004-stable-3">' if index==0 else ''))
    Path(f'novo/assets/css/{name}.css').write_text('\n\n'.join(css)+'\n')
for start,end,replacement in sorted(replacements,reverse=True): source=source[:start]+replacement+source[end:]
source=source.replace('portal-auth.css?v=20261004-stable-2','portal-auth.css?v=20261004-stable-3')
path.write_text(source)
print(f'Extracted {len(replacements)} style blocks; HTML reduced from {len(source)+sum(len(m.group()) for ms in groups.values() for m in ms)} to {len(source)} characters.')
