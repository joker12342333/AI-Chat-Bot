from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from .pdf_processor import process_pdf
from .vector_search import VectorStore
from .store import global_store
import re

class Query(BaseModel):
    query: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_pdf(pdf: UploadFile = File(...)):
    try:
        content = await pdf.read()
        pdf_path = f"temp_{pdf.filename}"
        
        with open(pdf_path, "wb") as f:
            f.write(content)
        
        chunks = process_pdf(pdf_path)

        if global_store.vector_store is None:
            vector_store = VectorStore()
            global_store.vector_store = vector_store
        
        global_store.vector_store.add_texts(chunks)
        
        os.remove(pdf_path)
        
        return {"message": "PDF processed successfully"}
    except Exception as e:
        print(f"Error in upload: {e}")
        return {"error": str(e)}, 400

@app.post("/chat")
async def chat(query: Query):
    try:
        if global_store.vector_store is None:
            return {"response": "Please upload a document first."}

        response = global_store.vector_store.search(query.query)
        return {"response": response}
        
    except Exception as e:
        print(f"Error in chat: {e}")
        return {"error": "Sorry, I couldn't understand that. Please try again."}, 400