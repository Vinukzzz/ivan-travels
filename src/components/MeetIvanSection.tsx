'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

// ─── Photo layout — 3 staggered rows, larger photos ──────────────────────────
//
//  front : 235 px wide, image 195 px tall  → polaroid box ≈ 235 × 247
//  back  : 195 px wide, image 160 px tall  → polaroid box ≈ 195 × 203
//
//  Columns share ~15 px horizontal edge overlap (intentional, organic look).
//  Each photo has its own z-index so no photo is fully buried.
//  Container: 660 × 710 px
// ──────────────────────────────────────────────────────────────────────────────
const PHOTOS = [
  // ── Row 1 ──
  { file: '481767370_626531736796454_2000984478891535525_n.jpg',  front: true,  rotate: -4, top:  15, left:  10, z:  5 },
  { file: '503227657_9882434188507713_7605294770130369704_n.jpg', front: false, rotate:  6, top:  25, left: 230, z:  3 },
  { file: '503374917_9882436628507469_5230750700735238631_n.jpg', front: true,  rotate: -5, top:  10, left: 415, z:  8 },
  // ── Row 2 ──
  { file: '503847109_9882434168507715_2210617971777068239_n.jpg', front: false, rotate:  5, top: 232, left:   5, z:  2 },
  { file: '503503672_9885637621520703_2893997315104007731_n.jpg', front: true,  rotate: -3, top: 222, left: 215, z:  7 },
  { file: '504011224_9882434135174385_5156998919535677275_n.jpg', front: false, rotate:  7, top: 238, left: 420, z:  4 },
  // ── Row 3 ──
  { file: '503601482_9885635114854287_856074649480491034_n.jpg',  front: true,  rotate: -6, top: 452, left:  15, z:  9 },
  { file: '504068709_9882434298507702_1579320588538545325_n.jpg', front: false, rotate:  4, top: 443, left: 218, z:  6 },
  { file: '503745054_9885635458187586_7218500282921730656_n.jpg', front: true,  rotate: -5, top: 448, left: 420, z: 10 },
]

// ─── Stat counter ─────────────────────────────────────────────────────────────

function StatCounter({
  value, suffix, label, trigger, delay = 0,
}: {
  value: number | null
  suffix: string
  label: string
  trigger: boolean
  delay?: number
}) {
  const [count, setCount]     = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!trigger) return
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [trigger, delay])

  useEffect(() => {
    if (!visible || value === null) return
    const duration = 2800            // slow enough to clearly watch
    let startTime: number | null = null
    const frame = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [visible, value])

  // Both numeric and ∞ use the same bold sans tag — no SVG needed
  const display = value === null ? '∞' : `${count}${suffix}`

  return (
    <div
      className="transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
    >
      <p
        className="text-6xl font-bold text-amber-500 leading-none tracking-tight"
        style={{ fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif', fontStretch: 'condensed' }}
      >
        {display}
      </p>
      <p
        className="text-base text-zinc-700 mt-1 font-medium tracking-wide"
        style={{ fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif' }}
      >
        {label}
      </p>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function MeetIvanSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView]       = useState(false)
  const [settled, setSettled]     = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.12 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Parallax heading settling logic (matching Testimonials)
  const [headingY, setHeadingY] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      // Heading starts slightly higher (max 40px) and settles to 0 smoothly as section top approaches top of viewport.
      const newHeadingY = Math.max(-40, Math.min(0, -rect.top * 0.1))
      setHeadingY(newHeadingY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Init
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mark settled after the last photo's animation finishes, then drop stagger delays
  useEffect(() => {
    if (!inView) return
    const lastDelay = (PHOTOS.length - 1) * 150 + 1050
    const t = setTimeout(() => setSettled(true), lastDelay)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <section
      id="meet-ivan"
      ref={sectionRef}
      className="bg-stone-50 pt-16 pb-8 px-8 md:px-16 lg:px-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">

        {/* ── Left: text ── */}
        <div className="flex-1 min-w-0 max-w-xl">
          <h2
            className="text-4xl md:text-5xl font-bold text-zinc-900 mb-14 leading-tight tracking-tight"
            style={{ 
              fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
              transform: `translateY(${headingY}px)`,
              willChange: 'transform'
            }}
          >
            A Guide With a Story
          </h2>

          <div className="grid grid-cols-2 gap-x-24 gap-y-16 mb-14">
            <StatCounter value={40}   suffix="+" label="Years of Experience"   trigger={inView} delay={0}   />
            <StatCounter value={500}  suffix="+" label="Tours Around Sri Lanka" trigger={inView} delay={150} />
            <StatCounter value={1000} suffix="+" label="Guests Welcomed"        trigger={inView} delay={300} />
            <StatCounter value={null} suffix=""  label="Countless Stories"      trigger={inView} delay={450} />
          </div>

          <p className="text-zinc-600 text-[15px] leading-[1.85] font-sans max-w-lg">
            For over 40 years, I've been welcoming travelers at the airport and showing them my island,
            not from a script but from behind the wheel of my own van. I know the roads better than
            any map, the shortcuts that save you hours, and the quiet places worth stopping at that you
            won't find in a guidebook. Whether it's a single day exploring the coast or two weeks
            crossing the whole country, I build the trip around you, adjust as we go, and get you safely
            to your hotel every night. Over a thousand guests later, it's still the road trips and the
            stories along the way that I love most.
          </p>
        </div>

        {/* ── Right: photo scatter ── */}
        <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
          <div className="relative" style={{ width: 660, height: 710 }}>
            {PHOTOS.map((photo, i) => {
              const isFront   = photo.front
              const w         = isFront ? 235 : 195
              const imgH      = isFront ? 195 : 160
              const isHovered = hoveredIdx === i
              const delay     = i * 150

              // After initial stagger settles, switch to fast hover transitions
              const transitionStyle = settled
                ? 'transform 220ms ease, box-shadow 180ms ease, opacity 180ms ease'
                : `opacity 800ms ease ${delay}ms, transform 1000ms cubic-bezier(0.34,1.4,0.64,1) ${delay}ms`

              const shadow = isHovered
                ? (isFront
                    ? '0 28px 64px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.20)'
                    : '0 20px 48px rgba(0,0,0,0.28), 0 6px 14px rgba(0,0,0,0.16)')
                : (isFront
                    ? '0 12px 36px rgba(0,0,0,0.20), 0 3px 8px rgba(0,0,0,0.10)'
                    : '0 7px 22px rgba(0,0,0,0.16)')

              return (
                <div
                  key={photo.file}
                  className="absolute bg-white"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    width:      w,
                    top:        photo.top,
                    left:       photo.left,
                    zIndex:     isHovered ? 50 : photo.z,
                    padding:    isFront ? '12px 12px 40px' : '10px 10px 33px',
                    boxShadow:  shadow,
                    filter:     isFront ? 'none' : 'sepia(60%) brightness(84%) contrast(90%)',
                    cursor:     'zoom-in',
                    opacity:    inView ? 1 : 0,
                    transform:  !inView
                      ? `rotate(${photo.rotate}deg) scale(0.7) translateY(20px)`
                      : isHovered
                        ? `rotate(${photo.rotate}deg) scale(1.08)`
                        : `rotate(${photo.rotate}deg)`,
                    transition: transitionStyle,
                  }}
                >
                  <div className="relative" style={{ height: imgH }}>
                    <Image
                      src={`/meet-ivan/${photo.file}`}
                      alt={isFront ? 'Ivan on tour' : 'Ivan through the years'}
                      fill
                      className="object-cover"
                      sizes={`${w - 24}px`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}

