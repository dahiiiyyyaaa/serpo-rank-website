"""Make responsive local variants of the user-supplied featured-guide photograph."""
from pathlib import Path
from PIL import Image

source = Path(r'C:\Users\100neggawatts\Downloads\EE16CBB1-BAC1-4E45-8F38-B1D6B0F51DDF (1).png')
output = Path(__file__).resolve().parents[1] / 'public' / 'images' / 'optimized'
with Image.open(source) as original:
    print('source', original.size)
    image = original.convert('RGB')
    for width in (480, 768, 1200, image.width):
        resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
        path = (output.parent / 'serpo_rank_featured_blog_photo.webp' if width == image.width
                else output / f'serpo_rank_featured_blog_photo-{width}.webp')
        resized.save(path, 'WEBP', quality=86, method=6)
        print(path.name, path.stat().st_size)
