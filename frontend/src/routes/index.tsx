import { Navbar } from '#/components/common/NavBar'
import { Features } from '#/components/page/feature'
import { Footer } from '#/components/page/footer'
import { Hero } from '#/components/page/hero'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Navbar />
      <main className='flex-1'>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
