export function CollageHeart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function CollageCherry({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden>
      <path d="M24 28c-6 0-10-4-10-9s4-9 10-9 10 4 10 9-4 9-10 9z" fill="#C41E1E" />
      <circle cx="18" cy="12" r="5" fill="#C41E1E" />
      <circle cx="30" cy="10" r="5" fill="#8B1A1A" />
      <path d="M24 19V8M18 12c-4-6-8-6-10-4M30 10c4-5 8-5 10-3" stroke="#2d5016" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function CollageSafetyPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 48" aria-hidden>
      <ellipse cx="12" cy="8" rx="8" ry="7" fill="none" stroke="#aaa" strokeWidth="2" />
      <line x1="12" y1="15" x2="12" y2="44" stroke="#aaa" strokeWidth="2" />
      <circle cx="12" cy="44" r="3" fill="#888" />
    </svg>
  );
}

export function CollageButterfly({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 48" aria-hidden>
      <ellipse cx="20" cy="24" rx="18" ry="14" fill="#f5ede0" opacity="0.9" transform="rotate(-20 20 24)" />
      <ellipse cx="44" cy="24" rx="18" ry="14" fill="#C41E1E" opacity="0.85" transform="rotate(20 44 24)" />
      <ellipse cx="16" cy="32" rx="10" ry="8" fill="#ede0cc" transform="rotate(-10 16 32)" />
      <ellipse cx="48" cy="32" rx="10" ry="8" fill="#8B1A1A" transform="rotate(10 48 32)" />
      <line x1="32" y1="12" x2="32" y2="38" stroke="#1a0a0e" strokeWidth="2" />
    </svg>
  );
}

export function CollageTape({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 24" aria-hidden>
      <rect x="0" y="4" width="80" height="16" rx="2" fill="rgba(245,237,224,0.55)" transform="rotate(-2 40 12)" />
      <line x1="8" y1="12" x2="72" y2="12" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
    </svg>
  );
}

export function CollageFlower({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" aria-hidden>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="40" cy="24" rx="12" ry="20" fill="#f5ede0" transform={`rotate(${deg} 40 40)`} />
      ))}
      <circle cx="40" cy="40" r="10" fill="#C9973A" />
    </svg>
  );
}
