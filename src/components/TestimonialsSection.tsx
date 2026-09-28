'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const QUOTES = [
  {
    text: "Travelling across Sri Lanka with Ivan was an amazing experience. Everything was well planned, and our guide was friendly, knowledgeable, and always happy to help. He showed us some incredible places beyond the usual tourist spots and made the whole trip feel effortless. Truly an unforgettable experience!",
    author: "Daniel Morgan, United Kingdom",
  },
  {
    text: "An absolute dream come true. We saw parts of the island we never would have discovered on our own. Every stop felt curated just for us, and the drives between cities were filled with great stories and breathtaking views.",
    author: "Sarah & Tom, Australia",
  },
  {
    text: "The perfect mix of adventure and relaxation. Ivan's local knowledge is unmatched. He knew exactly where to go for the best local food and timed our visits to avoid the heavy crowds. We felt safe and cared for every step of the way.",
    author: "Elena Rossi, Italy",
  }
]

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  
  // Parallax offsets
  const [headingY, setHeadingY] = useState(0)
  
  // Carousel state
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      
      const newHeadingY = Math.min(0, -rect.top * 0.25)
      setHeadingY(newHeadingY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Init
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const nextQuote = () => setActiveIndex((i) => (i + 1) % QUOTES.length)
  const prevQuote = () => setActiveIndex((i) => (i - 1 + QUOTES.length) % QUOTES.length)

  return (
    <section ref={sectionRef} id="testimonials" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      
      {/* 1. Background layer: Sky & Distant Mountains */}
      <Image 
        src="/testimonials/sky-background.png" 
        alt="Sri Lanka Sky Background" 
        fill 
        className="object-cover z-0 pointer-events-none" 
      />

      {/* Soft dark gradient to ensure white text is always readable over bright sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 z-10 pointer-events-none" />

      {/* 2. Content layer (Z-index 20) */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-8 flex flex-col items-center pb-20">
        
        {/* Parallax Heading */}
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-20 tracking-tight text-center drop-shadow-lg"
          style={{
            fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
            transform: `translateY(${headingY}px)`,
            willChange: 'transform'
          }}
        >
          Stories From the Road
        </h2>

        {/* Testimonial Carousel */}
        <div className="flex items-center w-full justify-between gap-4 md:gap-12">
          
          {/* Prev Arrow */}
          <button 
            onClick={prevQuote} 
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/30 flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white transition-all shrink-0 backdrop-blur-sm"
            aria-label="Previous testimonial"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Quote Content */}
          <div className="flex-1 text-center relative h-[250px] md:h-[200px] flex flex-col items-center justify-center">
            {QUOTES.map((quote, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
                  idx === activeIndex ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 z-0 pointer-events-none'
                }`}
              >
                <p className="text-lg md:text-xl lg:text-2xl font-normal text-white/90 leading-relaxed max-w-4xl mx-auto drop-shadow-md font-sans">
                  "{quote.text}"
                </p>
                <p className="mt-8 md:mt-10 text-white/70 font-semibold tracking-wide text-sm uppercase font-sans">
                  — {quote.author}
                </p>
              </div>
            ))}
          </div>

          {/* Next Arrow */}
          <button 
            onClick={nextQuote} 
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/30 flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white transition-all shrink-0 backdrop-blur-sm"
            aria-label="Next testimonial"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

        </div>
      </div>

    </section>
  )
}
