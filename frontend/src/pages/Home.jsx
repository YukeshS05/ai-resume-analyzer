import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  const navigate = useNavigate()

  const features = [
    { icon: '📊', title: 'ATS Score', desc: 'Instant compatibility score with any ATS system' },
    { icon: '🤖', title: 'AI Feedback', desc: 'Smart suggestions powered by LLaMA 3.3 70B' },
    { icon: '🎯', title: 'JD Matching', desc: 'Match your resume against any job description' },
    { icon: '✍️', title: 'AI Rewrite', desc: 'Get an AI-rewritten professional summary' },
    { icon: '🔑', title: 'Keywords', desc: 'Discover missing keywords recruiters look for' },
    { icon: '💡', title: 'ATS Tips', desc: 'Actionable tips to beat applicant tracking systems' },
  ]

  const stats = [
    { value: '10K+', label: 'Resumes Analyzed' },
    { value: '95%', label: 'User Satisfaction' },
    { value: '3s', label: 'Analysis Time' },
    { value: '100%', label: 'Free to Use' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">

      <div className="fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full z-0"
        style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative z-10">

        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="border-b border-gray-800/50 px-8 py-4 flex justify-between items-center backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-emerald-500/30">AI</div>
            <span className="font-semibold text-white">ResumeAI</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-gray-400 text-sm hidden md:block">Features</span>
            <span className="text-gray-400 text-sm hidden md:block">How it works</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/analyze')}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 py-2 rounded-lg text-sm transition shadow-lg shadow-emerald-500/20"
            >
              Get Started Free
            </motion.button>
          </div>
        </motion.nav>

        <div className="flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gray-900/80 border border-gray-700/50 rounded-full px-4 py-2 text-sm text-gray-400 mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Powered by Groq AI + LLaMA 3.3 70B
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">Free</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-6xl md:text-7xl font-bold mb-6 leading-tight tracking-tight"
          >
            Analyze Your Resume
            <span className="block mt-2"
              style={{ background: 'linear-gradient(135deg, #10b981, #34d399, #6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              With AI Precision
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed"
          >
            Get instant ATS scores, AI-powered improvement suggestions, and job description
            matching in seconds. Land more interviews with a resume that stands out.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/analyze')}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-14 py-5 rounded-xl text-lg transition-all duration-200 shadow-2xl shadow-emerald-500/30 mb-4"
          >
            🚀 Analyze My Resume — It's Free
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600 text-sm"
          >
            No sign up • No credit card • Instant results
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-4 gap-px bg-gray-800/50 border-y border-gray-800/50 mb-20"
        >
          {stats.map((s, i) => (
            <div key={i} className="bg-[#0a0a0a] py-6 text-center">
              <div className="text-2xl font-bold text-emerald-400">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="max-w-5xl mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-3">Everything you need to land the job</h2>
            <p className="text-gray-400">Comprehensive AI analysis in one click</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, boxShadow: '0 0 30px rgba(16,185,129,0.1)' }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 cursor-default transition-all duration-300 hover:border-emerald-500/30"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="font-semibold text-white mb-2">{f.title}</div>
                <div className="text-gray-500 text-sm leading-relaxed">{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-24 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-3xl font-bold mb-16"
          >
            How it works
          </motion.h2>
          <div className="grid grid-cols-3 gap-8 relative">
            <div className="absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 hidden md:block" />
            {[
              { step: '01', title: 'Upload PDF', desc: 'Drag and drop your resume PDF into the analyzer' },
              { step: '02', title: 'AI Analyzes', desc: 'LLaMA 3.3 70B reads and evaluates every section' },
              { step: '03', title: 'Get Results', desc: 'Receive your score, feedback and improvements instantly' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg mb-4">
                  {s.step}
                </div>
                <div className="font-semibold text-white mb-2">{s.title}</div>
                <div className="text-gray-500 text-sm">{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mx-4 mb-12 rounded-2xl border border-emerald-500/20 p-12 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(16,185,129,0.02))' }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to land more interviews?</h2>
          <p className="text-gray-400 mb-8">Join thousands of job seekers who improved their resume with ResumeAI</p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/analyze')}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10 py-5 rounded-xl text-lg transition-all duration-200 shadow-2xl shadow-emerald-500/30"
          >
            🚀 Analyze My Resume Now →
          </motion.button>
        </motion.div>

        <div className="border-t border-gray-800/50 px-8 py-6 flex justify-between items-center text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center text-black font-bold text-xs">AI</div>
            <span>ResumeAI</span>
          </div>
          <span>Built with Groq AI + LLaMA 3.3 · FastAPI · React</span>
        </div>

      </div>
    </div>
  )
}