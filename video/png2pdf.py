import fitz
import glob
import os

folder = r"C:\claude-code\Personale\app segnapunti beybladex\video"
pngs = sorted(
    glob.glob(os.path.join(folder, "slide-video-ai-slide-*.png")),
    key=lambda p: int(p.rsplit("-", 1)[1].split(".")[0]),
)

doc = fitz.open()
for p in pngs:
    img = fitz.open(p)
    rect = img[0].rect
    pdfbytes = img.convert_to_pdf()
    img.close()
    imgpdf = fitz.open("pdf", pdfbytes)
    page = doc.new_page(width=rect.width, height=rect.height)
    page.show_pdf_page(page.rect, imgpdf, 0)

out = os.path.join(folder, "slide-video-ai.pdf")
doc.save(out)
doc.close()
print("OK", out, len(pngs), "pagine")
