import { NavLink, Outlet } from 'react-router-dom';
import AccountMenu from './AccountMenu';
import { useAuth } from '../auth/AuthContext';
import { S } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import './AppShell.css';

// Hour of the day in IST (Asia/Kolkata), whatever the device timezone — same as TabHeader.js.
const istHour = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000).getUTCHours();

const TABS = [
  { to: '/', icon: '🏠', label: W.tabs.home, end: true },
  { to: '/quick5', icon: '⚡', label: W.tabs.quick5 },
  { to: '/practice', icon: '📚', label: W.tabs.practice },
  // Sidebar only: the phone tab bar stays at five (Papers is reached from Home there).
  { to: '/papers', icon: '🗂️', label: W.tabs.papers, desktopOnly: true },
  { to: '/progress', icon: '📊', label: W.tabs.progress },
  { to: '/leaderboard', icon: '🏆', label: W.tabs.leaderboard },
];

// Navy header (small PREP THAMIZHA + IST greeting, like the app's TabHeaderTitle).
// Bottom tab bar on mobile; the same nav becomes a left sidebar on wide screens.
// Greeting name as in the app's TabHeader: first word of the display name, else the
// email prefix.
const firstName = (user) => {
  const dn = user?.displayName?.trim();
  const raw = dn ? dn.split(/\s+/)[0] : user?.email?.split('@')[0] || '';
  return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : '';
};

const AppShell = () => {
  const { user } = useAuth();
  const greeting = S.home.greeting(istHour());
  const name = firstName(user);
  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-header-inner">
          <div className="shell-header-text">
            <span className="shell-brand">PREP THAMIZHA</span>
            <span className="shell-greeting" lang="ta">{greeting.ta}{name ? `, ${name}` : ''} 👋</span>
          </div>
          <AccountMenu />
        </div>
      </header>

      <div className="shell-body">
        <nav className="shell-tabs" aria-label="Main">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.end} className={`shell-tab${t.desktopOnly ? ' shell-tab--desktop' : ''}`}>
              <span className="shell-tab-icon" aria-hidden="true">{t.icon}</span>
              <span className="shell-tab-label">{t.label.ta}</span>
            </NavLink>
          ))}
        </nav>

        <main className="shell-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
