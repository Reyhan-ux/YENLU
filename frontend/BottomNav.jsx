import { NavLink } from 'react-router-dom';
import { NAV } from './navItems';

/** Phone navigation, fixed to the bottom and hidden from md up. */
export default function BottomNav() {
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E3D9CC] bg-[#FAF5EE]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden dark:border-white/10 dark:bg-[#181210]/95">
      <ul className="grid grid-cols-2">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex min-h-[56px] flex-col items-center justify-center gap-1 text-xs font-semibold transition ${
                  isActive ? 'text-[#184A2C] dark:text-[#A3E3B5]' : 'text-stone-500 dark:text-stone-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`relative grid h-8 w-14 place-items-center rounded-xl transition ${isActive ? 'bg-[#184A2C]/10 dark:bg-white/10' : ''}`}>
                    <Icon size={20} weight={isActive ? 'bold' : 'regular'} />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
