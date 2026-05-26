import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

function AnimatedScore({ score }) {
  const [current, setCurrent] = useState(0)
  const circumference = 2 * Math.PI * 54
  const strokeDash = ((100 - current) / 100) * circumference
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'

  useEffect(() => {
    let start = 0
    const timer = setInterval(() => {
      start += 2
      if (start >= score) { setCurrent(score); clearInterval(timer) }
      else setCurrent(start)
    }, 20)
    return () => clearInterval(timer)
  }, [score])

  return (
    <svg width="160" height="160" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r="54" fill="none" stroke="#1f2937" strokeWidth="10"/>
      <circle cx="70" cy="70" r="54" fill="none" stroke={color} strokeWidth="10"
        strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDash}
        transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset 0.05s linear' }}/>
      <text x="70" y="63" textAnchor="middle" fill="white" fontSize="30" fontWeight="bold">{current}</text>
      <text x="70" y="83" textAnchor="middle" fill="#6b7280" fontSize="11">out of 100</text>
    </svg>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function Analyzer() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingText, setLoadingText] = useState('Reading your resume...')

  const loadingSteps = [
    'Reading your resume...',
    'Extracting key information...',
    'Running AI analysis...',
    'Calculating ATS score...',
    'Generating suggestions...',
    'Almost done...'
  ]

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (files) => setFile(files[0])
  })

  const handleAnalyze = async () => {
    if (!file) return setError('Please upload a PDF resume first.')
    setError('')
    setLoading(true)
    let step = 0
    const interval = setInterval(() => {
      step = (step + 1) % loadingSteps.length
      setLoadingText(loadingSteps[step])
    }, 1800)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('job_description', jobDescription)
    try {
      const res = await axios.post('http://127.0.0.1:8000/resume/analyze', formData)
      setResult(res.data)
    } catch {
      setError('Something went wrong. Make sure the backend is running.')
    }
    clearInterval(interval)
    setLoading(false)
  }

  const score = result?.ai_analysis?.overall_score ?? 0
  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'
  const scoreLabelColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'

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
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-emerald-500/30">AI</div>
            <span className="font-semibold">ResumeAI</span>
          </div>
          <span className="text-gray-500 text-sm">AI Resume Analyzer</span>
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
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
              </div>
              <div className="text-center">
                <motion.p key={loadingText}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-400 font-medium text-lg"
                >{loadingText}</motion.p>
                <p className="text-gray-600 text-sm mt-2">This usually takes 5-10 seconds</p>
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-4 py-12"
            >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h1 className="text-4xl font-bold mb-2">Analyze Your Resume</h1>
                <p className="text-gray-400 mb-10">Upload your PDF and get instant AI-powered feedback in seconds.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 mb-6
                  ${isDragActive ? 'border-emerald-500 bg-emerald-500/10 scale-[1.02]' : 'border-gray-700 bg-gray-900/50 hover:border-emerald-500/50 hover:bg-gray-900'}`}
              >
                <input {...getInputProps()} />
                <motion.div animate={isDragActive ? { scale: 1.2 } : { scale: 1 }} className="text-5xl mb-4">
                  {file ? '✅' : '📄'}
                </motion.div>
                {file ? (
                  <>
                    <p className="text-emerald-400 font-semibold text-lg">{file.name}</p>
                    <p className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB • Click to change</p>
                  </>
                ) : (
                  <>
                    <p className="text-white font-semibold text-lg mb-1">
                      {isDragActive ? 'Drop it here!' : 'Drag & drop your resume here'}
                    </p>
                    <p className="text-gray-500 text-sm">or click to browse • PDF files only • Max 10MB</p>
                  </>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6"
              >
                <label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  <span>Job Description</span>
                  <span className="text-gray-600 font-normal">(optional — for match score)</span>
                </label>
                <textarea
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none transition mt-2"
                  rows={4}
                  placeholder="Paste the job description here to get a compatibility match score and find missing keywords..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </motion.div>

              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6 text-sm flex gap-2"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-5 rounded-xl text-lg transition-all duration-200 shadow-xl shadow-emerald-500/20"
              >
                🚀 Analyze My Resume
              </motion.button>
            </motion.div>

          ) : (
            <motion.div key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="max-w-5xl mx-auto px-4 py-10"
            >
              {/* Header */}
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="flex items-center justify-between mb-8"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold">Analysis Complete</h1>
                    <span className="bg-emerald-500/20 text-emerald-400 text-sm px-3 py-1 rounded-full border border-emerald-500/30">✓ Done</span>
                  </div>
                  <p className="text-gray-400">Here's your AI-powered resume report</p>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setResult(null); setFile(null) }}
                  className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 px-5 py-2.5 rounded-xl text-sm transition"
                >
                  ← Analyze Another
                </motion.button>
              </motion.div>

              {/* Score + Sections */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center"
                  style={{ boxShadow: `0 0 40px rgba(16,185,129,0.05)` }}
                >
                  <p className="text-gray-400 text-sm mb-4 uppercase tracking-wider">Overall AI Score</p>
                  <AnimatedScore score={score} />
                  <p className={`text-lg font-bold mt-3 ${scoreLabelColor}`}>{scoreLabel}</p>
                </motion.div>

                <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6"
                >
                  <h2 className="font-semibold text-white mb-5 uppercase tracking-wider text-sm text-gray-400">Section Breakdown</h2>
                  {Object.entries(result.ai_analysis.section_scores).map(([key, value], i) => (
                    <div key={key} className="mb-4">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-300 capitalize">{key.replace('_', ' ')}</span>
                        <span className="text-white font-semibold">{value}</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <motion.div className="h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                          style={{ backgroundColor: value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444' }}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
                  className="bg-gray-900/50 border border-emerald-500/20 rounded-2xl p-6"
                >
                  <h2 className="font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs">✓</span>
                    Strengths
                  </h2>
                  <ul className="space-y-3">
                    {result.ai_analysis.strengths.map((s, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="text-gray-300 text-sm flex gap-2 items-start"
                      >
                        <span className="text-emerald-500 mt-0.5 flex-shrink-0">▸</span>{s}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
                  className="bg-gray-900/50 border border-amber-500/20 rounded-2xl p-6"
                >
                  <h2 className="font-semibold text-amber-400 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-xs">!</span>
                    Improvements
                  </h2>
                  <ul className="space-y-3">
                    {result.ai_analysis.improvements.map((s, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="text-gray-300 text-sm flex gap-2 items-start"
                      >
                        <span className="text-amber-500 mt-0.5 flex-shrink-0">▸</span>{s}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Missing Keywords */}
              <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6"
              >
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🔑</span> Missing Keywords
                  <span className="text-gray-500 text-sm font-normal">— Add these to improve your ATS score</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.ai_analysis.missing_keywords.map((kw, i) => (
                    <motion.span key={i}
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-sm"
                    >
                      {kw}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Rewritten Summary */}
              <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6"
              >
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span>✍️</span> AI Rewritten Summary
                </h2>
                <div className="border-l-2 border-emerald-500 pl-4 py-1">
                  <p className="text-gray-300 text-sm leading-relaxed italic">
                    "{result.ai_analysis.rewritten_summary}"
                  </p>
                </div>
              </motion.div>

              {/* ATS Tips */}
              <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6"
              >
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🎯</span> ATS Optimization Tips
                </h2>
                <div className="space-y-3">
                  {result.ai_analysis.ats_tips.map((tip, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.15 }}
                      className="flex gap-3 text-sm text-gray-300 bg-gray-800/50 rounded-xl p-3"
                    >
                      <span className="bg-emerald-500/20 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      {tip}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Bottom Actions */}
              <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible"
                className="flex gap-4"
              >
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setResult(null); setFile(null) }}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition shadow-lg shadow-emerald-500/20"
                >
                  🚀 Analyze Another Resume
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/')}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 font-semibold py-4 rounded-xl transition"
                >
                  ← Back to Home
                </motion.button>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}