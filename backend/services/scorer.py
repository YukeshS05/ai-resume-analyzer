def calculate_ats_score(resume_text: str, job_description: str = "") -> dict:
    resume_lower = resume_text.lower()

    common_action_verbs = [
        "developed", "built", "designed", "implemented", "created",
        "optimized", "managed", "led", "analyzed", "deployed",
        "achieved", "improved", "automated", "integrated", "tested"
    ]

    formatting_checks = {
        "has_email": "@" in resume_text,
        "has_phone": any(char.isdigit() for char in resume_text),
        "has_linkedin": "linkedin" in resume_lower,
        "has_github": "github" in resume_lower,
        "has_education": "education" in resume_lower,
        "has_skills": "skills" in resume_lower,
        "has_projects": "project" in resume_lower,
        "good_length": 200 <= len(resume_text.split()) <= 800
    }

    action_verb_count = sum(
        1 for verb in common_action_verbs if verb in resume_lower
    )

    formatting_score = (sum(formatting_checks.values()) / len(formatting_checks)) * 100

    action_verb_score = min(action_verb_count * 10, 100)

    jd_match_score = 0
    matched_keywords = []
    if job_description:
        jd_words = set(job_description.lower().split())
        resume_words = set(resume_lower.split())
        common_words = {"the", "a", "an", "and", "or", "in", "to", "of", "for", "with", "is", "are"}
        jd_keywords = jd_words - common_words
        matched = jd_keywords.intersection(resume_words)
        matched_keywords = list(matched)[:10]
        jd_match_score = (len(matched) / len(jd_keywords) * 100) if jd_keywords else 0

    if job_description:
        final_score = (formatting_score * 0.4) + (action_verb_score * 0.2) + (jd_match_score * 0.4)
    else:
        final_score = (formatting_score * 0.6) + (action_verb_score * 0.4)

    return {
        "ats_score": round(final_score),
        "formatting_checks": formatting_checks,
        "action_verbs_found": action_verb_count,
        "jd_match_score": round(jd_match_score),
        "matched_keywords": matched_keywords
    }