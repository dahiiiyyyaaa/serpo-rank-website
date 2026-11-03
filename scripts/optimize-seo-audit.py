from pathlib import Path
from PIL import Image
import io,json,hashlib,sys
originals = Path(sys.argv[1]) if len(sys.argv) > 1 else None
root=Path.cwd()
# Preserve all supplied originals; optimise generated web copies only.
items=[
 ('public/images/services-hero.png','public/images/optimized/services-hero-1774.webp',1774,82),
 ('public/images/pricing-seo-blog-bonus.webp','public/images/optimized/pricing-seo-blog-bonus-1200.webp',1200,82),
 (str(originals/'ChatGPT Image Oct 28, 2026, 11_12_23 PM-3.png') if originals else 'public/images/blog/home-cleaning-profile-optimization-guide-1448.webp','public/images/blog/home-cleaning-profile-optimization-guide-1200.webp',1200,80),
 (str(originals/'ChatGPT Image Oct 28, 2026, 11_11_18 PM-1.png') if originals else 'public/images/blog/sunlit-towels-and-botanical-cleaning-vignette-1448.webp','public/images/blog/sunlit-towels-and-botanical-cleaning-vignette-1200.webp',1200,82),
]
report=[]
for source,dest,width,quality in items:
 target=root/dest
 before=target.stat().st_size
 with Image.open(source) as im:
  im=im.resize((width,round(im.height*width/im.width)),Image.Resampling.LANCZOS)
  output=io.BytesIO()
  im.save(output,'WEBP',quality=quality,method=6)
  data=output.getvalue()
  target.write_bytes(data)
  report.append({'path':dest,'before':before,'after':len(data),'width':im.width,'height':im.height,'quality':quality})
founder=root/'public/images/dahya-founder.jpeg'
report.append({'path':str(founder.relative_to(root)),'unchanged':True,'sha256':hashlib.sha256(founder.read_bytes()).hexdigest()})
(root/'docs/seo-migration/images.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
