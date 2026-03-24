import pathlib
import fitz

pdf_path = pathlib.Path(r"c:\Users\FlowHG\Desktop\taberna Boo Gastronomia\MENU TABERNA BOO, REMODELACIÓN 2026 (1).pdf")
out_path = pathlib.Path(r"c:\Users\FlowHG\Desktop\taberna Boo Gastronomia\menu_extracted.txt")

doc = fitz.open(pdf_path)
text = "\n\n".join(page.get_text("text") for page in doc)
out_path.write_text(text, encoding="utf-8")
print(f"pages={doc.page_count} chars={len(text)} out={out_path}")
