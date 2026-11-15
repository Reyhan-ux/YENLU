import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import { NAV } from './navItems';
import { useApp } from '../context/AppContext';
import { initials } from '../utils/format';

/**
 * Clean, focused top navigation bar:
 * - Left: Official YENLU Logo & wordmark
 * - Center: Primary navigation tabs (Advisory, About & Methodology)
 * - Right: Direct link to Team YENLU
 */
export default function Navbar() {
  const { settings } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-[#E3D9CC]/70 bg-[#F4EFEA]/95 backdrop-blur-md dark:border-white/10 dark:bg-[#181210]/95">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 md:px-8">
        {/* Brand logo in top-left */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Primary Navigation Rail */}
        <nav aria-label="Primary" className="flex gap-1.5 rounded-2xl border border-[#E3D9CC] bg-[#FAF5EE]/90 p-1 shadow-xs dark:border-white/10 dark:bg-white/5">
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-h-[38px] items-center rounded-xl px-5 text-xs font-bold uppercase tracking-wider transition ${
                  isActive
                    ? 'bg-[#184A2C] text-white shadow-xs dark:bg-[#A3E3B5] dark:text-[#0F2A1D]'
                    : 'text-stone-700 hover:bg-[#EDE5DA] dark:text-stone-300 dark:hover:bg-white/10'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
