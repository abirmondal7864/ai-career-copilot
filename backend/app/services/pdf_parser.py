import pymupdf


def extract_text_from_pdf(file_path: str) -> str:
    document = pymupdf.open(file_path)

    text_parts: list[str] = []

    for page in document:
        page_text = page.get_text("text")
        if isinstance(page_text, str):
            text_parts.append(page_text)

    document.close()

    return "\n".join(text_parts).strip()