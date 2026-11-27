import { useCallback, useEffect, useRef, useState } from 'react';
import BiText from '../components/BiText';
import Spinner from '../components/Spinner';
import SubjectProgressRow from '../components/SubjectProgressRow';
import { useAuth } from '../auth/AuthContext';
import { api } from '../authInterceptor';
import { S } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import { subjectNames, barPct, daysTa, daysEn } from '../progressHelpers';
import './Quick5.css'; // shared loading styles
import './Progress.css';

const SLOW_AFTER_MS = 5000;
const EMPTY_STREAK = { current_streak: 0, longest_streak: 0, total_practice_days: 0 };

// Progress — the app's ProgressScreen, in the same order:
//   overall card (attempted / pool, accuracy, bar) → tagline → streak card →
//   weakest subject (info only) → subject-wise rows (backend order) → Refresh.
// GET /api/progress/subjects?exam_type=<selected exam> and GET /api/streak, in parallel.
// Full-screen loader only on the first load; Refresh keeps the numbers on screen.
const Progress = () => {
  const { profile } = useAuth();
  const exam = profile?.selected_exam || null;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [slow, setSlow] = useState(false);
  const [progress, setProgress] = useState(null); // null until the first good load
  const [progressError, setProgressError] = useState(false);
  const [streak, setStreak] = useState(EMPTY_STREAK);
  const aliveRef = useRef(true);

  const applyResults = useCallback(([progressRes, streakRes]) => {
    if (progressRes.status === 'fulfilled' && progressRes.value.data?.success) {
      setProgress(progressRes.value.data.data);
      setProgressError(false);
    } else {
      setProgressError(true);
    }
    if (streakRes.status === 'fulfilled' && streakRes.value.data?.success) {
      setStreak(streakRes.value.data.data || EMPTY_STREAK);
    }
    setSlow(false);
    setLoading(false);
    setRefreshing(false);
  }, []);

  // Starts both requests; state is only touched in the timer / promise callbacks.
  const fetchAll = useCallback(() => {
    const slowTimer = setTimeout(() => { if (aliveRef.current) setSlow(true); }, SLOW_AFTER_MS);
    Promise.allSettled([
      api.get('/api/progress/subjects', { params: exam ? { exam_type: exam } : {} }),
      api.get('/api/streak'),
    ]).then((results) => {
      clearTimeout(slowTimer);
      if (aliveRef.current) applyResults(results);
    });
  }, [exam, applyResults]);

  useEffect(() => {
    aliveRef.current = true;
    fetchAll();
    return () => { aliveRef.current = false; };
  }, [fetchAll]);

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    if (!progress) setLoading(true); // nothing on screen yet → show the loader again
    fetchAll();
  };

  if (loading) {
    return (
      <div className="q5-center">
        <Spinner />
        <BiText s={S.progress.loading} center className="q5-loading-text" />
        {slow && <BiText s={W.slowWake} center className="q5-slow-text" />}
      </div>
    );
  }

  const overall = progress?.overall;
  const subjects = progress?.subjects || [];
  const weakest = progress?.weakest_subject || null;
  const weakestNames = subjectNames(weakest);

  return (
    <div className="page progress-page">
      {progressError && !progress ? (
        <section className="card pg-error">
          <BiText s={S.subject.loadFailed} center className="pg-error-text" />
          <button type="button" className="pg-retry" onClick={refresh} disabled={refreshing}>
            {refreshing ? <Spinner light small /> : <BiText s={S.common.retry} inline onDark className="pg-retry-text" />}
          </button>
        </section>
      ) : progress ? (
        <section className="pg-overall" aria-label={S.common.progress.en}>
          <div className="pg-overall-row">
            <div className="pg-overall-left">
              <span className="pg-overall-num">📊 {overall?.unique_attempted ?? 0} / {overall?.pool_total ?? 0}</span>
              <BiText s={S.common.questions} inline onDark className="pg-overall-label" />
            </div>
            <div className="pg-overall-right">
              <span className="pg-overall-acc">{overall?.accuracy != null ? `${overall.accuracy}%` : '—'}</span>
              <BiText s={S.common.correct} inline onDark className="pg-overall-label" />
            </div>
          </div>
          <div className="pg-overall-bar">
            <div className="pg-overall-fill" style={{ width: `${barPct(overall?.unique_attempted, overall?.pool_total)}%` }} />
          </div>
        </section>
      ) : null}

      <BiText s={S.progress.tagline} className="pg-tagline" />

      <div className="pg-cards">
        <section className="card pg-streak">
          <BiText s={S.progress.streakTitle} className="pg-card-title" />
          <BiText
            s={S.progress.currentBest(
              daysTa(streak.current_streak), daysTa(streak.longest_streak),
              daysEn(streak.current_streak), daysEn(streak.longest_streak))}
            className="pg-streak-line"
          />
          <BiText s={S.progress.totalDays(streak.total_practice_days ?? 0)} inline className="pg-streak-line" />
        </section>

        {progress && weakest && (
          <section className="card pg-weak">
            <span className="pg-weak-text" lang="ta">
              {S.progress.weakest.ta}: {weakestNames.ta} — {weakest.accuracy}%
            </span>
            <span className="pg-weak-en" lang="en">
              {S.progress.weakest.en}{weakestNames.en ? `: ${weakestNames.en}` : ''}
            </span>
          </section>
        )}
      </div>

      {progress && subjects.length > 0 && (
        <section className="card pg-subjects">
          <BiText s={S.subject.progressTitle} className="pg-card-title pg-subjects-title" />
          <ul className="pg-subject-list">
            {subjects.map((s) => <SubjectProgressRow key={s.subject} subject={s} />)}
          </ul>
        </section>
      )}

      <button type="button" className="pg-refresh" onClick={refresh} disabled={refreshing}>
        {refreshing ? <Spinner small /> : <BiText s={S.progress.refresh} inline className="pg-refresh-text" />}
      </button>
    </div>
  );
};

export default Progress;
