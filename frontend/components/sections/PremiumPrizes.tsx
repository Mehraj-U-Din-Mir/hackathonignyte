'use client'
import { motion } from 'framer-motion'

const prizes = [
  {
    rank: 1,
    title: '1st Prize',
    amount: '₹20,000',
    badge: '🥇',
    items: [
      '4-Month AI Course',
      'Internship Opportunity',
      'Amazon Vouchers (₹10K)',
      'Premium Certificate',
    ],
    color: 'from-yellow-400 to-amber-400',
    scale: 1.15,
    delay: 0.2,
  },
  {
    rank: 2,
    title: '2nd Prize',
    amount: '₹12,000',
    badge: '🥈',
    items: [
      '3-Month Coding Course',
      'Portfolio Review',
      'Amazon Vouchers (₹6K)',
      'Premium Certificate',
    ],
    color: 'from-gray-400 to-slate-400',
    scale: 1.05,
    delay: 0.4,
  },
  {
    rank: 3,
    title: '3rd Prize',
    amount: '₹8,000',
    badge: '🥉',
    items: [
      '2-Month Web Dev Course',
      'Mentorship Session',
      'Amazon Vouchers (₹4K)',
      'Premium Certificate',
    ],
    color: 'from-orange-400 to-red-400',
    scale: 0.95,
    delay: 0.6,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export default function PremiumPrizes() {
  return (
    <section id="prizes" className="relative w-full py-24 px-4 md:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5" />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-radial from-yellow-500/15 to-transparent blur-3xl"
          style={{ top: '50%', left: '-10%', transform: 'translateY(-50%)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gradient-radial from-purple-500/15 to-transparent blur-3xl"
          style={{ top: '50%', right: '-5%', transform: 'translateY(-50%)' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
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
            PRIZE POOL
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-6xl font-black mb-4 leading-tight"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              ₹50,000+
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-300"
            style={{ fontFamily: 'Consolas, monospace' }}
          >
            Plus exclusive courses, internships, and global recognition
          </motion.p>
        </motion.div>

        {/* Prizes Display */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {prizes.map((prize, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
              style={{ scale: prize.scale }}
            >
              {/* Trophy animation container */}
              <motion.div
                className="relative"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: prize.delay,
                }}
              >
                {/* Glow effect */}
                <div className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${prize.rank === 1 ? '#fbbf24, #f59e0b' : prize.rank === 2 ? '#d4c4a8, #9a8a78' : '#fb923c, #f97316'})`,
                  }}
                />

                {/* Prize Card */}
                <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-gray-700/50 rounded-3xl p-8 backdrop-blur-xl overflow-hidden">
                  {/* Gradient accent */}
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${prize.color} opacity-20 rounded-bl-3xl blur-3xl`} />

                  {/* Rank badge */}
                  <motion.div
                    className="text-7xl mb-6 w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${prize.rank === 1 ? '#fbbf24, #f59e0b' : prize.rank === 2 ? '#d4c4a8, #9a8a78' : '#fb923c, #f97316'})`,
                    }}
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: prize.delay * 0.5,
                    }}
                  >
                    {prize.badge}
                  </motion.div>

                  {/* Prize title */}
                  <h3 className="text-2xl md:text-3xl font-black mb-2 text-white"
                    style={{ fontFamily: 'Comic Sans MS, cursive' }}
                  >
                    {prize.title}
                  </h3>

                  {/* Prize amount */}
                  <motion.div
                    className="text-4xl font-black mb-6 bg-gradient-to-r opacity-90"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${prize.rank === 1 ? '#fbbf24, #f59e0b' : prize.rank === 2 ? '#d4c4a8, #9a8a78' : '#fb923c, #f97316'})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontFamily: 'Consolas, monospace',
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: prize.delay,
                    }}
                  >
                    {prize.amount}
                  </motion.div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6" />

                  {/* Prize items */}
                  <div className="space-y-3 mb-6">
                    {prize.items.map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-gradient-to-r ${prize.color}`} />
                        <span className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: 'Consolas, monospace' }}>
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-white/0 to-transparent opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-300"
                    whileHover={{ opacity: 0.2 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional prizes info */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-2xl p-8 backdrop-blur-xl"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              Special Awards
            </h3>
            <ul className="space-y-2">
              {[
                'Best Innovation Award',
                'Best Design Award',
                'Best Teamwork Award',
                'People\'s Choice Award',
              ].map((award, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-3 text-gray-300"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-cyan-400">✦</span>
                  <span style={{ fontFamily: 'Consolas, monospace' }}>{award}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-8 backdrop-blur-xl"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              Career Opportunities
            </h3>
            <ul className="space-y-2">
              {[
                '4-Month Premium Courses',
                'Internship Placements',
                'Mentorship from Experts',
                'Portfolio Boost',
              ].map((opp, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-3 text-gray-300"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-purple-400">✦</span>
                  <span style={{ fontFamily: 'Consolas, monospace' }}>{opp}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
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