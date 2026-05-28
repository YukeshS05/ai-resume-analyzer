import { useState } from 'react'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Keywords to detect school-level education entries
const SCHOOL_KEYWORDS = [
  'higher secondary', 'hslc', 'hsc', '12th', 'matric',
  'secondary school', 'senior secondary', 'higher sec',
  'matriculation', 'sslc', '10th', 'secondary'
]

const isSchoolEntry = (degree = '') =>
  SCHOOL_KEYWORDS.some(kw => degree.toLowerCase().includes(kw))

function ScoreCard({ label, original, improved, icon }) {
  const diff = improved - original
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-gray-400 text-sm mb-4">{label}</p>
      <div className="flex items-center justify-center gap-6">
        <div>
          <p className="text-3xl font-bold text-red-400">{original}</p>
          <p className="text-xs text-gray-600 mt-1">Original</p>
        </div>
        <div className="text-gray-600">→</div>
        <div>
          <p className="text-3xl font-bold text-emerald-400">{improved}</p>
          <p className="text-xs text-gray-600 mt-1">AI Built</p>
        </div>
      </div>
      {diff > 0 && (
        <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 inline-block">
          <span className="text-emerald-400 text-sm font-semibold">+{diff} improvement</span>
        </div>
      )}
      {diff < 0 && (
        <div className="mt-3 bg-gray-800 border border-gray-700 rounded-full px-3 py-1 inline-block">
          <span className="text-gray-400 text-sm">Score varies by JD match</span>
        </div>
      )}
    </div>
  )
}

