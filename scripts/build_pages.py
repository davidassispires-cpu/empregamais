"""Build the public Pages artifact without publishing repository maintenance files."""
from pathlib import Path
import shutil
root=Path(__file__).resolve().parent.parent
output=root/'_site'
if output.exists():shutil.rmtree(output)
output.mkdir()
shutil.copytree(root/'novo',output/'novo')
public_extensions={'.html','.css','.js','.json','.png','.jpg','.jpeg','.webp','.svg','.ico','.txt','.xml','.webmanifest','.woff','.woff2'}
for source in root.iterdir():
    if source.is_file() and not source.name.startswith('.') and source.suffix.lower() in public_extensions:
        shutil.copy2(source,output/source.name)
print('Pages artifact built in _site; application assets and legacy public URLs retained.')
