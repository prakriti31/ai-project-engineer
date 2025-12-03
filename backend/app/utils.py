from io import BytesIO
import os
from typing import List
from pypdf import PdfReader

def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    # Parse PDF bytes into text
    reader = PdfReader(BytesIO(file_bytes))
    pages = []
    for p in reader.pages:
        pages.append(p.extract_text() or "")
    return "\n\n".join(pages)

def split_into_chunks(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    text = text.replace("\r\n", "\n")
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks
