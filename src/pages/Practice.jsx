import { useEffect, useState } from 'react';
import BiText from '../components/BiText';
import Spinner from '../components/Spinner';
import ProLock from '../components/ProLock';
import SubjectProgressRow from '../components/SubjectProgressRow';
import { useAuth } from '../auth/AuthContext';
import { api } from '../authInterceptor';
import { useProStatus } from '../proStatus';
import { S } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import './Quick5.css'; // shared loading / error styles
import './Progress.css'; // subject rows
import './Practice.css';

const SLOW_AFTER_MS = 5000;

// Subject-wise Practice — the app's SubjectSelectionScreen:
//   Pro check (GET /api/payment/status, as the app's Home does before opening it)
//   GET /api/progress/subjects?exam_type=<selected exam> → the Progress page's rows,
//   in the backend's order, each one a link that starts a 20-question practice.
const Practice = () => {
  const { profile } = useAuth();
  const exam = profile?.selected_exam || null;
  const pro = useProStatus();

  // { key, subjects } | { key, error: true }; key ties a result to the request that made it
  const [loadKey, setLoadKey] = useState(0);
  const [result, setResult] = useState(null);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    let alive = true;
    const slowTimer = setTimeout(() => { if (alive) setSlow(true); }, SLOW_AFTER_MS);
    api.get('/api/progress/subjects', { params: exam ? { exam_type: exam } : {} })
      .then((res) => {
        if (!alive) return;
        if (res.data?.success) setResult({ key: loadKey, subjects: res.data.data?.subjects || [] });
        else setResult({ key: loadKey, error: true });
      })
      .catch(() => { if (alive) setResult({ key: loadKey, error: true }); })
      .finally(() => { clearTimeout(slowTimer); if (alive) setSlow(false); });
    return () => { alive = false; clearTimeout(slowTimer); };
  }, [exam, loadKey]);

  const current = result?.key === loadKey ? result : null;

  if (pro.status === 'free') return <ProLock feature={S.features.subjectWise} />;

  if (pro.status === 'error') {
    return (
      <div className="q5-center">
        <span className="q5-state-icon" aria-hidden="true">⚠️</span>
        <BiText s={W.proFailed} center className="q5-error-text" />
        <button type="button" className="q5-btn q5-btn--primary" onClick={pro.retry}>{S.common.retry.ta}</button>
      </div>
    );
  }

  if (pro.status === 'loading' || !current) {
    return (
      <div className="q5-center">
        <Spinner />
        <BiText s={S.common.loading} center className="q5-loading-text" />
        {slow && <BiText s={W.slowWake} center className="q5-slow-text" />}
      </div>
    );
  }

  if (current.error) {
    return (
      <div className="page">
        <section className="card pg-error">
          <BiText s={S.subject.loadFailed} center className="pg-error-text" />
          <button type="button" className="pg-retry" onClick={() => setLoadKey((k) => k + 1)}>
            <BiText s={S.common.retry} inline onDark className="pg-retry-text" />
          </button>
        </section>
      </div>
    );
  }

  if (current.subjects.length === 0) {
    return (
      <div className="q5-center">
        <span className="q5-state-icon" aria-hidden="true">📭</span>
        <BiText s={S.subject.noSubjects} center className="q5-loading-text" />
      </div>
    );
  }

  return (
    <div className="page practice-page">
      <BiText as="h1" s={S.features.subjectWise} className="pr-title" />
      <BiText s={S.subject.tapHint} className="pr-hint" />
      <section className="card pg-subjects">
        <BiText s={S.subject.progressTitle} className="pg-card-title pg-subjects-title" />
        <ul className="pg-subject-list pr-subject-list">
          {current.subjects.map((s) => (
            <SubjectProgressRow key={s.subject} subject={s} to={`/practice/${encodeURIComponent(s.subject)}`} />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Practice;
