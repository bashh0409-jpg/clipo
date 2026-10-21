{
  /* ───────── HERO ───────── */
}
<section
  className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cover bg-center px-2 md:px-6"
  style={{ backgroundImage: "url('/images/about-bg.jpg')" }}
>
  {/* Background video (hidden for reduced motion, so the still image shows) */}
  <video
    className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
    src="/start/cosmos_512150715.mp4"
    poster="/images/about-bg.jpg"
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    aria-hidden="true"
  />

  {/* Dark tint so the white wordmark always reads */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#010c84]/30 to-[#010c84]"
  />

  <div className="relative z-10 flex w-full flex-col items-center text-center">
    {/* Wordmark */}
    <h1 className="flex w-full flex-col items-center justify-center font-black uppercase bbh leading-[0.85] tracking-tighter text-white md:flex-row md:gap-[0.15em]">
      <span className="text-[24vw] md:text-[11vw]">Veyra</span>
      <span className="text-[24vw] md:text-[11vw]">Group</span>
    </h1>

    {/* Mono tagline */}
    <div className="mt-6 flex flex-col items-center font-mono text-xs uppercase leading-snug tracking-wide text-white md:mt-8 md:text-lg">
      <span>About us</span>
      <span>Companies, products, and ideas.</span>
      <span className="text-[#F5D76A]">Good ideas deserve to be seen.</span>
    </div>

    {/* Globe icon */}
    <svg
      aria-hidden="true"
      viewBox="0 0 64 34"
      className="mt-8 h-8 w-16 text-white/90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M2 32a30 30 0 0 1 60 0z" />
      <path d="M32 2v30" />
      <path d="M32 2c-9 6-14 16-14 30" />
      <path d="M32 2c9 6 14 16 14 30" />
      <path d="M32 2c-15 6-24 16-24 30" />
      <path d="M32 2c15 6 24 16 24 30" />
      <path d="M5 22h54" />
      <path d="M12 12h40" />
    </svg>
  </div>
</section>;
