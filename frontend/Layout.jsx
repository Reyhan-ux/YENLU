import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

/** App shell: sidebar (lg+), sticky navbar, page outlet, bottom nav (< md). */
export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="relative min-h-screen">
      {/* Background African Farm Motifs Pattern Overlay (Light & Dark Modes) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-repeat opacity-[0.018] mix-blend-multiply dark:opacity-[0.014] dark:invert dark:mix-blend-screen transition-opacity duration-300"
        style={{
          backgroundImage: "url('/african-motifs.jpg')",
          backgroundSize: '360px 360px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <Sidebar />
        <div className="lg:pl-[88px]">
          <Navbar />
          <main className="mx-auto w-full max-w-[1400px] px-4 pb-28 pt-2 md:px-8 md:pb-12">
            <div key={pathname} className="animate-pop">
              <Outlet />
            </div>
            <p className="mt-10 text-center text-xs text-ink/50 dark:text-leaf-100/40">
              Sample data for demonstration. Rainfall series are shaped like NASA POWER output.
            </p>
          </main>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