function ResumePreview({ data, onEdit, isFresher, setIsFresher, schoolInfo, setSchoolInfo }) {
  // Split AI education into college entries only — school entries are handled separately
  const collegeEducation = (data.education || []).filter(e => !isSchoolEntry(e.degree))

  const [editData, setEditData] = useState({
    ...data,
    education: collegeEducation
  })

  const isPlaceholder = (text) => text && text.includes('[')

  const updateEditData = (newData) => {
    setEditData(newData)
    onEdit(newData)
  }

  const addProject = () => {
    const newProject = { name: '', technologies: '', bullets: [''] }
    updateEditData({ ...editData, projects: [...(editData.projects || []), newProject] })
  }

  const deleteProject = (index) => {
    updateEditData({ ...editData, projects: editData.projects.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-gray-400">Your information</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-gray-400">Fill in placeholder</span>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(editData.personal_info).map(([key, value]) => (
            <div key={key}>
              <label className="text-gray-600 text-xs capitalize mb-1 block">{key.replace('_', ' ')}</label>
              <input
                className={`bg-transparent border-b text-sm focus:outline-none focus:border-emerald-500 transition w-full
                  ${isPlaceholder(value) ? 'border-amber-500/50 text-amber-400' : 'border-gray-700 text-gray-300'}`}
                value={value}
                onChange={(e) => updateEditData({
                  ...editData,
                  personal_info: { ...editData.personal_info, [key]: e.target.value }
                })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-4">Professional Summary</h3>
        <textarea
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none leading-relaxed"
          rows={4}
          value={editData.professional_summary}
          onChange={(e) => updateEditData({ ...editData, professional_summary: e.target.value })}
        />
      </div>

      {/* Skills */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-4">Skills</h3>
        <div className="mb-3">
          <label className="text-gray-500 text-xs mb-2 block">Technical Skills</label>
          <div className="flex flex-wrap gap-2">
            {editData.skills.technical.map((skill, i) => (
              <span key={i} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-sm">{skill}</span>
            ))}
          </div>
        </div>
        <div>
          <label className="text-gray-500 text-xs mb-2 block">Soft Skills</label>
          <div className="flex flex-wrap gap-2">
            {editData.skills.soft.map((skill, i) => (
              <span key={i} className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-sm">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Experience with Fresher Toggle */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Work Experience</h3>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <span className="text-gray-400 text-sm">I'm a fresher (no experience)</span>
            <div
              onClick={() => setIsFresher(!isFresher)}
              className={`w-11 h-6 rounded-full transition-all duration-300 relative ${isFresher ? 'bg-emerald-500' : 'bg-gray-700'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow ${isFresher ? 'left-5' : 'left-0.5'}`} />
            </div>
          </label>
        </div>

        {isFresher ? (
          <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl p-5 text-center">
            <p className="text-2xl mb-2">🎓</p>
            <p className="text-gray-400 text-sm font-medium">Experience section removed</p>
            <p className="text-gray-600 text-xs mt-1">This section will NOT appear in your downloaded resume</p>
          </div>
        ) : editData.experience && editData.experience.length > 0 ? (
          editData.experience.map((exp, i) => (
            <div key={i} className="mb-6 pb-6 border-b border-gray-800 last:border-0 last:mb-0 last:pb-0">
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { label: 'Job Title', field: 'title', bold: true },
                  { label: 'Company', field: 'company' },
                  { label: 'Duration', field: 'duration' },
                  { label: 'Location', field: 'location' },
                ].map(({ label, field, bold }) => (
                  <div key={field}>
                    <label className="text-gray-600 text-xs mb-1 block">{label}</label>
                    <input
                      className={`bg-transparent border-b text-sm focus:outline-none focus:border-emerald-500 transition w-full
                        ${bold ? 'font-semibold' : ''}
                        ${isPlaceholder(exp[field]) ? 'border-amber-500/50 text-amber-400' : 'border-gray-700 text-gray-300'}`}
                      value={exp[field]}
                      onChange={(e) => {
                        const updated = [...editData.experience]
                        updated[i] = { ...updated[i], [field]: e.target.value }
                        updateEditData({ ...editData, experience: updated })
                      }}
                    />
                  </div>
                ))}
              </div>
              <label className="text-gray-600 text-xs mb-2 block">Bullet Points</label>
              {exp.bullets.map((bullet, j) => (
                <div key={j} className="flex gap-2 mb-2">
                  <span className="text-emerald-500 mt-1 flex-shrink-0">▸</span>
                  <input
                    className={`bg-transparent border-b text-sm focus:outline-none focus:border-emerald-500 transition w-full
                      ${isPlaceholder(bullet) ? 'border-amber-500/50 text-amber-400' : 'border-gray-700 text-gray-300'}`}
                    value={bullet}
                    onChange={(e) => {
                      const updated = [...editData.experience]
                      updated[i].bullets[j] = e.target.value
                      updateEditData({ ...editData, experience: updated })
                    }}
                  />
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-sm">No experience found. Toggle fresher if you don't have work experience.</p>
          </div>
        )}
      </div>

      {/* Projects with Add and Delete */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Projects</h3>
          <button
            onClick={addProject}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            + Add Project
          </button>
        </div>

        {editData.projects && editData.projects.length > 0 ? (
          editData.projects.map((proj, i) => (
            <div key={i} className="mb-6 pb-6 border-b border-gray-800 last:border-0 last:mb-0 last:pb-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-xs font-medium">Project {i + 1}</span>
                <button
                  onClick={() => deleteProject(i)}
                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-lg text-xs transition"
                >
                  🗑 Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Project Name</label>
                  <input
                    className="bg-transparent border-b border-gray-700 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500 transition w-full"
                    value={proj.name}
                    placeholder="e.g. AI Resume Analyzer"
                    onChange={(e) => {
                      const updated = [...editData.projects]
                      updated[i] = { ...updated[i], name: e.target.value }
                      updateEditData({ ...editData, projects: updated })
                    }}
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Technologies Used</label>
                  <input
                    className="bg-transparent border-b border-gray-700 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 transition w-full"
                    value={proj.technologies}
                    placeholder="e.g. Python, React, MongoDB"
                    onChange={(e) => {
                      const updated = [...editData.projects]
                      updated[i] = { ...updated[i], technologies: e.target.value }
                      updateEditData({ ...editData, projects: updated })
                    }}
                  />
                </div>
              </div>
              <label className="text-gray-600 text-xs mb-2 block">Description Points</label>
              {proj.bullets.map((bullet, j) => (
                <div key={j} className="flex gap-2 mb-2">
                  <span className="text-emerald-500 mt-1 flex-shrink-0">▸</span>
                  <input
                    className="bg-transparent border-b border-gray-700 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 transition w-full"
                    value={bullet}
                    placeholder="Describe what you built and its impact..."
                    onChange={(e) => {
                      const updated = [...editData.projects]
                      updated[i].bullets[j] = e.target.value
                      updateEditData({ ...editData, projects: updated })
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const updated = [...editData.projects]
                  updated[i].bullets.push('')
                  updateEditData({ ...editData, projects: updated })
                }}
                className="text-xs text-gray-600 hover:text-emerald-400 transition mt-1 ml-5"
              >
                + Add bullet point
              </button>
            </div>
          ))
        ) : (
          <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm mb-3">No projects — section will be hidden in PDF</p>
            <button
              onClick={addProject}
              className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-sm transition hover:bg-emerald-500/20"
            >
              + Add a Project
            </button>
          </div>
        )}
      </div>

      {/* Education: College + School Separately */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-6">Education</h3>

        {/* College Section — only degree-level entries */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-800">
            <span className="text-lg">🎓</span>
            <h4 className="text-blue-400 font-semibold text-sm">College / University</h4>
          </div>
          {editData.education.length > 0 ? (
            editData.education.map((edu, i) => (
              <div key={i} className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-800/50 last:border-0">
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Degree / Programme</label>
                  <input
                    className={`bg-transparent border-b text-sm focus:outline-none focus:border-emerald-500 transition w-full
                      ${isPlaceholder(edu.degree) ? 'border-amber-500/50 text-amber-400' : 'border-gray-700 text-gray-300'}`}
                    value={edu.degree}
                    placeholder="e.g. B.Tech Computer Science"
                    onChange={(e) => {
                      const updated = [...editData.education]
                      updated[i] = { ...updated[i], degree: e.target.value }
                      updateEditData({ ...editData, education: updated })
                    }}
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">College / University Name</label>
                  <input
                    className={`bg-transparent border-b text-sm focus:outline-none focus:border-emerald-500 transition w-full
                      ${isPlaceholder(edu.institution) ? 'border-amber-500/50 text-amber-400' : 'border-gray-700 text-gray-300'}`}
                    value={edu.institution}
                    placeholder="e.g. VIT University, Vellore"
                    onChange={(e) => {
                      const updated = [...editData.education]
                      updated[i] = { ...updated[i], institution: e.target.value }
                      updateEditData({ ...editData, education: updated })
                    }}
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Duration</label>
                  <input
                    className={`bg-transparent border-b text-sm focus:outline-none focus:border-emerald-500 transition w-full
                      ${isPlaceholder(edu.duration) ? 'border-amber-500/50 text-amber-400' : 'border-gray-700 text-gray-300'}`}
                    value={edu.duration}
                    placeholder="e.g. 2021 - 2025"
                    onChange={(e) => {
                      const updated = [...editData.education]
                      updated[i] = { ...updated[i], duration: e.target.value }
                      updateEditData({ ...editData, education: updated })
                    }}
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">CGPA / GPA</label>
                  <input
                    className={`bg-transparent border-b text-sm focus:outline-none focus:border-emerald-500 transition w-full
                      ${isPlaceholder(edu.gpa) ? 'border-amber-500/50 text-amber-400' : 'border-gray-700 text-gray-300'}`}
                    value={edu.gpa}
                    placeholder="e.g. 8.5 / 10"
                    onChange={(e) => {
                      const updated = [...editData.education]
                      updated[i] = { ...updated[i], gpa: e.target.value }
                      updateEditData({ ...editData, education: updated })
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No college education found in resume.</p>
          )}
        </div>

        {/* School Section — manual entry, separate from AI data */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-800">
            <span className="text-lg">🏫</span>
            <h4 className="text-purple-400 font-semibold text-sm">Higher Secondary / School</h4>
            <span className="text-gray-600 text-xs">(will appear in resume PDF)</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 text-xs mb-1 block">School Name</label>
              <input
                className="bg-transparent border-b border-gray-700 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 transition w-full"
                value={schoolInfo.school_name}
                placeholder="e.g. Sunbeam Matric Hr. Sec. School"
                onChange={(e) => setSchoolInfo(prev => ({ ...prev, school_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-gray-600 text-xs mb-1 block">Board</label>
              <input
                className="bg-transparent border-b border-gray-700 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 transition w-full"
                value={schoolInfo.board}
                placeholder="e.g. State Board / CBSE / ICSE"
                onChange={(e) => setSchoolInfo(prev => ({ ...prev, board: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-gray-600 text-xs mb-1 block">Year of Passing</label>
              <input
                className="bg-transparent border-b border-gray-700 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 transition w-full"
                value={schoolInfo.year_of_passing}
                placeholder="e.g. 2021"
                onChange={(e) => setSchoolInfo(prev => ({ ...prev, year_of_passing: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-gray-600 text-xs mb-1 block">Percentage (%)</label>
              <input
                className="bg-transparent border-b border-gray-700 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 transition w-full"
                value={schoolInfo.percentage}
                placeholder="e.g. 92%"
                onChange={(e) => setSchoolInfo(prev => ({ ...prev, percentage: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default function Builder() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [editedResume, setEditedResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const [error, setError] = useState('')
  const [isFresher, setIsFresher] = useState(false)
  const [schoolInfo, setSchoolInfo] = useState({
    school_name: '', board: '', year_of_passing: '', percentage: ''
  })

  const loadingSteps = [
    'Reading your resume...',
    'Extracting your information...',
    'Analyzing job requirements...',
    'Building your new resume...',
    'Optimizing for ATS...',
    'Adding keywords...',
    'Calculating score improvement...',
    'Almost ready...'
  ]

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (files) => setFile(files[0])
  })

  const handleBuild = async () => {
    if (!file) return setError('Please upload your resume PDF.')
    if (!jobDescription.trim()) return setError('Please paste a job description.')
    setError('')
    setLoading(true)
    let step = 0
    setLoadingText(loadingSteps[0])
    const interval = setInterval(() => {
      step = Math.min(step + 1, loadingSteps.length - 1)
      setLoadingText(loadingSteps[step])
    }, 3000)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('job_description', jobDescription)
    try {
      const res = await axios.post('http://127.0.0.1:8000/resume/build', formData)
      setResult(res.data)
      setEditedResume(res.data.built_resume)
      // Auto-populate school section from AI extracted education data
const allEdu = res.data.built_resume.education || []
const schoolEntries = allEdu.filter(e => isSchoolEntry(e.degree))
if (schoolEntries.length > 0) {
  const school = schoolEntries[0]
  const yearMatch = school.duration?.match(/(\d{4})\s*$/)
  setSchoolInfo({
    school_name: school.institution || '',
    board: '',
    year_of_passing: yearMatch ? yearMatch[1] : '',
    percentage: ''
  })
}
    } catch {
      setError('Something went wrong. Make sure the backend is running.')
    }
    clearInterval(interval)
    setLoading(false)
  }

  // Generate fresh PDF from edited data then download
  const handleDownload = async () => {
    if (!editedResume) return
    setGeneratingPdf(true)
    try {
      const payload = {
        ...editedResume,
        experience: isFresher ? [] : (editedResume.experience || []),
        projects: (editedResume.projects || []).filter(p => p.name && p.name.trim()),
        school_info: schoolInfo,
        is_fresher: isFresher
      }
      const res = await axios.post('http://127.0.0.1:8000/resume/generate-final-pdf', payload)
      const filename = res.data.pdf_path.split('/').pop()
      window.open(`http://127.0.0.1:8000/resume/download/${filename}`, '_blank')
    } catch {
      setError('Failed to generate PDF. Please try again.')
    }
    setGeneratingPdf(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(16,185,129,0.02) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10">
        <nav className="border-b border-gray-800/50 px-8 py-4 flex justify-between items-center backdrop-blur-sm">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">AI</div>
            <span className="font-semibold">ResumeAI</span>
          </div>
          <span className="text-gray-500 text-sm">AI Resume Builder</span>
        </nav>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[80vh] gap-8"
            >
              <div className="relative w-24 h-24">
                <svg className="animate-spin w-24 h-24" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#1f2937" strokeWidth="6"/>
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#10b981" strokeWidth="6"
                    strokeLinecap="round" strokeDasharray="80 172" transform="rotate(-90 48 48)"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">📝</div>
              </div>
              <div className="text-center">
                <motion.p key={loadingText}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-400 font-medium text-lg"
                >{loadingText}</motion.p>
                <p className="text-gray-600 text-sm mt-2">Building your perfect resume... This takes about 20-30 seconds</p>
              </div>
              <div className="flex gap-2">
                {[0,1,2,3,4].map(i => (
                  <motion.div key={i} className="w-2 h-2 bg-emerald-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>

          ) : !result ? (
            <motion.div key="upload"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto px-4 py-12"
            >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-sm text-emerald-400 mb-6">
                  ✨ AI Resume Builder
                </div>
                <h1 className="text-4xl font-bold mb-2">Build Your Perfect Resume</h1>
                <p className="text-gray-400 mb-8">
                  Upload your current resume + paste a job description. Our AI will build you
                  a completely new ATS-optimized resume tailored for that exact role.
                </p>
              </motion.div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { step: '1', text: 'Upload your current resume' },
                  { step: '2', text: 'Paste the job description' },
                  { step: '3', text: 'Edit and download your resume' },
                ].map((s) => (
                  <div key={s.step} className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 text-center">
                    <div className="w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">{s.step}</div>
                    <p className="text-gray-400 text-xs">{s.text}</p>
                  </div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 mb-6
                  ${isDragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700 bg-gray-900/50 hover:border-emerald-500/50'}`}
              >
                <input {...getInputProps()} />
                <div className="text-4xl mb-3">{file ? '✅' : '📄'}</div>
                {file ? (
                  <p className="text-emerald-400 font-semibold">{file.name}</p>
                ) : (
                  <>
                    <p className="text-white font-medium mb-1">Drop your current resume here</p>
                    <p className="text-gray-500 text-sm">PDF only</p>
                  </>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6"
              >
                <label className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <span>🎯</span> Job Description
                  <span className="text-red-400 text-xs">* Required</span>
                </label>
                <textarea
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none mt-2"
                  rows={6}
                  placeholder="Paste the complete job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </motion.div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-4 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuild}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-5 rounded-xl text-lg transition shadow-xl shadow-emerald-500/20"
              >
                🚀 Build My Perfect Resume
              </motion.button>
            </motion.div>

          ) : (
            <motion.div key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="max-w-5xl mx-auto px-4 py-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold">Your New Resume is Ready!</h1>
                    <span className="bg-emerald-500/20 text-emerald-400 text-sm px-3 py-1 rounded-full border border-emerald-500/30">✓ ATS Optimized</span>
                  </div>
                  <p className="text-gray-400">Review and edit below, then generate your final PDF</p>
                </div>
                <div className="flex gap-3">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setResult(null); setFile(null); setJobDescription(''); setIsFresher(false); setSchoolInfo({ school_name: '', board: '', year_of_passing: '', percentage: '' }) }}
                    className="bg-gray-900 border border-gray-700 text-gray-300 px-4 py-2.5 rounded-xl text-sm transition"
                  >
                    ← Start Over
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    disabled={generatingPdf}
                    className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
                  >
                    {generatingPdf ? '⏳ Generating...' : '⬇️ Download PDF'}
                  </motion.button>
                </div>
              </div>

              {/* Score Comparison */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <ScoreCard label="AI Analysis Score" original={result.score_comparison.original_score} improved={result.score_comparison.new_score} icon="🤖"/>
                <ScoreCard label="ATS Compatibility Score" original={result.score_comparison.original_ats} improved={result.score_comparison.new_ats} icon="🎯"/>
              </div>

              {/* Info banner */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <span className="text-blue-400 text-lg flex-shrink-0">ℹ️</span>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Edit any field below, fill in placeholders, toggle fresher if needed, and add your school details.
                  When ready, click <strong className="text-white">Download PDF</strong> — it will generate a fresh PDF with all your edits included.
                </p>
              </div>

              {JSON.stringify(result.built_resume).includes('[') && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <span className="text-amber-400 text-xl flex-shrink-0">⚠️</span>
                  <div>
                    <p className="text-amber-400 font-semibold text-sm">Fill in the highlighted placeholders</p>
                    <p className="text-gray-400 text-sm mt-1">Fields shown in amber need your real information before downloading.</p>
                  </div>
                </div>
              )}

              <ResumePreview
                data={result.built_resume}
                onEdit={setEditedResume}
                isFresher={isFresher}
                setIsFresher={setIsFresher}
                schoolInfo={schoolInfo}
                setSchoolInfo={setSchoolInfo}
              />

              <div className="mt-8 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  disabled={generatingPdf}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-bold py-4 rounded-xl text-lg transition shadow-lg shadow-emerald-500/20"
                >
                  {generatingPdf ? '⏳ Generating your PDF...' : '⬇️ Download My Final Resume as PDF'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/analyze')}
                  className="flex-1 bg-gray-900 border border-gray-700 text-gray-300 font-semibold py-4 rounded-xl transition"
                >
                  📊 Analyze This Resume
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}