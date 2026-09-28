'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useMemo } from 'react'

export default function MemoriesSection({ images = [] }: { images?: string[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  // ── Parallax logic ──
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      
      const centerViewport = window.innerHeight / 2
      const distance = centerViewport - rect.top
      setOffset(distance * 0.15)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Trigger once on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Dynamic Mosaic Layout ──
  // Cycles through 4 column styles to adapt to any number of images.
  const columns = useMemo(() => {
    const cols = []
    let i = 0
    let styleIdx = 0
    
    // Safety fallback if no images are passed
    const activeImages = images.length > 0 ? images : Array(7).fill('placeholder.jpg')

    while (i < activeImages.length) {
      const style = styleIdx % 4
      
      // Style 0: Two stacked squares
      if (style === 0 && i + 1 < activeImages.length) {
        cols.push(
          <div key={`col-${i}`} className="flex flex-col gap-4">
            <div className="relative w-[320px] h-[320px] bg-zinc-200 rounded-sm overflow-hidden">
              <Image src={`/memories/${activeImages[i]}`} alt="Memory" fill sizes="320px" className="object-cover" />
            </div>
            <div className="relative w-[320px] h-[220px] bg-zinc-200 rounded-sm overflow-hidden">
              <Image src={`/memories/${activeImages[i+1]}`} alt="Memory" fill sizes="320px" className="object-cover" />
            </div>
          </div>
        )
        i += 2
      } 
      // Style 1: Wide top, tall bottom
      else if (style === 1 && i + 1 < activeImages.length) {
        cols.push(
          <div key={`col-${i}`} className="flex flex-col gap-4">
            <div className="relative w-[400px] h-[250px] bg-zinc-200 rounded-sm overflow-hidden">
              <Image src={`/memories/${activeImages[i]}`} alt="Memory" fill sizes="400px" className="object-cover" />
            </div>
            <div className="relative w-[400px] h-[380px] bg-zinc-200 rounded-sm overflow-hidden">
              <Image src={`/memories/${activeImages[i+1]}`} alt="Memory" fill sizes="400px" className="object-cover" />
            </div>
          </div>
        )
        i += 2
      } 
      // Style 2: Large feature square
      else if (style === 2) {
        cols.push(
          <div key={`col-${i}`} className="flex flex-col gap-4">
            <div className="relative w-[480px] h-[480px] bg-zinc-200 rounded-sm overflow-hidden">
              <Image src={`/memories/${activeImages[i]}`} alt="Memory" fill sizes="480px" className="object-cover" />
            </div>
          </div>
        )
        i += 1
      } 
      // Style 3: Medium top, small bottom
      else if (style === 3 && i + 1 < activeImages.length) {
        cols.push(
          <div key={`col-${i}`} className="flex flex-col gap-4">
            <div className="relative w-[300px] h-[280px] bg-zinc-200 rounded-sm overflow-hidden">
              <Image src={`/memories/${activeImages[i]}`} alt="Memory" fill sizes="300px" className="object-cover" />
            </div>
            <div className="relative w-[300px] h-[250px] bg-zinc-200 rounded-sm overflow-hidden">
              <Image src={`/memories/${activeImages[i+1]}`} alt="Memory" fill sizes="300px" className="object-cover" />
            </div>
          </div>
        )
        i += 2
      } 
      // Fallback: If we need 2 images for a pattern but only 1 is left, just render it as a simple square
      else {
        cols.push(
          <div key={`col-${i}`} className="flex flex-col gap-4">
            <div className="relative w-[300px] h-[300px] bg-zinc-200 rounded-sm overflow-hidden">
              <Image src={`/memories/${activeImages[i]}`} alt="Memory" fill sizes="300px" className="object-cover" />
            </div>
          </div>
        )
        i += 1
      }
      
      styleIdx++
    }
    return cols
  }, [images])

  // Calculate duration dynamically to keep the scroll speed constant regardless of how many images there are.
  // We use roughly 6 seconds per column to keep a steady, readable pace.
  const animationDuration = Math.max(35, columns.length * 6)

  return (
    <section ref={sectionRef} id="memories" className="pt-8 pb-20 bg-stone-50 overflow-hidden flex flex-col">
      
      {/* ── Parallax Heading ── */}
      <div className="relative w-full h-[280px] flex items-center justify-center mb-16 overflow-hidden">
        <h2
          className="absolute text-[10.5vw] sm:text-[9vw] md:text-[8vw] lg:text-[7vw] xl:text-[7.5rem] font-bold text-stone-300 leading-none whitespace-nowrap z-0 pointer-events-none tracking-tighter"
          style={{
            fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
            transform: `translateY(${offset}px)`,
            willChange: 'transform' // optimizes smooth scrolling
          }}
        >
          Unforgettable Memories
        </h2>
        
        <h3
          className="relative text-4xl md:text-5xl font-bold text-zinc-900 z-10 tracking-tight"
          style={{ fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif' }}
        >
          Real Experiences
        </h3>
      </div>

      {/* ── Auto-scrolling Mosaic Marquee ── */}
      <div className="relative w-full overflow-hidden">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee ${animationDuration}s linear infinite;
            width: max-content;
          }
        `}</style>
        
        {/* Container wide enough to hold two identical sets of the mosaic block for seamless looping */}
        <div className="animate-marquee flex gap-4">
          
          {[1, 2].map((group) => (
            <div key={group} className="flex gap-4 items-center shrink-0 pr-4">
              {columns}
            </div>
          ))}

        </div>
      </div>
      
    </section>
  )
}
