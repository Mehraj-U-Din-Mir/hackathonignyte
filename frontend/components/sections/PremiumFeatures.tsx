'use client'
import { motion } from 'framer-motion'

const features = [
  {
    icon: '🚀',
    title: 'Launch Your Ideas',
    description: 'Turn your wildest ideas into reality with cutting-edge technology and resources.',
    color: 'from-cyan-500 to-blue-500',
    delay: 0,
  },
  {
    icon: '🤖',
    title: 'AI & Machine Learning',
    description: 'Learn AI, ML, and data science from industry experts. No prerequisites needed.',
    color: 'from-purple-500 to-pink-500',
    delay: 0.1,
  },
  {
    icon: '👥',
    title: 'Network & Collaborate',
    description: 'Meet 200+ brilliant students and build connections that last a lifetime.',
    color: 'from-orange-500 to-red-500',
    delay: 0.2,
  },
  {
    icon: '🏆',
    title: 'Win Big Prizes',
    description: '₹50K prize pool + 4-month AI course + internship opportunities.',
    color: 'from-green-500 to-emerald-500',
    delay: 0.3,
  },
  {
    icon: '🎓',
    title: 'Earn Certificates',
    description: 'QR-verified certificates recognized by top institutions and companies.',
    color: 'from-indigo-500 to-purple-500',
    delay: 0.4,
  },
  {
    icon: '🌍',
    title: 'Global Recognition',
    description: 'Get featured on national platforms and build your portfolio for future.',
    color: 'from-pink-500 to-rose-500',
    delay: 0.5,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export default function PremiumFeatures() {
  return (
    <section className="relative w-full py-24 px-4 md:px-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-radial from-purple-500/10 to-transparent blur-3xl"
          style={{ top: '20%', left: '-5%' }}
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gradient-radial from-cyan-500/10 to-transparent blur-3xl"
          style={{ bottom: '10%', right: '-10%' }}
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.p
            variants={itemVariants}
            className="text-sm font-bold tracking-widest mb-4"
            style={{ fontFamily: 'Consolas, monospace', color: '#f5c451' }}
          >
            WHY JOIN ignyte?
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-6xl font-black mb-6 leading-tight"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Experience the Future
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            style={{ fontFamily: 'Consolas, monospace' }}
          >
            ignyte isn't just a hackathon. It's your launchpad to innovation, learning, and endless possibilities.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-2xl p-[1px] transition-opacity duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${feature.color === 'from-cyan-500 to-blue-500' ? '#f5c451, #e08840' : feature.color === 'from-purple-500 to-pink-500' ? '#b8451c, #f5a623' : feature.color === 'from-orange-500 to-red-500' ? '#f97316, #ef4444' : feature.color === 'from-green-500 to-emerald-500' ? '#4a9b8e, #4a9b8e' : feature.color === 'from-indigo-500 to-purple-500' ? '#b8451c, #b8451c' : '#f5a623, #b8451c'})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl" />
              </div>

              {/* Card content */}
              <div className="relative bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-xl h-full">
                {/* Gradient accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-bl-3xl blur-2xl`} />

                {/* Icon */}
                <motion.div
                  className="text-5xl mb-4 w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${feature.color === 'from-cyan-500 to-blue-500' ? '#f5c451, #e08840' : feature.color === 'from-purple-500 to-pink-500' ? '#b8451c, #f5a623' : feature.color === 'from-orange-500 to-red-500' ? '#f97316, #ef4444' : feature.color === 'from-green-500 to-emerald-500' ? '#4a9b8e, #4a9b8e' : feature.color === 'from-indigo-500 to-purple-500' ? '#b8451c, #b8451c' : '#f5a623, #b8451c'})`,
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed mb-4" style={{ fontFamily: 'Consolas, monospace' }}>
                  {feature.description}
                </p>

                {/* Learn more link */}
                <motion.div
                  className="flex items-center gap-2 text-cyan-400 font-bold text-sm group-hover:gap-3 transition-all"
                  style={{ fontFamily: 'Consolas, monospace' }}
                >
                  <span>Discover more</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-6" style={{ fontFamily: 'Consolas, monospace' }}>
            Ready to join the innovation revolution?
          </p>
          <motion.a
            href="#register"
            className="inline-block px-10 py-4 rounded-xl font-bold text-lg tracking-wider bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register Now 🚀
          </motion.a>
        </motion.div>
      </div>

      <style>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  )
}