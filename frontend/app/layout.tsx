import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'ignyte 2026 — Future Innovators Hackathon',
  description:
    'The premier school hackathon for Classes 8–12. Build. Learn. Innovate. Compete. Join 200+ students in Kashmir this August.',
  keywords: ['hackathon', 'school', 'AI', 'coding', 'Kashmir', 'students', 'technology', 'innovation'],
  openGraph: {
    title: 'ignyte 2026 — Future Innovators Hackathon',
    description: 'The premier school hackathon for Classes 8–12. Build. Learn. Innovate. Compete.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  )
}
