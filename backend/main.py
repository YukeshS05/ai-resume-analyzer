from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import resume

load_dotenv()

app = FastAPI(
    title="AI Resume Analyzer",
    description="Analyze resumes using NLP and Generative AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)

@app.get("/")
def read_root():
    return {"message": "AI Resume Analyzer API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}