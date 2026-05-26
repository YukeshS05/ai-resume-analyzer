from fastapi import APIRouter, UploadFile, File, Form
from services.pdf_parser import extract_text_from_pdf, save_uploaded_file
from services.ai_analyzer import analyze_resume
from services.scorer import calculate_ats_score
import os

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/analyze")
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    job_description: str = Form(default="")
):
    file_path = save_uploaded_file(file)

    resume_text = extract_text_from_pdf(file_path)

    ai_result = analyze_resume(resume_text, job_description)

    ats_result = calculate_ats_score(resume_text, job_description)

    os.remove(file_path)

    return {
        "success": True,
        "filename": file.filename,
        "resume_text_length": len(resume_text),
        "ai_analysis": ai_result,
        "ats_analysis": ats_result
    }