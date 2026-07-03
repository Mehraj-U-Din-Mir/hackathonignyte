'use client'
import Navbar       from '@/components/ui/Navbar'
import PremiumHero from '@/components/sections/PremiumHero'
import PremiumFeatures from '@/components/sections/PremiumFeatures'
import PremiumPrizes from '@/components/sections/PremiumPrizes'
import About        from '@/components/sections/About'
import Rules        from '@/components/sections/Rules'
import FoodSection  from '@/components/sections/FoodSection'
import Certificates from '@/components/sections/Certificates'
import Registration from '@/components/sections/Registration'
import Footer       from '@/components/ui/Footer'

export default function Home() {
  return (
    <main style={{ position: 'relative' }}>
      {/* Premium Background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(224, 136, 64, .025) 1px,transparent 1px),linear-gradient(90deg,rgba(224, 136, 64, .025) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      
      {/* Ambient orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position:'absolute', width:600, height:600, top:-150, left:-150, borderRadius:'50%', filter:'blur(120px)', background:'radial-gradient(circle,rgba(224, 136, 64, .1),transparent 70%)' }}/>
        <div style={{ position:'absolute', width:700, height:700, bottom:-200, right:-150, borderRadius:'50%', filter:'blur(120px)', background:'radial-gradient(circle,rgba(184, 69, 28, .08),transparent 70%)' }}/>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <PremiumHero />
        <PremiumFeatures />
        <PremiumPrizes />
        <About />
        <Rules />
        <FoodSection />
        <Certificates />
        <Registration />
        <Footer />
      </div>
    </main>
  )
}