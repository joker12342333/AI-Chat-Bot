# Welcome to PDF Chatbot! 

Ever wanted to have a conversation with your PDFs? This backend service makes that possible by handling all the heavy lifting - from processing your PDFs to understanding questions and finding the right answers.

## Getting Started 

Setting up the backend is straightforward. Just follow these steps:

### 1. Create Your Development Environment

Set Virtual enivronment, open cmd, run

```bash
python -m venv env
source venv\Scripts\activate 
```

### 2.1 Install the packages

All the required packages are listed in requirements.txt. Install them with:

```bash
pip install -r requirements.txt
```
Wait for 5-10  minutes. Might take time

### 2.2. Install appropriate numpy
```bash
pip install numpy==1.24.3
```

### 3. Run 


```bash
uvicorn app.main:app --reload --port 5000
```

Once running, server will be ready to chat at http://localhost:5000 

### Next

- Start sending PDFs to process
- Ask questions about your documents
