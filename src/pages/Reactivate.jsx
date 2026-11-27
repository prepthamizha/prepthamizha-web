import { useState } from 'react';
import BiText from '../components/BiText';
import Spinner from '../components/Spinner';
import { useAuth } from '../auth/AuthContext';
import { S } from '../i18n/strings';
import '../auth/auth.css';

// Web version of the app's ReactivateAccountScreen: account pending deletion, still
// inside the 2-day grace window. Reactivate → POST /api/user/cancel-deletion → app.
// Decline → sign out.
const Reactivate = () => {
  const { reactivate, declineReactivate } = useAuth();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const run = async (fn) => {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      await fn();
    } catch {
      setFailed(true);
      setBusy(false);
    }
  };

  return (
    <div className="auth-page auth-page--center">
      <div className="auth-column">
        <span className="reactivate-icon" aria-hidden="true">⚠️</span>
        <BiText s={S.auth.welcomeBack} center className="reactivate-title" />
        <BiText s={S.auth.reactivateMsg} center className="reactivate-msg" />

        {failed && (
          <div className="auth-notice" role="alert">
            <BiText s={S.auth.reactivateFailed} className="auth-notice-text" />
          </div>
        )}

        <button type="button" className="primary-btn" onClick={() => run(reactivate)} disabled={busy}>
          {busy ? <Spinner light small /> : <BiText s={S.auth.reactivate} onDark center className="primary-btn-label" />}
        </button>
        <button type="button" className="danger-link-btn" onClick={() => run(declineReactivate)} disabled={busy}>
          <BiText s={S.auth.keepScheduled} center className="danger-link-label" />
        </button>
      </div>
    </div>
  );
};

export default Reactivate;
