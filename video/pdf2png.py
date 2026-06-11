import fitz
import sys

pdf_path = sys.argv[1]
doc = fitz.open(pdf_path)
for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=130)
    out = pdf_path.replace(".pdf", f"-slide-{i+1}.png")
    pix.save(out)
    print(out)
