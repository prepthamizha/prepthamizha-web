// Pro status — the same check the app uses: GET /api/payment/status → { is_pro }.
// The backend answers is_pro:true for an active user_purchases row and, until
// FREE_PRO_UNTIL (15 Dec 2026), for everyone (plan 'free_pro').
//
// One request is shared by Home and the Practice pages and kept for a few minutes,
// per signed-in user. Unlike the app (which treats a failed check as "not Pro"),
// a failed request is reported as 'error' so the page can offer Retry instead of
// wrongly showing the Pro lock.
import { useCallback, useEffect, useState } from 'react';
import { api } from './authInterceptor';
import { useAuth } from './auth/AuthContext';

const CACHE_MS = 5 * 60 * 1000;
let cache = null; // { uid, at, promise }

const fetchProStatus = (uid, force = false) => {
  if (!force && cache && cache.uid === uid && Date.now() - cache.at < CACHE_MS) return cache.promise;
  const promise = api.get('/api/payment/status').then((res) => res.data?.is_pro === true);
  cache = { uid, at: Date.now(), promise };
  promise.catch(() => { if (cache?.promise === promise) cache = null; });
  return promise;
};

// status: 'loading' | 'pro' | 'free' | 'error'
export const useProStatus = () => {
  const { user } = useAuth();
  const uid = user?.uid || null;
  const [state, setState] = useState({ uid: null, key: 0, status: 'loading' });
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!uid) return undefined;
    let alive = true;
    fetchProStatus(uid, key > 0)
      .then((isPro) => { if (alive) setState({ uid, key, status: isPro ? 'pro' : 'free' }); })
      .catch(() => { if (alive) setState({ uid, key, status: 'error' }); });
    return () => { alive = false; };
  }, [uid, key]);

  const retry = useCallback(() => setKey((k) => k + 1), []);
  const status = state.uid === uid && state.key === key ? state.status : 'loading';
  return { status, retry };
};
