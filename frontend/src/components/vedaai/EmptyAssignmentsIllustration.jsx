export default function EmptyAssignmentsIllustration({ className = '' }) {
  return (
    <div className={`relative w-48 h-48 mx-auto ${className}`}>
      <div className="absolute inset-0 rounded-full bg-white shadow-soft" />
      <svg viewBox="0 0 192 192" className="relative w-full h-full" aria-hidden>
        <rect x="56" y="52" width="72" height="88" rx="8" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="2" />
        <line x1="68" y1="72" x2="116" y2="72" stroke="#d4d4d4" strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="88" x2="108" y2="88" stroke="#d4d4d4" strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="104" x2="100" y2="104" stroke="#d4d4d4" strokeWidth="3" strokeLinecap="round" />
        <circle cx="120" cy="108" r="36" fill="white" stroke="#e5e5e5" strokeWidth="3" />
        <line x1="144" y1="132" x2="168" y2="156" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" />
        <text x="108" y="118" fill="#ef4444" fontSize="28" fontWeight="bold">×</text>
        <path d="M32 64 Q20 48 36 40" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <polygon points="148,44 154,56 142,52" fill="#3b82f6" />
        <circle cx="40" cy="140" r="4" fill="#3b82f6" />
      </svg>
    </div>
  );
}
