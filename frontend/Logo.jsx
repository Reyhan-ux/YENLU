import { Link } from 'react-router-dom';


export default function Logo({ showName = true, className = '' }) {
  return (
    <Link
      to="/"
      aria-label="YENLU home"
      className={`group flex min-h-[47px] items-center justify-center gap-2 transition ${showName ? 'pr-2' : ''} ${className}`}
    >
      {/* User's uploaded Tree Knot Emblem (dark green in light mode, yellow in dark mode) */}
      <div className="relative h-10 w-10 shrink-0 transition-transform duration-200 group-hover:scale-105">
        <img
          src="/logo.png"
          alt="YENLU Tree Emblem"
          className="h-full w-full object-contain"
        />
        <img
          src="/logo-yellow.png"
          alt="YENLU Tree Emblem"
          className="hidden h-full w-full object-contain dark:block"
        />
      </div>

      {showName && (
        <span
          className="font-logo text-4xl font-black tracking-wider text-[#184A2C] transition-colors dark:text-[#FAF5EE]"
          style={{
            fontFamily: "'Bricolage Grotesque', 'Figtree', 'Raleway', sans-serif",
            fontWeight: 900,
            letterSpacing: '0.04em'
          }}
        >
          yenl<span className="text-[#E6AF1A]">u</span>
        </span>
      )}
    </Link>
  );
}
