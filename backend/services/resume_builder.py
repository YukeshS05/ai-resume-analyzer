from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def build_resume(resume_text: str, job_description: str) -> dict:
    prompt = f"""
You are an expert resume writer and ATS optimization specialist.

Using the information extracted from the candidate's existing resume, build a completely new, 
ATS-optimized resume tailored specifically for the job description provided.

RULES:
1. Extract ALL real information from the existing resume (name, contact, education, projects, skills)
2. Use EXACT details from their resume — never invent fake experience
3. If information is missing that would strengthen the resume, add a placeholder like [Your Company Name], [Years of Experience], [Certification Name]
4. Optimize every bullet point with strong action verbs and quantified achievements
5. Include all keywords from the job description naturally throughout the resume
6. Make every section ATS-friendly
7. Return ONLY valid JSON, no markdown, no extra text

Return this exact JSON structure:
{{
  "personal_info": {{
    "name": "extracted name",
    "email": "extracted email",
    "phone": "extracted phone",
    "linkedin": "extracted linkedin or [Your LinkedIn URL]",
    "github": "extracted github or [Your GitHub URL]",
    "location": "extracted location or [Your City, State]"
  }},
  "professional_summary": "A powerful 3-4 sentence ATS-optimized summary using JD keywords",
  "skills": {{
    "technical": ["skill1", "skill2", "..."],
    "soft": ["skill1", "skill2", "..."]
  }},
  "experience": [
    {{
      "title": "Job Title or [Your Job Title]",
      "company": "Company Name or [Your Company Name]",
      "duration": "Start Date - End Date or [Start Date] - [End Date]",
      "location": "City, State or [Location]",
      "bullets": [
        "Strong action verb + task + quantified result",
        "Strong action verb + task + quantified result"
      ]
    }}
  ],
  "education": [
    {{
      "degree": "extracted degree",
      "institution": "extracted institution",
      "duration": "extracted duration",
      "gpa": "extracted GPA or [Your GPA]"
    }}
  ],
  "projects": [
    {{
      "name": "project name",
      "technologies": "tech stack used",
      "bullets": [
        "Strong description with metrics and impact"
      ]
    }}
  ],
  "certifications": ["cert1", "cert2"],
  "achievements": ["achievement1", "achievement2"]
}}

EXISTING RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return ONLY the JSON object.
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


def generate_resume_pdf(resume_data: dict, output_path: str,
                        school_info: dict = None, is_fresher: bool = False) -> str:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
    from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=0.65*inch,
        leftMargin=0.65*inch,
        topMargin=0.6*inch,
        bottomMargin=0.6*inch
    )

    story = []

    # Color palette
    dark       = colors.HexColor('#1a1a1a')
    green      = colors.HexColor('#10b981')
    gray       = colors.HexColor('#6b7280')
    light_gray = colors.HexColor('#9ca3af')
    divider    = colors.HexColor('#e5e7eb')

    # ── Styles ──────────────────────────────────────────────────────────────
    name_style = ParagraphStyle(
        'Name',
        fontSize=24,
        fontName='Helvetica-Bold',
        textColor=dark,
        alignment=TA_CENTER,
        spaceAfter=0,       # We add an explicit Spacer below
        spaceBefore=0,
        leading=28
    )

    contact_style = ParagraphStyle(
        'Contact',
        fontSize=9,
        fontName='Helvetica',
        textColor=gray,
        alignment=TA_CENTER,
        spaceBefore=6,      # ← key fix: breathing room between name and contacts
        spaceAfter=12,
        leading=13
    )

    section_style = ParagraphStyle(
        'Section',
        fontSize=10.5,
        fontName='Helvetica-Bold',
        textColor=green,
        spaceBefore=12,
        spaceAfter=3,
        leading=14
    )

    body_style = ParagraphStyle(
        'Body',
        fontSize=9.5,
        fontName='Helvetica',
        textColor=dark,
        spaceAfter=4,
        leading=14
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        fontSize=9.5,
        fontName='Helvetica',
        textColor=dark,
        leftIndent=14,
        spaceAfter=2,
        leading=13
    )

    sub_style = ParagraphStyle(
        'Sub',
        fontSize=10,
        fontName='Helvetica-Bold',
        textColor=dark,
        spaceAfter=1,
        spaceBefore=4,
        leading=13
    )

    meta_style = ParagraphStyle(
        'Meta',
        fontSize=9,
        fontName='Helvetica',
        textColor=light_gray,
        spaceAfter=4,
        leading=12
    )

    edu_label_style = ParagraphStyle(
        'EduLabel',
        fontSize=9,
        fontName='Helvetica-Bold',
        textColor=gray,
        spaceAfter=1,
        leading=12
    )

    def section_divider():
        return HRFlowable(width="100%", thickness=0.4,
                          color=divider, spaceAfter=5, spaceBefore=0)

    def green_divider():
        return HRFlowable(width="100%", thickness=1.5,
                          color=green, spaceAfter=12, spaceBefore=4)

    # ── Header: Name ────────────────────────────────────────────────────────
    info = resume_data.get('personal_info', {})
    story.append(Paragraph(info.get('name', ''), name_style))
    story.append(Spacer(1, 6))   # explicit gap between name and contacts

    # ── Header: Contact line ────────────────────────────────────────────────
    contact_parts = []
    for key in ['email', 'phone', 'location', 'linkedin', 'github']:
        val = info.get(key, '').strip()
        if val and not val.startswith('['):
            contact_parts.append(val)
        elif val:
            contact_parts.append(val)   # include placeholders too

    contact_line = '  |  '.join(contact_parts)
    story.append(Paragraph(contact_line, contact_style))
    story.append(green_divider())

    # ── Professional Summary ────────────────────────────────────────────────
    summary = resume_data.get('professional_summary', '')
    if summary:
        story.append(Paragraph('PROFESSIONAL SUMMARY', section_style))
        story.append(section_divider())
        story.append(Paragraph(summary, body_style))

    # ── Skills ──────────────────────────────────────────────────────────────
    skills = resume_data.get('skills', {})
    tech   = skills.get('technical', [])
    soft   = skills.get('soft', [])
    if tech or soft:
        story.append(Paragraph('SKILLS', section_style))
        story.append(section_divider())
        if tech:
            story.append(Paragraph(f"<b>Technical:</b>  {', '.join(tech)}", body_style))
        if soft:
            story.append(Paragraph(f"<b>Soft Skills:</b>  {', '.join(soft)}", body_style))

    # ── Experience (skip if fresher) ─────────────────────────────────────────
    experience = resume_data.get('experience', [])
    if experience and not is_fresher:
        story.append(Paragraph('EXPERIENCE', section_style))
        story.append(section_divider())
        for exp in experience:
            title   = exp.get('title', '')
            company = exp.get('company', '')
            story.append(Paragraph(f"{title}  —  {company}", sub_style))
            story.append(Paragraph(
                f"{exp.get('duration','')}  |  {exp.get('location','')}",
                meta_style
            ))
            for bullet in exp.get('bullets', []):
                if bullet.strip():
                    story.append(Paragraph(f"•  {bullet}", bullet_style))
            story.append(Spacer(1, 4))

    # ── Projects (skip empty ones) ───────────────────────────────────────────
    projects = [p for p in resume_data.get('projects', []) if p.get('name', '').strip()]
    if projects:
        story.append(Paragraph('PROJECTS', section_style))
        story.append(section_divider())
        for proj in projects:
            story.append(Paragraph(
                f"{proj.get('name','')}  |  <font color='#6b7280'>{proj.get('technologies','')}</font>",
                sub_style
            ))
            for bullet in proj.get('bullets', []):
                if bullet.strip():
                    story.append(Paragraph(f"•  {bullet}", bullet_style))
            story.append(Spacer(1, 4))

    # ── Education ───────────────────────────────────────────────────────────
    education = resume_data.get('education', [])
    has_school = school_info and school_info.get('school_name', '').strip()

    if education or has_school:
        story.append(Paragraph('EDUCATION', section_style))
        story.append(section_divider())

        # College entries
        for edu in education:
            degree      = edu.get('degree', '')
            institution = edu.get('institution', '')
            duration    = edu.get('duration', '')
            gpa         = edu.get('gpa', '')

            story.append(Paragraph(f"{degree}  —  {institution}", sub_style))
            meta_parts = []
            if duration: meta_parts.append(duration)
            if gpa:      meta_parts.append(f"CGPA: {gpa}")
            if meta_parts:
                story.append(Paragraph('  |  '.join(meta_parts), meta_style))

        # School entry (from frontend school_info)
        if has_school:
            school_name    = school_info.get('school_name', '')
            board          = school_info.get('board', '')
            year           = school_info.get('year_of_passing', '')
            percentage     = school_info.get('percentage', '')

            story.append(Spacer(1, 4))
            label = f"Higher Secondary ({board})" if board else "Higher Secondary"
            story.append(Paragraph(f"{label}  —  {school_name}", sub_style))
            meta_parts = []
            if year:       meta_parts.append(f"Year: {year}")
            if percentage: meta_parts.append(f"Percentage: {percentage}")
            if meta_parts:
                story.append(Paragraph('  |  '.join(meta_parts), meta_style))

    # ── Certifications ───────────────────────────────────────────────────────
    certs = resume_data.get('certifications', [])
    if certs:
        story.append(Paragraph('CERTIFICATIONS', section_style))
        story.append(section_divider())
        for cert in certs:
            if cert.strip():
                story.append(Paragraph(f"•  {cert}", bullet_style))

    # ── Achievements ─────────────────────────────────────────────────────────
    achievements = resume_data.get('achievements', [])
    if achievements:
        story.append(Paragraph('ACHIEVEMENTS', section_style))
        story.append(section_divider())
        for ach in achievements:
            if ach.strip():
                story.append(Paragraph(f"•  {ach}", bullet_style))

    doc.build(story)
    return output_path