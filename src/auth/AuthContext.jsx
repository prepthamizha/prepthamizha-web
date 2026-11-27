// Login state for the web app — follows the app's Navigation.js auth flow:
//   signed out → Login
//   signed in  → GET /api/user/profile/:uid
//     status 'pending_deletion' within the 2-day grace window → Reactivate screen
//     grace window over → sign out, "Account Deleted" notice on Login
//     no profile / no selected_exam → exam choice (Welcome), then the app
//     otherwise → the app
// Differences from the app (on purpose):
//   - No device lock: register-device is never called and device_id is ignored.
//   - A failed/timed-out profile fetch shows a retry screen instead of falling
//     through to the exam choice.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser } from '../firebase';
import { api } from '../authInterceptor';
import { S } from '../i18n/strings';

const GRACE_MS = 2 * 24 * 60 * 60 * 1000;

// Leaderboard name for web-only users. The app sets display_name through
// register-device (skipped on the web, it also writes device_id), so the web fills
// it here: first word of the Google name, only when the profile has none, never
// overwriting a name set in the app. PUT /api/user/profile/:uid trims to 30 chars.
// No Google name → left empty (the leaderboard shows "Learner").
const fillDisplayNameIfEmpty = async (currentUser, profile) => {
  if (!profile?.selected_exam || profile.display_name) return null; // no row yet, or already named
  const first = currentUser.displayName?.trim().split(/\s+/)[0];
  if (!first) return null;
  try {
    await api.put(`/api/user/profile/${currentUser.uid}`, { display_name: first });
    return first.slice(0, 30);
  } catch {
    return null; // non-fatal; tried again on the next sign-in or reload
  }
};
// Render free tier can take ~30s+ to wake up (the app uses 12s and then gives up).
const PROFILE_TIMEOUT_MS = 30000;

// status: 'loading' | 'signedOut' | 'checking' | 'profileError'
//       | 'pendingDeletion' | 'needsProfile' | 'ready'
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [status, setStatus] = useState(auth ? 'loading' : 'signedOut');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [notice, setNotice] = useState(null); // { ta, en } shown on the Login screen
  // Ignore results of a profile check that belongs to an older auth state.
  const checkIdRef = useRef(0);

  // Fire-and-forget; updates the local profile only if the save went through.
  const fillName = useCallback(async (currentUser, p) => {
    const saved = await fillDisplayNameIfEmpty(currentUser, p);
    if (saved && auth?.currentUser?.uid === currentUser.uid) {
      setProfile((prev) => (prev && !prev.display_name ? { ...prev, display_name: saved } : prev));
    }
  }, []);

  const checkProfile = useCallback(async (currentUser) => {
    const checkId = ++checkIdRef.current;
    const stale = () => checkId !== checkIdRef.current;
    setStatus('checking');
    let data;
    try {
      const res = await api.get(`/api/user/profile/${currentUser.uid}`, { timeout: PROFILE_TIMEOUT_MS });
      data = res.data || {};
    } catch {
      if (!stale()) setStatus('profileError');
      return;
    }
    if (stale()) return;

    const p = data.success ? data.data : null;
    setProfile(p);

    if (p?.status === 'pending_deletion' && p.deletion_requested_at) {
      const ageMs = Date.now() - new Date(p.deletion_requested_at).getTime();
      if (ageMs < GRACE_MS) {
        setStatus('pendingDeletion');
        return;
      }
      // Grace window elapsed — treat as deleted; the backend purge job finishes cleanup.
      setNotice(S.auth.accountDeleted);
      await signOutUser();
      return;
    }

    setStatus(p?.selected_exam ? 'ready' : 'needsProfile');
    fillName(currentUser, p);
  }, [fillName]);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        checkIdRef.current++;
        setProfile(null);
        setStatus('signedOut');
        return;
      }
      checkProfile(currentUser);
    });
  }, [checkProfile]);

  const signIn = useCallback(async () => {
    setNotice(null);
    await signInWithGoogle(); // onAuthStateChanged takes it from here
  }, []);

  const signOut = useCallback(() => signOutUser(), []);

  const retryProfile = useCallback(() => {
    if (auth?.currentUser) checkProfile(auth.currentUser);
  }, [checkProfile]);

  // Welcome screen: POST /api/user/profile { selected_exam }. Throws on failure so the
  // screen can show an error (the app moves on even when the save fails).
  const saveExam = useCallback(async (selectedExam) => {
    const res = await api.post('/api/user/profile', { selected_exam: selectedExam });
    const next = { ...profile, ...(res.data?.data || {}), selected_exam: selectedExam };
    setProfile(next);
    setStatus('ready');
    if (auth?.currentUser) fillName(auth.currentUser, next); // row exists now
  }, [profile, fillName]);

  // Reactivate screen: POST /api/user/cancel-deletion, then into the app.
  const reactivate = useCallback(async () => {
    await api.post('/api/user/cancel-deletion');
    setProfile((prev) => ({ ...prev, status: 'active', deletion_requested_at: null }));
    setStatus(profile?.selected_exam ? 'ready' : 'needsProfile');
  }, [profile]);

  const value = {
    status, user, profile, notice,
    signIn, signOut, retryProfile, saveExam, reactivate,
    declineReactivate: signOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// oxlint-disable-next-line react/only-export-components
export const useAuth = () => useContext(AuthContext);
