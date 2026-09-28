export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden flex flex-col"
    >
      {/* ── Background video ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/HeroVid.mp4"
      />

      {/* ── Bottom gradient — keeps headline text readable ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

      {/* ── Top gradient — keeps floating nav text readable over any video frame ── */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent pointer-events-none" />

      {/* ── Hero content ── */}
      <div className="relative z-10 flex flex-1 flex-col justify-end pb-24 px-8 md:px-16 max-w-4xl">
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg"
          style={{ fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif' }}
        >
          More Than a Trip,
          <br />
          <span className="text-amber-400">a Story.</span>
        </h1>
        <p className="mt-5 text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
          Go beyond the usual and discover the Sri Lanka only a local can show you.
        </p>
      </div>

      {/* ── Scroll-down arrow ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 animate-bounce">
        <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
        <svg
          className="text-white/60 w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  )
}
