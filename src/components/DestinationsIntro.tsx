'use client'

import { useEffect, useRef, useState } from 'react'

export default function DestinationsIntro() {
  const ref = useRef<HTMLElement>(null)
  const [settled, setSettled] = useState(false)

  // One-shot IntersectionObserver: once the panel is sufficiently in view, lock the
  // heading lines into their final positions and never move them again.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSettled(true)
          observer.disconnect() // fire only once
        }
      },
      { threshold: 0.45 } // trigger when ~half the panel is visible
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="bg-white w-full flex items-center justify-center overflow-hidden"
      style={{ minHeight: '38vh', padding: '6rem 2rem' }}
    >
      <div className="max-w-4xl w-full text-center">

        {/* ── Heading ── */}
        <div className="overflow-hidden mb-2" style={{ clipPath: 'none' }}>
          {/* "Explore More." slides DOWN from above */}
          <h2
            className="font-bold leading-tight tracking-tight text-zinc-900 transition-all"
            style={{
              fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              transform: settled ? 'translateY(0)' : 'translateY(-28px)',
              opacity: settled ? 1 : 0,
              transitionDuration: '900ms',
              transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            Explore More.
          </h2>
        </div>

        <div className="overflow-hidden mb-10">
          {/* "Experience Sri Lanka." slides UP from below */}
          <h2
            className="font-bold leading-tight tracking-tight transition-all"
            style={{
              fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: '#f59e0b', // amber-400 — matches stat numbers & hero accent
              transform: settled ? 'translateY(0)' : 'translateY(28px)',
              opacity: settled ? 1 : 0,
              transitionDuration: '900ms',
              transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '60ms',
            }}
          >
            Experience Sri Lanka.
          </h2>
        </div>

        {/* ── Description ── */}
        <p
          className="text-zinc-500 font-sans leading-relaxed mx-auto transition-all"
          style={{
            maxWidth: '580px',
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            opacity: settled ? 1 : 0,
            transform: settled ? 'translateY(0)' : 'translateY(10px)',
            transitionDuration: '700ms',
            transitionTimingFunction: 'ease-out',
            transitionDelay: '250ms',
          }}
        >
          Discover the diverse landscapes and unforgettable destinations scattered across the island.
          From iconic landmarks to peaceful escapes, find a place that makes you want to pack your bags and go.
        </p>

      </div>
    </section>
  )
}
