/**
 * Navbar (top bar)
 *
 * Props:
 *   title        {string}   – school/organisation title
 *   subtitle     {string}   – tagline below title
 *   user         {object}   – user object containing { name, role }
 *   onMenuToggle {function} – called when the hamburger button is clicked
 */
export default function Navbar({ 
  title = "SMK Seri Jaya", 
  subtitle = "Selamat • Prihatin • Berdaya",
  user = { name: "Ahmad Faris", role: "Pentadbir Sekolah" },
  onMenuToggle 
}) {
  const { auth } = usePage().props;
  const currentUser = auth?.user ?? user;
  const [profileOpen, setProfileOpen] = useState(false);

  function logout() {
    router.post('/logout');
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 flex-shrink-0">
      {/* Left side: Hamburger & Title Info */}
      <div className="flex items-center gap-3">
        {/* Hamburger Button */}
        <button
          className="p-2 text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Title & Subtitle Dropdown */}
        <button className="flex items-center gap-1.5 text-left group">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-slate-800">{title}</span>
              <svg className="w-3.5 h-3.5 text-slate-500 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {subtitle && (
              <p className="text-[11px] text-slate-400 font-normal leading-tight">{subtitle}</p>
            )}
          </div>
        </button>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* Badge */}
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-slate-50">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="relative">
        <button onClick={() => setProfileOpen(value => !value)} aria-expanded={profileOpen} className="flex items-center gap-2.5 p-1.5 bg-white hover:bg-slate-200/50 rounded-lg transition-colors">
          {/* Avatar Icon */}
          <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          {/* User Info */}
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 leading-tight">{currentUser.role}</p>
          </div>

          <svg className="w-3.5 h-3.5 text-slate-400 ml-1 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {profileOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <p className="text-sm font-semibold text-slate-800">{currentUser.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email ?? currentUser.role}</p>
            </div>
            <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12H3m0 0l4-4m-4 4l4 4m8-9V5a2 2 0 00-2-2H9" /></svg>
              Log Keluar
            </button>
          </div>
        )}
        </div>
      </div>
    </header>
  );
}
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
