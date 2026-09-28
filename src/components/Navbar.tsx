'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'

const NAV_LINKS = [
  { label: 'Home',         href: '#home',         id: 'home' },
  { label: 'Meet Ivan',    href: '#meet-ivan',    id: 'meet-ivan' },
  { label: 'Memories',     href: '#memories',     id: 'memories' },
  { label: 'Testimonials', href: '#testimonials', id: 'testimonials' },
  { label: 'Destinations', href: '#destinations', id: 'destinations' },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home')
  // true once the user has scrolled past the hero (100vh)
  const [pastHero, setPastHero] = useState(false)

  const linkRefs   = useRef<(HTMLAnchorElement | null)[]>([])
  const navListRef = useRef<HTMLUListElement>(null)
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 })

  const updatePill = useCallback((sectionId: string) => {
    const idx    = NAV_LINKS.findIndex((l) => l.id === sectionId)
    const linkEl = linkRefs.current[idx]
    const listEl = navListRef.current
    if (!linkEl || !listEl) return
    const listRect = listEl.getBoundingClientRect()
    const linkRect = linkEl.getBoundingClientRect()
    setPillStyle({ left: linkRect.left - listRect.left, width: linkRect.width, opacity: 1 })
  }, [])

  useEffect(() => {
    const onScroll = () => {
      // Show glassy bar only once we've scrolled past the hero section
      setPastHero(window.scrollY > window.innerHeight - 100)

      let current = 'home'
      for (const { id } of NAV_LINKS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) current = id
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { updatePill(activeSection) }, [activeSection, updatePill])

  useEffect(() => {
    const onResize = () => updatePill(activeSection)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeSection, updatePill])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 transition-all duration-400 ${
        pastHero
          ? 'pt-3 pb-3 bg-black/40 backdrop-blur-md shadow-sm border-b border-white/10'
          : 'pt-8 pb-4 bg-transparent backdrop-blur-none'
      }`}
    >
      {/* ── Logo ── */}
      <a href="#home" className="flex items-center shrink-0">
        <Image
          src="/logo.png"
          alt="Ivan Travels"
          width={200}
          height={70}
          priority
          className="h-14 w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
        />
      </a>

      {/* ── Nav links + sliding pill ── */}
      <ul ref={navListRef} className="hidden md:flex items-center gap-3 relative">
        {/* Single pill that slides between links */}
        <span
          aria-hidden
          className="absolute top-0 h-full rounded-full bg-white/15 backdrop-blur-sm border border-white/25 pointer-events-none"
          style={{
            left:       pillStyle.left,
            width:      pillStyle.width,
            opacity:    pillStyle.opacity,
            transition: 'left 300ms cubic-bezier(0.4,0,0.2,1), width 300ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease',
          }}
        />

        {NAV_LINKS.map(({ label, href, id }, i) => (
          <li key={id}>
            <a
              href={href}
              ref={(el) => { linkRefs.current[i] = el }}
              className={`relative block px-5 py-2 rounded-full text-base font-semibold tracking-wide transition-colors duration-200 select-none ${
                activeSection === id ? 'text-white' : 'text-white/85 hover:text-white'
              }`}
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
              onClick={() => setActiveSection(id)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* ── CTA button ── */}
      <a
        href="#plan"
        className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white transition-colors duration-200 shadow-md shadow-amber-500/30"
      >
        Plan Your Trip
      </a>

      {/* ── Mobile hamburger ── */}
      <button className="md:hidden text-white p-2" aria-label="Open menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </nav>
  )
}
