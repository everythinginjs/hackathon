export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Grid Pattern with radial fade */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
        }}
      />

      {/* Geometric design elements with same opacity as grid */}
      {/* Circles */}
      <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full border border-[#a1a1a112]" />
      <div className="absolute top-[60%] right-[15%] w-80 h-80 rounded-full border border-[#a1a1a112]" />
      <div className="absolute bottom-[10%] left-[25%] w-48 h-48 rounded-full border border-[#a1a1a112]" />

      {/* Squares */}
      <div className="absolute top-[40%] right-[8%] w-56 h-56 border border-[#a1a1a112] rotate-12" />
      <div className="absolute bottom-[25%] right-[40%] w-40 h-40 border border-[#a1a1a112] -rotate-6" />

      {/* Lines */}
      <div className="absolute top-[25%] left-[60%] w-72 h-[1px] bg-[#a1a1a112] rotate-45" />
      <div className="absolute bottom-[35%] left-[15%] w-56 h-[1px] bg-[#a1a1a112] -rotate-12" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)]" />

      {/* Very subtle gradient orbs */}
      <div className="absolute top-0 -left-4 w-[500px] h-[500px] bg-violet-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-8 dark:opacity-5 animate-blob" />
      <div className="absolute top-0 -right-4 w-[500px] h-[500px] bg-fuchsia-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-8 dark:opacity-5 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-cyan-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-8 dark:opacity-5 animate-blob animation-delay-4000" />

      {/* Minimal center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-5 dark:opacity-3" />
    </div>
  );
}
