import { useEffect, useRef, useState } from 'react';
import BiText from './BiText';
import { useAuth } from '../auth/AuthContext';
import { api } from '../authInterceptor';
import { S, inline } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import './AccountMenu.css';

// Header avatar → small account menu: name, email, exam, streak, Logout.
// The streak line is a real call to the protected /api/streak route, so it also
// shows that the backend accepts this session's token.
const AccountMenu = () => {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [streak, setStreak] = useState(null); // number | 'error' | null (loading)
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    api.get('/api/streak')
      .then((res) => { if (!cancelled) setStreak(res.data?.data?.current_streak ?? 0); })
      .catch(() => { if (!cancelled) setStreak('error'); });
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      cancelled = true;
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;
  const name = profile?.display_name || user.displayName || user.email?.split('@')[0] || 'Learner';
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = () => {
    if (window.confirm(inline(S.me.logoutSure))) {
      setOpen(false);
      signOut();
    }
  };

  return (
    <div className="account" ref={wrapRef}>
      <button
        type="button"
        className="account-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={W.account.en}
        onClick={() => { setStreak(null); setOpen((o) => !o); }}>
        {user.photoURL
          ? <img src={user.photoURL} alt="" className="account-avatar" referrerPolicy="no-referrer" />
          : <span className="account-avatar account-avatar--initial">{initial}</span>}
      </button>

      {open && (
        <div className="account-menu" role="menu">
          <div className="account-head">
            <BiText s={W.account} className="account-label" />
            <span className="account-name">{name}</span>
            {user.email && <span className="account-email">{user.email}</span>}
          </div>
          <dl className="account-rows">
            {profile?.selected_exam && (
              <div className="account-row">
                <dt><BiText s={W.exam} inline className="account-row-key" /></dt>
                <dd>{profile.selected_exam}</dd>
              </div>
            )}
            <div className="account-row account-row--streak">
              {typeof streak === 'number'
                ? <BiText s={S.home.streak(streak)} inline className="account-row-key" />
                : <span className="account-row-key">{streak === 'error' ? `⚠️ ${S.common.error.ta}` : S.common.loading.ta}</span>}
            </div>
          </dl>
          <button type="button" role="menuitem" className="account-logout" onClick={handleLogout}>
            {S.me.logoutBtn.ta}
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
