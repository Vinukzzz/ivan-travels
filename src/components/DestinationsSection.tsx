'use client'

import Image from 'next/image'
import { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react'

// ── Slide data ──────────────────────────────────────────────────────────────────
const SLIDES = [
  { id: 0, file: 'sigiriya.jpeg',         label: 'Sigiriya',                heading: 'Discover the Ancient Lion Rock', description: 'Explore the ancient fortress, climb to the summit, and take in breathtaking views of the surrounding jungle.' },
  { id: 1, file: 'coconut-tree-hill.jpg', label: 'Coconut Tree Hill',       heading: 'Chase the Ocean Views',          description: 'Climb the famous palm covered hill, enjoy panoramic views of the Indian Ocean, and capture stunning coastal photos.' },
  { id: 2, file: 'nine-arch-bridge.jpeg', label: 'Nine Arch Bridge',        heading: 'Walk Among the Hills',           description: 'Visit the iconic stone bridge, watch the train pass through the lush hills, and enjoy the beautiful scenery around Ella.' },
  { id: 3, file: 'yala-safari.jpg',       label: 'Yala Safari',             heading: "Meet Sri Lanka's Wild Side",     description: "Explore the national park, spot leopards and elephants, and experience Sri Lanka's incredible wildlife up close." },
  { id: 4, file: 'udawalawe.jpeg',        label: 'Udawalawe National Park', heading: 'Into the Heart of the Wild',     description: "Take a safari through open grasslands, spot elephants and other wildlife, and discover Sri Lanka's natural beauty." },
  { id: 5, file: 'sri-pada.jpeg',         label: 'Sri Pada',                heading: 'Climb to a Sacred Summit',       description: 'Take the iconic pilgrimage trail to the summit, witness a breathtaking sunrise, and enjoy panoramic views across the mountains.' },
]

const N         = SLIDES.length
const TILE_W    = 185
const TILE_GAP  = 16
const TILE_STEP = TILE_W + TILE_GAP
const DURATION  = 1050   // ms — shared duration for all movements
const EASE      = 'cubic-bezier(0.45, 0.05, 0.55, 0.95)'
const TEXT_OUT  = 280    // ms — text fades out quickly at start
const TEXT_IN_DELAY = Math.round(DURATION * 0.65) // text fades back in at 65% through

const mod = (i: number) => ((i % N) + N) % N

// ── Expanding tile (NEXT only) ─────────────────────────────────────────────────
// Rendered as a separate absolutely positioned div that animates from the first
// tile's measured coordinates to fill the entire section.
interface ExpandState {
  slideFile: string
  slideLabel: string
  // Initial rect, measured relative to the section element
  x: number; y: number; w: number; h: number
}

function ExpandingTile({ state, onDone }: { state: ExpandState; onDone: () => void }) {
  const [expanded, setExpanded] = useState(false)

  // Paint at the tile's initial position first, then expand on the next frame.
  useEffect(() => {
    const id = requestAnimationFrame(() => setExpanded(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Notify parent when expansion completes.
  useEffect(() => {
    if (!expanded) return
    const t = setTimeout(onDone, DURATION)
    return () => clearTimeout(t)
  }, [expanded, onDone])

  const transition = `left ${DURATION}ms ${EASE}, top ${DURATION}ms ${EASE}, width ${DURATION}ms ${EASE}, height ${DURATION}ms ${EASE}, border-radius ${DURATION}ms ${EASE}`

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        zIndex: 2,                              // ← BELOW the gradient overlays (z-3)
        left:         expanded ? 0 : state.x,
        top:          expanded ? 0 : state.y,
        width:        expanded ? '100%' : state.w,
        height:       expanded ? '100%' : state.h,
        borderRadius: expanded ? 0 : 24,
        transition:   expanded ? transition : 'none',
      }}
    >
      <Image
        src={`/destinations/${state.slideFile}`}
        alt={state.slideLabel}
        fill
        sizes="100vw"
        className="object-cover"
        style={{
          // Only animate blur — the persistent gradient overlay handles all darkening consistently.
          filter:     expanded ? 'blur(0px)' : 'blur(4px)',
          transform:  expanded ? 'scale(1)' : 'scale(1.1)',
          transition: `filter ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}`,
        }}
      />
    </div>
  )
}

// ── Main section ───────────────────────────────────────────────────────────────
export default function DestinationsSection() {
  // The slide currently shown as the static full-screen background
  const [current, setCurrent]   = useState(0)
  // Index of first tile rendered in the track
  const [tileBase, setTileBase] = useState(1)
  // Expanding tile state (NEXT direction only)
  const [expandState, setExpandState] = useState<ExpandState | null>(null)
  // Whether to hide tile[0] in the track while its clone is expanding
  const [hideTileZero, setHideTileZero] = useState(false)
  // For PREV: entering background index (simple crossfade)
  const [bgNext, setBgNext]     = useState<number | null>(null)
  // Text state
  const [textContent, setTextContent]   = useState(0)
  const [textVisible, setTextVisible]   = useState(true)

  const sectionRef  = useRef<HTMLElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const tileZeroRef = useRef<HTMLDivElement>(null)  // ref on the first rendered tile
  const lockedRef   = useRef(false)
  const snapXRef    = useRef<number | null>(null)

  // Apply snap transform before every paint (useLayoutEffect runs after every render).
  useLayoutEffect(() => {
    if (snapXRef.current === null || !trackRef.current) return
    trackRef.current.style.transition = 'none'
    trackRef.current.style.transform  = `translateX(${snapXRef.current}px)`
    snapXRef.current = null
  })

  // Low-level: animate the tile track to targetX with a CSS transition.
  const animateTrack = useCallback((targetX: number, onDone: () => void) => {
    requestAnimationFrame(() => {
      if (!trackRef.current) return
      trackRef.current.style.transition = `transform ${DURATION}ms ${EASE}`
      trackRef.current.style.transform  = `translateX(${targetX}px)`
      setTimeout(onDone, DURATION)
    })
  }, [])

  // Fade text out, swap slide, then fade back in.
  const swapText = useCallback((nextIdx: number) => {
    setTextVisible(false)
    setTimeout(() => {
      setTextContent(nextIdx)
      setTimeout(() => setTextVisible(true), 30)
    }, TEXT_IN_DELAY)
  }, [])

  // Called when the expanding tile finishes growing.
  const handleExpandDone = useCallback(() => {
    // The expansion now fully covers the screen.
    // Swap the static background to the new slide and remove the expanding overlay.
    // Because the expanding tile and the new background show the same image, there's no flicker.
    setCurrent(prev => mod(prev + 1))
    setExpandState(null)
  }, [])

  // ── Navigation ──────────────────────────────────────────────────────────────
  const go = useCallback((dir: 1 | -1) => {
    if (lockedRef.current) return
    lockedRef.current = true

    const next = mod(current + dir)
    swapText(next)

    if (dir === 1) {
      // ── NEXT ──────────────────────────────────────────────────────────────
      // 1. Measure tile[0]'s position relative to the section.
      const sectionEl = sectionRef.current
      const tileEl    = tileZeroRef.current
      if (!sectionEl || !tileEl) { lockedRef.current = false; return }

      const sRect = sectionEl.getBoundingClientRect()
      const tRect = tileEl.getBoundingClientRect()

      // 2. Launch the expanding tile overlay.
      setExpandState({
        slideFile:  SLIDES[mod(current + 1)].file,
        slideLabel: SLIDES[mod(current + 1)].label,
        x: tRect.left - sRect.left,
        y: tRect.top  - sRect.top,
        w: tRect.width,
        h: tRect.height,
      })

      // 3. Hide tile[0] in the track so the expanding clone exclusively represents it.
      setHideTileZero(true)

      // 4. Slide the remaining tiles (tile[1], [2], [3]) left by one step.
      animateTrack(-TILE_STEP, () => {
        // Animation done — advance tileBase, snap track back to 0.
        // setCurrent is handled in handleExpandDone (via the expanding tile's onDone).
        setTileBase(mod(next + 1))
        snapXRef.current = 0
        setHideTileZero(false)
        lockedRef.current = false
      })

    } else {
      // ── PREV: simple crossfade + track slides right ──────────────────────
      setBgNext(next)

      // Place tile[current-1] off-screen left, then animate right to 0.
      snapXRef.current = -TILE_STEP
      setTileBase(mod(current - 1))

      requestAnimationFrame(() => requestAnimationFrame(() => {
        animateTrack(0, () => {
          setCurrent(next)
          setTileBase(mod(next + 1))
          snapXRef.current = 0
          setBgNext(null)
          lockedRef.current = false
        })
      }))
    }
  }, [current, animateTrack, swapText])

  // ── Computed values ─────────────────────────────────────────────────────────
  const tileSlides   = [0, 1, 2, 3].map(o => SLIDES[mod(tileBase + o)])
  const progress     = (current + 1) / N
  const displaySlide = SLIDES[textContent]

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="destinations"
      className="relative h-screen w-full overflow-hidden"
    >

      {/* ── Static background (current slide) ── */}
      <Image
        key={current}
        src={`/destinations/${SLIDES[current].file}`}
        alt={SLIDES[current].label}
        fill priority={current === 0}
        sizes="100vw"
        className="object-cover"
        style={{ zIndex: 0 }}
      />

      {/* ── PREV: entering background (crossfade) ── */}
      {bgNext !== null && (
        <div
          key={`bg-${bgNext}`}
          className="absolute inset-0"
          style={{ zIndex: 1, animation: `dstBgFadeIn ${DURATION}ms ${EASE} forwards` }}
        >
          <Image
            src={`/destinations/${SLIDES[bgNext].file}`}
            alt={SLIDES[bgNext].label}
            fill sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* ── Directional gradient overlays ── */}
      {/* Left-side gradient keeps text readable; lives below the expanding tile */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.42) 48%, rgba(0,0,0,0.06) 100%)',
        }}
      />
      {/* Bottom gradient for controls area */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 pointer-events-none"
        style={{ zIndex: 3, background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 100%)' }}
      />

      {/* ── Expanding tile overlay (NEXT) ── */}
      {/* z-index 6: above gradient (3) but below UI (10) */}
      {expandState && (
        <ExpandingTile
          state={expandState}
          onDone={handleExpandDone}
        />
      )}

      {/* ── Main UI layout (above everything) ── */}
      <div
        className="relative h-full flex flex-col justify-between px-10 md:px-16 py-14"
        style={{ zIndex: 10 }}
      >
        {/* Spacer */}
        <div />

        {/* ── Middle row: text + tile track ── */}
        <div className="flex items-end justify-between gap-8">

          {/* Left: slide text */}
          <div
            className="max-w-lg"
            style={{
              opacity:    textVisible ? 1 : 0,
              transform:  textVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity ${TEXT_OUT}ms ease-in-out, transform ${TEXT_OUT}ms ease-in-out`,
            }}
          >
            <p
              className="text-base text-white/80 italic mb-3 font-normal tracking-wide"
              style={{ fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif' }}
            >
              {displaySlide.label}
            </p>
            <h2
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-5"
              style={{ fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif' }}
            >
              {displaySlide.heading}
            </h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-sm font-sans">
              {displaySlide.description}
            </p>
          </div>

          {/* Right: tile track (hidden on mobile) */}
          {/* clip-path allows the downward shadow to bleed below while still clipping the track sides */}
          <div
            className="hidden md:block flex-shrink-0 pb-14"
            style={{
              width: TILE_W * 2 + TILE_GAP,
              overflow: 'visible',
              clipPath: 'inset(0 0 -80px 0)',   // tight on sides, 80px extra below for shadows
            }}
          >
            <div
              ref={trackRef}
              className="flex"
              style={{ gap: TILE_GAP, willChange: 'transform' }}
            >
              {tileSlides.map((slide, pos) => (
                <div
                  key={`${slide.id}-pos${pos}`}
                  ref={pos === 0 ? tileZeroRef : undefined}
                  className="dst-peek-tile relative rounded-3xl overflow-hidden flex-shrink-0"
                  style={{
                    width:   TILE_W,
                    height:  290,
                    opacity: hideTileZero && pos === 0 ? 0 : 1,
                    // Layered shadows for a lifted, floating look
                    boxShadow: '0 32px 72px rgba(0,0,0,0.60), 0 8px 24px rgba(0,0,0,0.45)',
                    // Thin light border to catch the light
                    outline: '1px solid rgba(255,255,255,0.10)',
                  }}
                >
                  <Image
                    src={`/destinations/${slide.file}`}
                    alt={slide.label}
                    fill sizes="185px"
                    className="object-cover"
                    style={{ filter: 'blur(4px) brightness(0.5)', transform: 'scale(1.1)' }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-3/4 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)' }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p
                      className="text-white/65 text-xs italic mb-1 tracking-wide"
                      style={{ fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif' }}
                    >
                      {slide.label}
                    </p>
                    <p
                      className="text-white font-bold text-sm leading-snug"
                      style={{ fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif' }}
                    >
                      {slide.heading}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Controls ── */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={() => go(-1)}
            className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white/80 hover:bg-white hover:text-black hover:border-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous destination"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            onClick={() => go(1)}
            className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white/80 hover:bg-white hover:text-black hover:border-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Next destination"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="flex-1 max-w-[200px] h-[2px] bg-white/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{
                width: `${progress * 100}%`,
                transition: `width ${DURATION}ms ${EASE}`,
              }}
            />
          </div>

          <span className="text-white/50 text-sm font-sans tabular-nums">
            {String(current + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </span>
        </div>

      </div>

      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes dstBgFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .dst-peek-tile {
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .dst-peek-tile:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 40px 90px rgba(0,0,0,0.70), 0 12px 32px rgba(0,0,0,0.55) !important;
        }
      `}</style>

    </section>
  )
}
