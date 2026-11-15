import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { NAV } from './navItems';

/**
 * Slim icon rail, desktop only (lg+), styled with earthy volcanic tones.
 */
export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[88px] flex-col items-center gap-6 border-r border-[#E3D9CC]/70 bg-[#F4EFEA] py-5 lg:flex dark:border-white/10 dark:bg-[#181210]">
      <div className="grid h-12 w-12 place-items-center">
        <Logo showName={false} />
      </div>
      <nav aria-label="Sidebar" className="flex flex-col gap-2 rounded-2xl border border-[#E3D9CC] bg-[#FAF5EE] p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            aria-label={label}
            className={({ isActive }) =>
              `grid h-12 w-12 place-items-center rounded-xl transition ${
                isActive
                  ? 'bg-[#184A2C] text-white shadow-sm dark:bg-[#A3E3B5] dark:text-[#0F2A1D]'
                  : 'text-stone-700 hover:bg-[#EDE5DA] dark:text-stone-300 dark:hover:bg-white/10'
              }`
            }
          >
            <Icon size={22} weight="bold" />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
