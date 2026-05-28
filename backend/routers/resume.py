from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi import HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.pdf_parser import extract_text_from_pdf, save_uploaded_file
from services.ai_analyzer import analyze_resume
from services.scorer import calculate_ats_score
from services.resume_builder import build_resume, generate_resume_pdf
import os
import uuid

router = APIRouter(prefix="/resume", tags=["resume"])


# ── Pydantic models for final PDF generation ────────────────────────────────
class PersonalInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    linkedin: str = ""
    github: str = ""
    location: str = ""

class SkillsModel(BaseModel):
    technical: List[str] = []
    soft: List[str] = []

class ExperienceItem(BaseModel):
    title: str = ""
    company: str = ""
    duration: str = ""
    location: str = ""
    bullets: List[str] = []

class ProjectItem(BaseModel):
    name: str = ""
    technologies: str = ""
    bullets: List[str] = []

class EducationItem(BaseModel):
    degree: str = ""
    institution: str = ""
    duration: str = ""
    gpa: str = ""

class SchoolInfo(BaseModel):
    school_name: str = ""
    board: str = ""
    year_of_passing: str = ""
    percentage: str = ""

class GeneratePDFRequest(BaseModel):
    personal_info: PersonalInfo
    professional_summary: str = ""
    skills: SkillsModel
    experience: List[ExperienceItem] = []
    projects: List[ProjectItem] = []
    education: List[EducationItem] = []
    certifications: List[str] = []
    achievements: List[str] = []
    school_info: Optional[SchoolInfo] = None
    is_fresher: bool = False


def build_full_text_from_resume(built_resume: dict) -> str:
    lines = []
    info = built_resume.get('personal_info', {})
    for key in ['name', 'email', 'phone', 'linkedin', 'github', 'location']:
        lines.append(info.get(key, ''))
    lines.append("\nPROFESSIONAL SUMMARY")
    lines.append(built_resume.get('professional_summary', ''))
    skills = built_resume.get('skills', {})
    lines.append("\nSKILLS")
    lines.append("Technical: " + ', '.join(skills.get('technical', [])))
    lines.append("Soft Skills: " + ', '.join(skills.get('soft', [])))
    for exp in built_resume.get('experience', []):
        lines.append(f"{exp.get('title','')} at {exp.get('company','')}")
        for b in exp.get('bullets', []): lines.append(f"- {b}")
    for proj in built_resume.get('projects', []):
        lines.append(f"{proj.get('name','')} | {proj.get('technologies','')}")
        for b in proj.get('bullets', []): lines.append(f"- {b}")
    for edu in built_resume.get('education', []):
        lines.append(f"{edu.get('degree','')} - {edu.get('institution','')}")
    for cert in built_resume.get('certifications', []):
        lines.append(f"- {cert}")
    for ach in built_resume.get('achievements', []):
        lines.append(f"- {ach}")
    return '\n'.join([l for l in lines if l.strip()])


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


@router.post("/build")
async def build_resume_endpoint(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    file_path = save_uploaded_file(file)
    resume_text = extract_text_from_pdf(file_path)

    original_ai_score = analyze_resume(resume_text, job_description)
    original_ats = calculate_ats_score(resume_text, job_description)

    built_resume = build_resume(resume_text, job_description)
    built_text = build_full_text_from_resume(built_resume)

    new_ai_score = analyze_resume(built_text, job_description)
    new_ats = calculate_ats_score(built_text, job_description)

    # Generate a preview PDF (will be replaced by final PDF on download)
    output_path = f"uploads/built_resume_{uuid.uuid4().hex[:8]}.pdf"
    generate_resume_pdf(built_resume, output_path)

    os.remove(file_path)
    return {
        "success": True,
        "built_resume": built_resume,
        "pdf_path": output_path,
        "score_comparison": {
            "original_score": original_ai_score.get("overall_score", 0),
            "new_score": new_ai_score.get("overall_score", 0),
            "original_ats": original_ats.get("ats_score", 0),
            "new_ats": new_ats.get("ats_score", 0)
        }
    }


@router.post("/generate-final-pdf")
async def generate_final_pdf_endpoint(request: GeneratePDFRequest):
    """Generates a final PDF from the user's edited resume data."""
    resume_data = {
        "personal_info": dict(request.personal_info),
        "professional_summary": request.professional_summary,
        "skills": dict(request.skills),
        "experience": [dict(e) for e in request.experience],
        "projects": [
            dict(p) for p in request.projects
            if p.name.strip()  # skip empty projects
        ],
        "education": [dict(e) for e in request.education],
        "certifications": request.certifications,
        "achievements": request.achievements,
    }

    school_info = dict(request.school_info) if request.school_info else None
    is_fresher = request.is_fresher

    output_path = f"uploads/final_resume_{uuid.uuid4().hex[:8]}.pdf"
    generate_resume_pdf(
        resume_data,
        output_path,
        school_info=school_info,
        is_fresher=is_fresher
    )

    return {"pdf_path": output_path}


@router.get("/download/{filename}")
async def download_resume(filename: str):
    file_path = f"uploads/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=filename
    )