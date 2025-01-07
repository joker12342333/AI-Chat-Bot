from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from typing import List
import re

class VectorStore:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.texts = []
        self.index = None
        
    def add_texts(self, texts: List[str]):
        self.texts = texts
        embeddings = self.model.encode(texts)
        
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(np.array(embeddings).astype('float32'))
    
    def extract_answer(self, text: str, query: str) -> str:
        query_lower = query.lower()
        
        if "who starts" in query_lower or "starts first" in query_lower:
            match = re.search(r'([^.]*(?:start|begin)[^.]*\.)', text)
            if match:
                return match.group(1).strip()
            
        elif "how many players" in query_lower:
            match = re.search(r'Number of Players:\s*([^.]*)', text)
            if match:
                return f"You need {match.group(1).strip()}"
            
        elif "how" in query_lower and "play" in query_lower:
            match = re.search(r'Instructions:(.*?)(?=\w+\s+(?:This|It)\s+is\s+|$)', text, re.DOTALL)
            if match:
                instructions = match.group(1).strip()
                return f"Here's how to play:\n{instructions}"
            
        return text.strip()
    
    def search(self, query: str, k: int = 1) -> str:
        if not self.index or not self.texts:
            return "Please upload a document first."
            
        query_embedding = self.model.encode([query])
        distances, indices = self.index.search(np.array(query_embedding).astype('float32'), k)
        
        if indices[0][0] >= len(self.texts):
            return "No relevant content found."
            
        result = self.texts[indices[0][0]]
        return self.extract_answer(result, query)
