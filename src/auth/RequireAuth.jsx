import { Navigate, Outlet, useLocation } from 'react-router-dom';
import BiText from '../components/BiText';
import Spinner from '../components/Spinner';
import { useAuth } from './AuthContext';
import Welcome from '../pages/Welcome';
import Reactivate from '../pages/Reactivate';
import { S } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import './auth.css';

// Guards every route except /login. Same order as the app's Navigation.js:
// signed out → Login, pending deletion → Reactivate, no exam yet → Welcome, else the app.
const RequireAuth = () => {
  const { status, retryProfile, signOut } = useAuth();
  const location = useLocation();

  if (status === 'loading' || status === 'checking') {
    return (
      <div className="auth-page auth-page--center auth-loader">
        <Spinner />
        <BiText s={S.common.loading} center className="auth-loader-text" />
      </div>
    );
  }
  if (status === 'signedOut') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (status === 'profileError') {
    return (
      <div className="auth-page auth-page--center">
        <div className="auth-column">
          <div className="auth-notice" role="alert">
            <BiText s={W.profileFailed} className="auth-notice-text" />
          </div>
          <button type="button" className="primary-btn" onClick={retryProfile}>{S.common.retry.ta}</button>
          <button type="button" className="text-btn" onClick={signOut}>{S.me.logout.ta}</button>
        </div>
      </div>
    );
  }
  if (status === 'pendingDeletion') return <Reactivate />;
  if (status === 'needsProfile') return <Welcome />;
  return <Outlet />;
};

export default RequireAuth;
