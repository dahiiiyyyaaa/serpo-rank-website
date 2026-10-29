"""Create local delivery variants; supplied PNG originals are never edited."""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
SOURCE = Path('C:/Users/100neggawatts/Documents/Codex/2026-10-28/my/outputs/serpo-rank-guide')
NAMES = {
    1: 'sunlit-towels-and-botanical-cleaning-vignette',
    2: 'keyword-intent-mapped-to-content-types',
    3: 'home-cleaning-profile-optimization-guide',
    4: 'recommended-website-structure-diagram',
    5: 'understanding-core-web-vitals',
    6: 'reliable-customer-review-workflow',
    7: 'from-seo-visibility-to-revenue',
    8: 'cleaning-website-audit-comparison-table',
}
manifest = {}
for number, name in NAMES.items():
    matches = list(SOURCE.glob(f'ChatGPT Image * PM-{number}.png'))
    if len(matches) != 1:
        raise RuntimeError(f'Expected one image for {number}, found {matches}')
    path = matches[0]
    with Image.open(path) as image:
        width, height = image.size
        item = {'name': name, 'original': path.name, 'width': width, 'height': height,
                'originalBytes': path.stat().st_size, 'variants': [],
                'treatment': 'removed from page' if number == 7 else ('rebuilt as accessible HTML' if number in (6, 8) else 'responsive WebP')}
        if number == 7:
            for old_variant in (ROOT / 'assets').glob(f'{name}-*.webp'):
                old_variant.unlink()
        if number not in (6, 7, 8):
            for size in sorted({480, 768, 1200, width}):
                if size > width:
                    continue
                target = ROOT / 'assets' / f'{name}-{size}.webp'
                resized = image.convert('RGB').resize((size, round(height * size / width)), Image.Resampling.LANCZOS)
                for quality in range(90 if number == 1 else 94, 79, -2):
                    resized.save(target, 'WEBP', quality=quality, method=6)
                    if target.stat().st_size <= 200_000:
                        break
                if target.stat().st_size > 200_000:
                    raise RuntimeError(f'{target.name} remains above 200 KB')
                item['variants'].append({'width': size, 'src': 'assets/' + target.name, 'bytes': target.stat().st_size})
        manifest[str(number)] = item
        print(f'{number}: {width}x{height}, {item["originalBytes"]:,} bytes -> ' + ', '.join(f'{v["width"]}w: {v["bytes"]:,}' for v in item['variants']))
(ROOT / 'graphics-manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf8')
