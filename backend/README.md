# Welcome to PDF Chatbot! 

Ever wanted to have a conversation with your PDFs? This backend service makes that possible by handling all the heavy lifting - from processing your PDFs to understanding questions and finding the right answers.

## Getting Started 

Setting up the backend is straightforward. Just follow these steps:

### 1. Create Your Development Environment

Set Virtual enivronment, open cmd, run

```bash
python -m venv env
source env/bin/activate 
```

### 2. Install the packages

All the required packages are listed in requirements.txt. Install them with:

```bash
pip install -r requirements.txt
```

### 3. Run 


```bash
uvicorn app.main:app --reload --port 5000
```

Once running, server will be ready to chat at http://localhost:5000 

### Next

- Start sending PDFs to process
- Ask questions about your documents
