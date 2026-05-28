# 🤖 ResumeAI — AI-Powered Resume Analyzer & Builder

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-10b981?style=for-the-badge)](https://ai-resume-analyzer-pink-nu.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-YukeshS05-181717?style=for-the-badge&logo=github)](https://github.com/YukeshS05/ai-resume-analyzer)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Yukesh_S-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/yukesh-s)

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)

**A full-stack AI SaaS web application that analyzes resumes, provides ATS scores, and builds perfectly tailored resumes using Generative AI.**

[🚀 Try Live Demo](https://ai-resume-analyzer-pink-nu.vercel.app) · [📂 GitHub Repo](https://github.com/YukeshS05/ai-resume-analyzer) · [🐛 Report Bug](https://github.com/YukeshS05/ai-resume-analyzer/issues)

</div>

---

## 🌐 Live Demo

> 👉 **[ai-resume-analyzer-pink-nu.vercel.app](https://ai-resume-analyzer-pink-nu.vercel.app)**

> ⚡ Note: Backend is hosted on Render free tier — first request may take 30–50 seconds to wake up. Subsequent requests are instant.

---

## 📸 Screenshots

| Landing Page | Resume Analyzer | AI Resume Builder |
|---|---|---|
| Dark premium UI with animated hero | ATS score with section breakdown | Before & after score comparison |

---

## ✨ Features

### 📊 Resume Analyzer
- **ATS Score** — Instant 0–100 compatibility score with detailed breakdown
- **Section Scoring** — Individual scores for Contact, Summary, Skills, Experience, Projects, Education
- **AI Strengths & Improvements** — Specific actionable suggestions powered by LLaMA 3.3 70B
- **Missing Keywords** — Discover keywords recruiters and ATS systems look for
- **AI Rewritten Summary** — Get a stronger, optimized professional summary
- **ATS Optimization Tips** — 3 specific tips to beat applicant tracking systems
- **Smart Threshold Logic** — Score below 80 triggers urgent resume rebuild prompt

### 🏗️ AI Resume Builder
- **Full Resume Generation** — AI builds a complete ATS-optimized resume from your existing one
- **Job Description Matching** — Tailored specifically to any job description you paste
- **Smart Placeholder System** — Missing info shown in amber as `[Your Company Name]` — fill in directly on screen
- **Before & After Score** — See exactly how much your score improved
- **Fresher Mode** — Toggle to remove experience section entirely
- **Dynamic Projects** — Add, edit, or delete projects with bullet points
- **Separate Education Sections** — College (CGPA) and School (Percentage) handled separately
- **Download as PDF** — Clean, professionally formatted PDF resume

### 🎨 UI & UX
- Premium dark theme (black + emerald green) inspired by Claude AI and Perplexity
- Animated score gauge that counts up from 0
- Framer Motion animations — fade-ins, staggered cards, progress bars
- Drag & drop PDF upload with live feedback
- AI thinking animation during analysis
- Fully responsive design

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI framework |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Animations** | Framer Motion | Smooth UI animations |
| **Backend** | Python + FastAPI | REST API server |
| **AI / LLM** | Groq API + LLaMA 3.3 70B | Resume analysis & building |
| **NLP** | pdfplumber | PDF text extraction |
| **Scoring** | Custom ATS Engine | Keyword & formatting scoring |
| **PDF Generation** | ReportLab | Resume PDF creation |
| **Database** | MongoDB Atlas | Cloud database |
| **Frontend Deploy** | Vercel | Global CDN hosting |
| **Backend Deploy** | Render | Python web service hosting |

---

## 🚀 Getting Started Locally

### Prerequisites
- Python 3.13+
- Node.js 22+
- MongoDB Atlas account (free)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository
```bash
git clone https://github.com/YukeshS05/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

Create `.env` file in the `backend` folder:
```env
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URL=your_mongodb_atlas_connection_string
SECRET_KEY=your_secret_key_here
DATABASE_NAME=resumeanalyzer
```

Start the backend:
```bash
uvicorn main:app --reload
```
Backend runs at: `http://127.0.0.1:8000`
API docs at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 📁 Project Structure

```
ai-resume-analyzer/
│
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── database.py              # MongoDB Atlas connection
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment variables template
│   │
│   ├── routers/
│   │   └── resume.py            # All resume API endpoints
│   │
│   └── services/
│       ├── pdf_parser.py        # PDF text extraction (pdfplumber)
│       ├── ai_analyzer.py       # Groq AI + LLaMA 3.3 integration
│       ├── scorer.py            # Custom ATS scoring engine
│       └── resume_builder.py   # AI resume builder + PDF generator
│
├── frontend/
│   ├── index.html               # App entry with custom favicon & title
│   └── src/
│       ├── App.jsx              # React Router setup
│       └── pages/
│           ├── Home.jsx         # Landing page with animations
│           ├── Analyzer.jsx     # Resume upload + AI results page
│           └── Builder.jsx      # AI resume builder page
│
├── .gitignore                   # Protects .env and node_modules
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/health` | Server status |
| `POST` | `/resume/analyze` | Analyze resume PDF with AI |
| `POST` | `/resume/build` | Build new ATS resume from PDF + JD |
| `POST` | `/resume/generate-final-pdf` | Generate final PDF with user edits |
| `GET` | `/resume/download/{filename}` | Download generated PDF |

---

## 🧠 How It Works

```
User uploads PDF
      ↓
pdfplumber extracts clean text
      ↓
Groq API + LLaMA 3.3 70B analyzes the resume
      ↓
Custom ATS scoring engine calculates compatibility
      ↓
Results: Score + Strengths + Improvements + Keywords + Summary
      ↓
[Optional] AI builds new resume tailored to job description
      ↓
User edits placeholders → Downloads final PDF
```

---

## 🗺️ Roadmap — Version 2.0

These features are currently in development:

- [ ] **Role-Specific Analysis** — Target a specific role (SWE, Data Scientist, PM) for tailored feedback
- [ ] **LinkedIn Bio Generator** — Auto-generate LinkedIn headline, About section and summary
- [ ] **Cover Letter Generator** — AI writes a personalized cover letter from your resume + JD
- [ ] **Skill Gap Analyzer** — See exactly what skills you're missing for your dream job with resource links
- [ ] **ATS Simulator** — Simulate how Workday, Greenhouse, Taleo parse your resume differently

---

## 👨‍💻 Author

**Yukesh S** — M.Tech Integrated Software Engineering, VIT University

- 🌐 **Live Project:** [ai-resume-analyzer-pink-nu.vercel.app](https://ai-resume-analyzer-pink-nu.vercel.app)
- 💼 **LinkedIn:** [linkedin.com/in/yukesh-s](https://linkedin.com/in/yukesh-s)
- 🐙 **GitHub:** [github.com/YukeshS05](https://github.com/YukeshS05)
- 📧 **Email:** yukesh.s.dev@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**⭐ If this project helped you, please give it a star on GitHub!**

Built with ❤️ using Groq AI · FastAPI · React · MongoDB

</div>
