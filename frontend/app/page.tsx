'use client'

import AnimatedBackground from '@/components/AnimatedBackground'
import Navbar from '@/components/ui/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Rules from '@/components/sections/Rules'
import Benefits from '@/components/sections/Benefits'
import Prizes from '@/components/sections/Prizes'
import FoodSection from '@/components/sections/FoodSection'
import Certificates from '@/components/sections/Certificates'
import Registration from '@/components/sections/Registration'
import Footer from '@/components/ui/Footer'

// ─── New ignyte-preview sections ───────────────────────────────────────────
// Brought in from frontend/public/ignyte-preview.html — themes (ember / loch /
// gold) and additional information (Mission, 9 Roles + Quiz, 2-day Jam,
// Tools, Architect seat, Awards, Outcomes, For Parents, FAQ, Pyreloch Lab).
import IgnytePreview from '@/components/IgnytePreview'
import LucideIcons from '@/components/LucideIcons'
import Mission from '@/components/sections/Mission'
import Roles from '@/components/sections/Roles'
import TheJam from '@/components/sections/TheJam'
import ToolsSection from '@/components/sections/ToolsSection'
import ArchitectSeat from '@/components/sections/ArchitectSeat'
import Awards from '@/components/sections/Awards'
import Outcomes from '@/components/sections/Outcomes'
import ForParents from '@/components/sections/ForParents'
import FAQ from '@/components/sections/FAQ'
import PyrelochLab from '@/components/sections/PyrelochLab'

export default function Home() {
  return (
    <main style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Ambient ignyte-preview layer: scroll progress, cursor glow,
          back-to-top, embers, + reveal-on-scroll / spotlight / magnetic
          wiring. Renders only fixed overlays, no layout. */}
      <IgnytePreview />
      <LucideIcons />

      {/* Original animated background (cyan / purple / mint mesh) */}
      <AnimatedBackground />

      {/* Content layer */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        {/* Original ByteFest hero + informational sections */}
        <Hero />
        <About />
        <Rules />
        <Benefits />
        <Prizes />
        <FoodSection />
        <Certificates />

        {/* ─── Ignyte game-jam preview sections ────────────────────────────
            These bring in the additional information from the ignyte preview:
            the Pyreloch mission, the 9 roles + quiz, the two-day jam
            schedule, the studio tools, the Architect seat, the 6 awards,
            what you walk away with, a parents' pitch, the FAQ, and the
            Pyreloch Lab CTA. Visual language is the ember / loch / gold
            palette defined in styles/globals.css. */}
        <Mission />
        <Roles />
        <TheJam />
        <ToolsSection />
        <ArchitectSeat />
        <Awards />
        <Outcomes />
        <ForParents />
        <FAQ />
        <PyrelochLab />

        {/* Registration + Footer (original) */}
        <Registration />
        <Footer />
      </div>
    </main>
  )
}
