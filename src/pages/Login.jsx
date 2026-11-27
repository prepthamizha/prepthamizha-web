import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import BiText from '../components/BiText';
import Spinner from '../components/Spinner';
import { useAuth } from '../auth/AuthContext';
import { isFirebaseConfigured } from '../firebase';
import { S } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import logo from '../assets/prep-thamizha-logo-160.png';
import '../auth/auth.css';

const TERMS = 'https://prepthamizha.com/terms.html';
const PRIVACY = 'https://prepthamizha.com/privacy-policy.html';

// Web version of the app's LoginScreen: logo, brand, tagline, "Continue with Google",
// Tamil consent line with English underneath. Popup sign-in (signInWithPopup).
const Login = () => {
  const { status, signIn, notice } = useAuth();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null); // { ta, en }

  // Already signed in → back to where they were going (the gate shows exam choice etc.).
  if (status !== 'signedOut' && status !== 'loading') {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      await signIn();
    } catch (e) {
      const code = e?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // user closed the chooser — not an error (app: SIGN_IN_CANCELLED)
      } else if (code === 'auth/popup-blocked') {
        setError(W.popupBlocked);
      } else {
        setError({ ta: S.auth.googleFailed.ta, en: `${S.auth.googleFailed.en} — ${e?.message || code}` });
      }
    } finally {
      setBusy(false);
    }
  };

  const shownNotice = !isFirebaseConfigured ? W.notConfigured : (error || notice);

  return (
    <div className="auth-page">
      <div className="auth-column">
        <header className="auth-brand">
          <img src={logo} alt="" className="auth-logo" width="90" height="90" />
          <h1 className="auth-brand-name">Prep Thamizha</h1>
          <span className="auth-tagline" lang="ta">{W.tagline.ta}</span>
          <BiText s={S.auth.signInToContinue} center className="auth-subtitle" />
        </header>

        {shownNotice && (
          <div className="auth-notice" role="alert">
            <BiText s={shownNotice} className="auth-notice-text" />
          </div>
        )}

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogle}
          disabled={busy || !isFirebaseConfigured}>
          <span className="google-g" aria-hidden="true">G</span>
          <span>Continue with Google</span>
        </button>

        <p className="auth-consent">
          <span lang="ta">
            தொடர்வதன் மூலம், எங்கள்{' '}
            <a href={TERMS} target="_blank" rel="noreferrer">சேவை விதிமுறைகளையும்</a>{' '}
            <a href={PRIVACY} target="_blank" rel="noreferrer">தனியுரிமைக் கொள்கையையும்</a>{' '}
            ஏற்கிறீர்கள்
          </span>
          <span className="auth-consent-en" lang="en">
            By continuing, you agree to our{' '}
            <a href={TERMS} target="_blank" rel="noreferrer">Terms of Service</a> and{' '}
            <a href={PRIVACY} target="_blank" rel="noreferrer">Privacy Policy</a>
          </span>
        </p>
      </div>

      {busy && (
        <div className="auth-overlay">
          <Spinner light />
          <BiText s={S.auth.signingIn} onDark className="auth-overlay-text" />
        </div>
      )}
    </div>
  );
};

export default Login;
