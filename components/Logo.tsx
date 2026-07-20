import Link from "next/link";

// OriginDB logo — a hexagonal glass prism (blue→violet) + wordmark. SVG so it's
// crisp, tiny, and theme-independent. `mark` renders just the glyph.
export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lg-face" x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B9DFF" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="lg-top" x1="20" y1="3" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EAF1FF" />
          <stop offset="1" stopColor="#B9CDFF" />
        </linearGradient>
      </defs>
      {/* hexagon body */}
      <path d="M20 2.5 34.7 11v18L20 37.5 5.3 29V11L20 2.5Z" fill="url(#lg-face)" />
      {/* top facet highlight */}
      <path d="M20 2.5 34.7 11 20 19.5 5.3 11 20 2.5Z" fill="url(#lg-top)" opacity=".92" />
      {/* inner cube edges */}
      <path d="M20 19.5V37.5M20 19.5 5.3 11M20 19.5 34.7 11" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" opacity=".55" />
      {/* bolt accent */}
      <path d="M21.5 8.5 16.5 15h3.2l-.8 4.2 5-6.7h-3.2l.8-4Z" fill="#fff" opacity=".95" />
    </svg>
  );
}

export default function Logo({ size = 30, href = "/" }: { size?: number; href?: string }) {
  return (
    <Link className="wordmark" href={href} aria-label="OriginDB home">
      <LogoMark size={size} />
      <span>OriginDB</span>
    </Link>
  );
}
