interface MascotLogoProps {
  className?: string;
}

/**
 * Custom playful EdTech owl-star mascot logo for Maths Master Kids.
 */
export function MascotLogo({ className = 'w-10 h-10' }: MascotLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mmkBadgeGrad" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="55%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="mmkGoldGrad" x1="20" y1="10" x2="44" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Rounded Emblem Base with subtle 3D bottom lip */}
      <rect x="4" y="6" width="56" height="54" rx="18" fill="#1E40AF" />
      <rect x="4" y="4" width="56" height="52" rx="18" fill="url(#mmkBadgeGrad)" />

      {/* Friendly Owl/Scholar Character */}
      {/* Ear tufts */}
      <path d="M17 19 L22 13 L26 19 Z" fill="#60A5FA" />
      <path d="M47 19 L42 13 L38 19 Z" fill="#60A5FA" />

      {/* Owl body */}
      <rect x="16" y="16" width="32" height="32" rx="14" fill="#EFF6FF" />

      {/* Expressive Big Eyes */}
      <circle cx="25.5" cy="29" r="6.2" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
      <circle cx="38.5" cy="29" r="6.2" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
      <circle cx="26.2" cy="29" r="3.1" fill="#0F172A" />
      <circle cx="39.2" cy="29" r="3.1" fill="#0F172A" />
      <circle cx="27.3" cy="27.7" r="1.1" fill="#FFFFFF" />
      <circle cx="40.3" cy="27.7" r="1.1" fill="#FFFFFF" />

      {/* Beak */}
      <path d="M29.5 34.5 L34.5 34.5 L32 38.5 Z" fill="#F59E0B" />

      {/* Cheerful Smile Cheek Accents */}
      <circle cx="20.5" cy="34.5" r="2.1" fill="#FDA4AF" fillOpacity="0.65" />
      <circle cx="43.5" cy="34.5" r="2.1" fill="#FDA4AF" fillOpacity="0.65" />

      {/* Mini Math Plus Badge & Star */}
      <circle cx="50" cy="14" r="9" fill="url(#mmkGoldGrad)" stroke="#FFFFFF" strokeWidth="2" />
      <path
        d="M50 10.2 L51.1 12.6 L53.7 13 L51.8 14.8 L52.3 17.4 L50 16.1 L47.7 17.4 L48.2 14.8 L46.3 13 L48.9 12.6 Z"
        fill="#FFFFFF"
      />

      {/* Little Plus Spark on bottom-left */}
      <circle cx="13" cy="48" r="6.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.8" />
      <path d="M13 45.2 V50.8 M10.2 48 H15.8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface OperationIllustrationProps {
  operation: 'ADDITION' | 'SUBTRACTION' | 'MULTIPLICATION' | 'DIVISION';
}

/**
 * Crisp white vector mini-illustration displayed inside each 3D game card.
 */
export function OperationIllustration({ operation }: OperationIllustrationProps) {
  if (operation === 'ADDITION') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11" aria-hidden="true">
        <rect x="6" y="10" width="14" height="14" rx="4" fill="white" fillOpacity="0.28" />
        <rect x="28" y="24" width="14" height="14" rx="4" fill="white" fillOpacity="0.28" />
        <path d="M24 11V37M11 24H37" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (operation === 'SUBTRACTION') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11" aria-hidden="true">
        <circle cx="14" cy="14" r="4" fill="white" fillOpacity="0.35" />
        <circle cx="24" cy="14" r="4" fill="white" fillOpacity="0.35" />
        <circle cx="34" cy="14" r="4" stroke="white" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="3 3" />
        <path d="M10 28H38" stroke="white" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }
  if (operation === 'MULTIPLICATION') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11" aria-hidden="true">
        <circle cx="11" cy="11" r="3" fill="white" fillOpacity="0.35" />
        <circle cx="37" cy="11" r="3" fill="white" fillOpacity="0.35" />
        <circle cx="11" cy="37" r="3" fill="white" fillOpacity="0.35" />
        <circle cx="37" cy="37" r="3" fill="white" fillOpacity="0.35" />
        <path d="M14 14L34 34M34 14L14 34" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11" aria-hidden="true">
      <circle cx="24" cy="12" r="4.5" fill="white" />
      <path d="M10 24H38" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
      <circle cx="24" cy="36" r="4.5" fill="white" />
    </svg>
  );
}
