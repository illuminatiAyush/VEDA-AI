import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutProvider, useLayout } from '../context/LayoutContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LogOut,
  LayoutGrid,
  Users,
  FileText,
  Bell,
  ChevronDown,
  Settings,
  Sparkles,
  BookOpen,
  Tablet,
  Clock,
  ArrowLeft,
  KeyRound,
  User,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import VedaLogo from '../components/vedaai/VedaLogo';

function LayoutShell() {
  const { logout, user } = useAuth();
  const { assignmentCount } = useLayout();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0]?.replace(/[._]/g, ' ') ||
    'Teacher';

  const path = location.pathname;
  const isTestViewer = path.includes('/teacher/test/');
  const isCreateFlow = path.includes('/teacher/create-test');

  const teacherNav = [
    { name: 'Home', path: '/teacher/home', icon: LayoutGrid, match: (p) => p === '/teacher/home' || p.includes('/teacher/test/') },
    {
      name: 'Assignments',
      path: '/teacher/dashboard',
      icon: FileText,
      badge: assignmentCount,
      match: (p) => p === '/teacher/dashboard',
    },
    { name: "AI Teacher's Toolkit", path: '/teacher/toolkit', icon: Tablet, match: (p) => p.includes('/teacher/toolkit') || p.includes('/teacher/create-test') },
    { name: 'My Library', path: '/teacher/library', icon: Clock, match: (p) => p.includes('/teacher/library') },
  ];

  const teacherMobileDefault = [
    { name: 'Home', path: '/teacher/home', icon: LayoutGrid, match: (p) => p === '/teacher/home' || isTestViewer },
    { name: 'Assignments', path: '/teacher/dashboard', icon: FileText, match: (p) => p === '/teacher/dashboard' },
    { name: 'Library', path: '/teacher/library', icon: BookOpen, match: (p) => p.includes('/teacher/library') },
    { name: 'AI Toolkit', path: '/teacher/toolkit', icon: Sparkles, match: (p) => p.includes('/teacher/toolkit') || isCreateFlow },
  ];

  const navLinks = teacherNav;
  const mobileLinks = teacherMobileDefault;

  const isActive = (link) => {
    if (link.match) return link.match(path);
    return path === link.path;
  };

  const breadcrumb = () => {
    if (isCreateFlow) return 'Assignment';
    if (isTestViewer) return 'Assignment';
    if (path.includes('library')) return 'My Library';
    if (path.includes('toolkit')) return "AI Teacher's Toolkit";
    if (path.includes('home')) return 'Home';
    return 'Assignment';
  };

  const showBack = isCreateFlow || isTestViewer;

  const showCreateNew = isTestViewer;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const sidebarCta = isTestViewer ? (
    <Link
      to="/teacher/toolkit"
      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white text-sm font-semibold rounded-full shadow-brand-glow hover:bg-primary-hover transition-colors"
    >
      <Sparkles size={18} />
      <span>AI Teacher&apos;s Toolkit</span>
    </Link>
  ) : (
    <Link
      to="/teacher/create-test"
      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white text-sm font-semibold rounded-full shadow-brand-glow hover:bg-primary-hover transition-colors"
    >
      <Plus size={18} />
      <span>Create Assignment</span>
      <Sparkles size={16} className="opacity-90" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-background text-text flex flex-col lg:flex-row font-sans pb-20 lg:pb-0">
      <aside className="w-[260px] bg-white hidden lg:flex flex-col sticky top-0 h-screen z-40 rounded-r-veda-xl shadow-soft shrink-0">
        <div className="p-6 pb-4">
          <VedaLogo to="/teacher/home" />
        </div>

        {sidebarCta && <div className="px-4 mb-4">{sidebarCta}</div>}

        <nav className="flex-1 px-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center justify-between px-4 py-3 rounded-veda text-sm font-medium transition-all ${
                  active ? 'bg-surface-muted text-primary' : 'text-text-muted hover:bg-surface-muted/60 hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} strokeWidth={active ? 2 : 1.75} />
                  <span>{link.name}</span>
                </div>
                {link.badge != null && link.badge > 0 && (
                  <span className="min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-brand text-white text-[10px] font-bold">
                    {link.badge > 99 ? '99+' : link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-border/60">
          <Link
            to="/teacher/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-veda text-sm font-medium text-text-muted hover:bg-surface-muted hover:text-primary mb-3"
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          <div className="p-3 bg-surface-muted rounded-veda flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-lg shrink-0">
              🏫
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary truncate">Delhi Public School</p>
              <p className="text-xs text-text-muted truncate">Bokaro Steel City</p>
            </div>
          </div>
        </div>
      </aside>

      <header className="lg:hidden mx-3 mt-3 mb-2 bg-white rounded-veda-xl px-4 py-3 flex items-center justify-between shadow-soft sticky top-3 z-30">
        <VedaLogo to="/teacher/home" size="sm" />
        <div className="flex items-center gap-2">
          <button type="button" className="p-2 relative text-text-muted" aria-label="Notifications">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" />
          </button>
          <Link
            to="/teacher/profile"
            className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center text-sm font-semibold text-primary"
          >
            {user?.email?.[0]?.toUpperCase()}
          </Link>
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-text-muted" aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden fixed inset-x-3 top-[72px] bg-white rounded-veda-xl shadow-card z-40 p-4 border border-border"
          >
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-surface-muted"
                >
                  <link.icon size={18} />
                  {link.name}
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-danger bg-red-50 rounded-xl"
            >
              <LogOut size={16} />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 lg:pr-4 lg:py-4">
        <header className="hidden lg:flex items-center justify-between px-2 sm:px-4 py-4">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-text-muted hover:text-primary shadow-soft"
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <LayoutGrid size={18} className="text-text-muted" />
            <span className="text-sm font-medium text-text-muted">{breadcrumb()}</span>
            {showCreateNew && (
              <Link
                to="/teacher/create-test"
                className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-border rounded-full text-sm font-semibold text-primary hover:bg-surface-muted shadow-soft"
              >
                <Plus size={16} />
                Create New
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="p-2 relative text-text-muted hover:text-primary" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center text-sm font-semibold text-primary">
                  {user?.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-primary capitalize">{displayName}</span>
                <ChevronDown size={16} className="text-text-muted" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-veda shadow-card border border-border py-1 z-50">
                  <Link
                    to="/teacher/profile"
                    className="block px-4 py-2.5 text-sm hover:bg-surface-muted"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-red-50"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-3 sm:px-4 lg:px-2 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-3 inset-x-3 h-[68px] bg-primary rounded-[28px] px-2 flex items-center justify-around z-40 shadow-card safe-bottom">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2 ${
                active ? 'text-white' : 'text-white/45'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
              <span className="text-[10px] font-medium truncate w-full text-center">{link.name}</span>
              {active && <span className="w-6 h-0.5 bg-white rounded-full mt-0.5" />}
            </Link>
          );
        })}
      </nav>

      {path === '/teacher/dashboard' && (
        <Link
          to="/teacher/create-test"
          className="lg:hidden fixed bottom-[88px] right-5 w-14 h-14 bg-white rounded-full shadow-card flex items-center justify-center z-30"
          aria-label="Create Assignment"
        >
          <Plus size={28} className="text-brand" strokeWidth={2.5} />
        </Link>
      )}
    </div>
  );
}

export default function MainLayout() {
  return (
    <LayoutProvider>
      <LayoutShell />
    </LayoutProvider>
  );
}
