from PyPDF2 import PdfReader
from typing import List

def process_pdf(pdf_path: str) -> List[str]:
    """Extract game rules with better structure"""
    reader = PdfReader(pdf_path)
    games = []
    current_game = ""
    
    for page in reader.pages:
        text = page.extract_text()
        sections = text.split("\n\n")
        
        for section in sections:
            if "Number of Players:" in section:
                if current_game:
                    games.append(current_game)
                current_game = section
            elif current_game:
                current_game += " " + section.strip()
                
    if current_game:
        games.append(current_game)
        
    return [" ".join(game.split()) for game in games]

    