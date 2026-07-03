'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EVENT_DATE = new Date('2026-08-22T09:00:00')

function pad(n: number) { return String(n).padStart(2, '0') }

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

export default function PremiumHero() {
  const [cd, setCd] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const tick = () => {
      const diff = EVENT_DATE.getTime() - Date.now()
      if (diff <= 0) return
      setCd({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    setMousePosition({ x: clientX, y: clientY })
  }

  return (
    <section 
      className="relative w-full min-h-screen overflow-hidden pt-32 pb-20 px-4 md:px-8"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Mars Background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#251c12] via-[#2a2018] to-[#241a10]" />
        
        {/* Mars Dust Particles */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 100 + 10 + 'px',
                height: Math.random() * 100 + 10 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                background: `radial-gradient(circle, rgba(${255 - i * 2}, ${100 + i}, ${50 + i}, 0.3), transparent)`,
                filter: 'blur(40px)',
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Glowing orbs */}
        <motion.div 
          className="absolute w-96 h-96 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-3xl"
          style={{ top: '-10%', left: '-5%' }}
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="absolute w-80 h-80 bg-gradient-radial from-purple-500/15 to-transparent rounded-full blur-3xl"
          style={{ bottom: '-5%', right: '-10%' }}
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 -z-10 opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(224, 136, 64, .1) 1px,transparent 1px),linear-gradient(90deg,rgba(224, 136, 64, .1) 1px,transparent 1px)',
        backgroundSize: '100px 100px',
      }} />

      {/* Main Content */}
      <motion.div 
        className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Content */}
        <motion.div variants={itemVariants} className="space-y-8">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/40 rounded-full px-4 py-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span 
              className="text-sm font-bold tracking-widest"
              style={{ fontFamily: 'Consolas, monospace', color: '#f5c451' }}
            >
              AUGUST 2026 • KASHMIR EDITION
            </span>
          </motion.div>

          {/* Main Title with staggered animation */}
          <div className="space-y-3">
            <motion.h1 
              className="text-6xl md:text-7xl font-black leading-tight tracking-tighter"
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
              variants={itemVariants}
            >
              <motion.span 
                className="block"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  background: 'linear-gradient(90deg, #f5c451, #e08840, #b8451c, #f5c451)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Ignyte
              </motion.span>
              <motion.span 
                className="block"
                style={{ fontFamily: 'Consolas, monospace' }}
                animate={{ textShadow: ['0 0 10px rgba(224, 136, 64, 0.3)', '0 0 20px rgba(224, 136, 64, 0.6)', '0 0 10px rgba(224, 136, 64, 0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Hackathon 2026
              </motion.span>
            </motion.h1>
            <motion.div 
              className="text-2xl md:text-3xl font-bold"
              style={{ 
                fontFamily: 'Consolas, monospace',
                background: 'linear-gradient(90deg, #b8451c, #f5c451)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              INNOVATION FROM MARS
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p 
            className="text-lg text-gray-300 leading-relaxed max-w-xl"
            variants={itemVariants}
            style={{ fontFamily: 'Consolas, monospace' }}
          >
            Build extraordinary solutions. Compete against the best. Win amazing prizes. 
            <span className="block text-cyan-400 font-bold mt-2">No coding experience required.</span>
          </motion.p>

          {/* Animated Countdown */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-2xl p-8 backdrop-blur">
            <p className="text-sm font-bold tracking-widest mb-6" style={{ fontFamily: 'Consolas, monospace', color: '#f5c451' }}>LAUNCH IN</p>
            <div className="flex gap-4 flex-wrap">
              {[
                { value: cd.days, label: 'Days' },
                { value: cd.hours, label: 'Hours' },
                { value: cd.minutes, label: 'Minutes' },
                { value: cd.seconds, label: 'Seconds' },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="flex-1 min-w-[100px] text-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-400/30 rounded-xl p-4 backdrop-blur">
                    <motion.div 
                      className="text-3xl md:text-4xl font-black"
                      style={{ color: '#f5c451', fontFamily: 'Consolas, monospace' }}
                      key={item.value}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      {pad(item.value)}
                    </motion.div>
                    <div className="text-xs font-bold tracking-widest mt-2 text-gray-400" style={{ fontFamily: 'Consolas, monospace' }}>
                      {item.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
            <motion.a 
              href="#register"
              className="px-8 py-4 rounded-xl font-bold text-lg tracking-wider cursor-pointer relative overflow-hidden group"
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Register Now <span className="animate-bounce">→</span>
              </span>
            </motion.a>

            <motion.a 
              href="#prizes"
              className="px-8 py-4 rounded-xl font-bold text-lg tracking-wider border-2 border-purple-500/50 hover:border-purple-500 text-purple-400 transition-all"
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(168, 85, 247, 0.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              View Prizes 🏆
            </motion.a>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-8">
            {[
              { value: '200+', label: 'Participants' },
              { value: '₹25K', label: 'Prize Pool' },
              { value: '2 Days', label: 'Hackathon' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-xl p-4 text-center backdrop-blur hover:border-blue-400/50 transition-all"
                whileHover={{ y: -5 }}
              >
                <div 
                  className="text-2xl md:text-3xl font-black"
                  style={{ 
                    background: 'linear-gradient(90deg, #f5c451, #e08840)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: 'Consolas, monospace'
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs font-bold tracking-widest mt-2 text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Visual - 3D Mars Orb */}
        <motion.div 
          variants={itemVariants}
          className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center"
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0 bg-gradient-conic from-cyan-500/30 via-purple-500/20 to-cyan-500/30 rounded-full blur-3xl opacity-50" />
          </motion.div>

          {/* Main Orbital Sphere */}
          <motion.div
            className="relative w-64 h-64 md:w-80 md:h-80"
            animate={{ 
              rotateX: [0, 360],
              rotateY: [0, 360],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: 'linear',
            }}
            style={{
              perspective: '1000px',
            }}
          >
            {/* Glowing Mars sphere */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-600 via-orange-600 to-amber-700 shadow-2xl" 
              style={{
                boxShadow: '0 0 60px rgba(255, 87, 34, 0.4), 0 0 100px rgba(255, 87, 34, 0.2), inset -20px -20px 40px rgba(0,0,0,0.5)',
              }}
            />
            
            {/* Texture overlay */}
            <div className="absolute inset-0 rounded-full opacity-40" 
              style={{
                backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), transparent 50%)',
              }}
            />

            {/* Rotating rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-cyan-400/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-purple-500/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              style={{ transform: 'rotateX(65deg)' }}
            />
          </motion.div>

          {/* Floating cards around the sphere */}
          {[
            { icon: '🚀', label: 'INNOVATION', delay: 0, angle: 0 },
            { icon: '🤖', label: 'AI TECH', delay: 0.2, angle: 90 },
            { icon: '🏆', label: 'AWARDS', delay: 0.4, angle: 180 },
            { icon: '💡', label: 'IDEAS', delay: 0.6, angle: 270 },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-24 flex items-center justify-center"
              animate={{
                x: Math.cos((item.angle * Math.PI) / 180) * 150,
                y: Math.sin((item.angle * Math.PI) / 180) * 150,
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear',
                delay: item.delay,
              }}
            >
              <motion.div
                className="bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-cyan-400/50 rounded-2xl p-4 backdrop-blur-md text-center hover:border-cyan-400/80 transition-all"
                whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(224, 136, 64, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div 
                  className="text-xs font-bold"
                  style={{ fontFamily: 'Consolas, monospace', color: '#f5c451' }}
                >
                  {item.label}
                </div>
              </motion.div>
            </motion.div>
          ))}

          {/* Animated glow pulse */}
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-500/20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-sm font-bold tracking-widest text-gray-400" style={{ fontFamily: 'Consolas, monospace' }}>SCROLL</span>
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>

      {/* CSS for additional effects */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 10px rgba(245, 196, 81, 0.3), 0 0 20px rgba(224, 136, 64, 0.2); }
          50% { text-shadow: 0 0 20px rgba(245, 196, 81, 0.6), 0 0 40px rgba(224, 136, 64, 0.4); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        /* Gradient conic */
        .bg-gradient-conic {
          background: conic-gradient(from 0deg at 50% 50%, #e08840, #b8451c, #f5c451, #e08840);
        }

        /* Gradient radial */
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        @media (max-width: 768px) {
          h1 { font-size: 2.5rem !important; }
        }
      `}</style>
    </section>
  )
}