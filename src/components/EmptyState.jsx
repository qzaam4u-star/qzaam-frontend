import React from 'react';

/* ─────────────────────────────────────────────────────────
   Premium Empty-State Component — Qzaam Design System
   • Inline SVG calendar illustration with soft gradients
   • Floating micro-animations for a SaaS-quality feel
   • Responsive & lightweight (no external assets)
   ───────────────────────────────────────────────────────── */

const floatKeyframes = `
@keyframes emptyFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
@keyframes emptyFadeIn {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes emptyPulseRing {
  0%   { transform: scale(0.95); opacity: 0.5; }
  50%  { transform: scale(1.08); opacity: 0.18; }
  100% { transform: scale(0.95); opacity: 0.5; }
}
@keyframes emptyDotDrift {
  0%, 100% { transform: translate(0, 0); }
  33%  { transform: translate(4px, -5px); }
  66%  { transform: translate(-3px, 3px); }
}
`;

/**
 * CalendarIllustration – Premium inline SVG
 * Uses Qzaam brand palette: deep purple, neon-lime (#d4ff00), soft zinc
 */
function CalendarIllustration({ variant = 'calendar' }) {
  if (variant === 'salon') {
    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', maxWidth: 180, height: 'auto' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="emptyBg" x1="30" y1="20" x2="170" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#d4ff00" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="cardGrad" x1="50" y1="50" x2="155" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#27272a" />
          </linearGradient>
          <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#d4ff00" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#7c3aed" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Background glow circle */}
        <circle cx="100" cy="100" r="88" fill="url(#emptyBg)" />

        {/* Calendar card */}
        <rect x="48" y="52" rx="16" ry="16" width="104" height="100" fill="url(#cardGrad)" filter="url(#softShadow)" />

        {/* Calendar header bar */}
        <rect x="48" y="52" rx="16" ry="16" width="104" height="28" fill="#7c3aed" opacity="0.85" />
        <rect x="48" y="68" width="104" height="12" fill="#7c3aed" opacity="0.85" />

        {/* Calendar hooks */}
        <rect x="72" y="46" width="4" height="14" rx="2" fill="#a78bfa" />
        <rect x="124" y="46" width="4" height="14" rx="2" fill="#a78bfa" />

        {/* Calendar grid dots — 3x3 */}
        {[0, 1, 2].map(r =>
          [0, 1, 2].map(c => (
            <rect
              key={`${r}-${c}`}
              x={66 + c * 26}
              y={90 + r * 18}
              width={16}
              height={4}
              rx={2}
              fill={r === 1 && c === 1 ? '#d4ff00' : '#3f3f46'}
              opacity={r === 1 && c === 1 ? 1 : 0.5}
            />
          ))
        )}

        {/* Highlighted active day */}
        <rect x="88" y="104" width="24" height="12" rx="6" fill="#d4ff00" opacity="0.18" />

        {/* Clock icon — floating */}
        <g style={{ animation: 'emptyDotDrift 4s ease-in-out infinite' }}>
          <circle cx="148" cy="60" r="16" fill="#18181b" stroke="#a78bfa" strokeWidth="1.5" />
          <circle cx="148" cy="60" r="12" fill="none" stroke="#71717a" strokeWidth="1" />
          <line x1="148" y1="60" x2="148" y2="52" stroke="#d4ff00" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="148" y1="60" x2="154" y2="60" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="148" cy="60" r="1.5" fill="#d4ff00" />
        </g>

        {/* Checkmark badge — floating */}
        <g style={{ animation: 'emptyDotDrift 5s ease-in-out infinite reverse' }}>
          <circle cx="56" cy="146" r="12" fill="#d4ff00" opacity="0.15" />
          <circle cx="56" cy="146" r="8" fill="#18181b" stroke="#d4ff00" strokeWidth="1.2" />
          <polyline points="52,146 55,149 60,143" fill="none" stroke="#d4ff00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Sparkle dots */}
        <circle cx="160" cy="140" r="2.5" fill="#a78bfa" opacity="0.4" style={{ animation: 'emptyDotDrift 3s ease-in-out infinite' }} />
        <circle cx="40" cy="80" r="2" fill="#d4ff00" opacity="0.35" style={{ animation: 'emptyDotDrift 3.5s ease-in-out infinite reverse' }} />
        <circle cx="170" cy="100" r="1.8" fill="#d4ff00" opacity="0.3" style={{ animation: 'emptyDotDrift 4.5s ease-in-out infinite' }} />
      </svg>
    );
  }

  /* Default calendar/order variant */
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 180, height: 'auto' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="emptyBg2" x1="30" y1="20" x2="170" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#d4ff00" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="cardGrad2" x1="50" y1="50" x2="155" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#27272a" />
        </linearGradient>
        <filter id="softShadow2" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#d4ff00" floodOpacity="0.12" />
        </filter>
      </defs>

      <circle cx="100" cy="100" r="88" fill="url(#emptyBg2)" />

      {/* Clipboard body */}
      <rect x="55" y="48" rx="14" ry="14" width="90" height="108" fill="url(#cardGrad2)" filter="url(#softShadow2)" />

      {/* Clipboard clip */}
      <rect x="82" y="40" rx="4" ry="4" width="36" height="16" fill="#3f3f46" />
      <rect x="90" y="38" rx="3" ry="3" width="20" height="8" fill="#27272a" stroke="#71717a" strokeWidth="1" />

      {/* Lines on clipboard */}
      <rect x="70" y="72" width="42" height="4" rx="2" fill="#3f3f46" opacity="0.7" />
      <rect x="70" y="84" width="56" height="4" rx="2" fill="#3f3f46" opacity="0.5" />
      <rect x="70" y="96" width="34" height="4" rx="2" fill="#3f3f46" opacity="0.35" />
      <rect x="70" y="108" width="48" height="4" rx="2" fill="#d4ff00" opacity="0.2" />
      <rect x="70" y="120" width="28" height="4" rx="2" fill="#3f3f46" opacity="0.25" />

      {/* Magnifier — floating accent */}
      <g style={{ animation: 'emptyDotDrift 4.5s ease-in-out infinite' }}>
        <circle cx="150" cy="66" r="13" fill="#18181b" stroke="#d4ff00" strokeWidth="1.3" />
        <circle cx="150" cy="66" r="8" fill="none" stroke="#71717a" strokeWidth="1" strokeDasharray="2 3" />
        <line x1="159" y1="75" x2="166" y2="82" stroke="#d4ff00" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Bell — floating accent */}
      <g style={{ animation: 'emptyDotDrift 5s ease-in-out infinite reverse' }}>
        <path d="M46 140 C46 132, 56 128, 56 136 L56 142 C56 144, 46 144, 46 142Z" fill="#a78bfa" opacity="0.5" />
        <circle cx="51" cy="145" r="2" fill="#a78bfa" opacity="0.5" />
        <line x1="51" y1="128" x2="51" y2="132" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* Sparkle dots */}
      <circle cx="38" cy="75" r="2" fill="#d4ff00" opacity="0.3" style={{ animation: 'emptyDotDrift 3s ease-in-out infinite' }} />
      <circle cx="165" cy="130" r="2.5" fill="#a78bfa" opacity="0.35" style={{ animation: 'emptyDotDrift 3.8s ease-in-out infinite reverse' }} />
      <circle cx="155" cy="155" r="1.8" fill="#d4ff00" opacity="0.25" style={{ animation: 'emptyDotDrift 4s ease-in-out infinite' }} />
    </svg>
  );
}

export default function EmptyState({
  text = 'No data found',
  subtitle,
  icon,
  variant = 'calendar',
}) {
  /* If caller passed a custom icon emoji, still render it (backward-compat)
     but wrap it in the new premium layout. Otherwise render SVG illustration. */
  const showSvg = !icon;

  return (
    <>
      <style>{floatKeyframes}</style>
      <div
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
        style={{ animation: 'emptyFadeIn 0.6s ease-out both' }}
      >
        {/* Illustration container */}
        <div
          className="relative mb-6"
          style={{ animation: 'emptyFloat 5s ease-in-out infinite' }}
        >
          {/* Soft pulse ring behind illustration */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
              animation: 'emptyPulseRing 4s ease-in-out infinite',
              transform: 'scale(1.3)',
              pointerEvents: 'none',
            }}
          />

          {showSvg ? (
            <CalendarIllustration variant={variant} />
          ) : (
            <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center text-3xl border border-zinc-800">
              {icon}
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold text-white mb-1.5 tracking-tight"
          style={{ letterSpacing: '-0.01em' }}
        >
          {text}
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
          {subtitle ||
            'Nothing here yet — check back soon or adjust your filters.'}
        </p>
      </div>
    </>
  );
}
