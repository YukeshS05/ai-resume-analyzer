from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_resume(resume_text: str, job_description: str = "") -> dict:
    jd_section = f"\nJOB DESCRIPTION TO MATCH AGAINST:\n{job_description}" if job_description else ""

    prompt = f"""
You are an expert ATS (Applicant Tracking System) and professional career coach.
Analyze the resume below and return ONLY a valid JSON object with no extra text.

The JSON must have exactly these fields:
{{
  "overall_score": (integer 0-100),
  "section_scores": {{
    "contact_info": (integer 0-100),
    "summary": (integer 0-100),
    "skills": (integer 0-100),
    "experience_projects": (integer 0-100),
    "education": (integer 0-100)
  }},
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "missing_keywords": ["keyword1", "keyword2", "keyword3"],
  "rewritten_summary": "A stronger professional summary for this person",
  "ats_tips": ["tip 1", "tip 2", "tip 3"]
}}

RESUME:
{resume_text}
{jd_section}

Return ONLY the JSON. No markdown, no explanation, no extra text.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    response_text = response.choices[0].message.content.strip()

    if response_text.startswith("```"):
        response_text = response_text.split("```")[1]
        if response_text.startswith("json"):
            response_text = response_text[4:]

    return json.loads(response_text)