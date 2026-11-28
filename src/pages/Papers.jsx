import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BiText from '../components/BiText';
import Spinner from '../components/Spinner';
import ProLock, { ProCheckFailed } from '../components/ProLock';
import { useAuth } from '../auth/AuthContext';
import { api } from '../authInterceptor';
import { useProStatus } from '../proStatus';
import { QUICK5_DEFAULT_EXAM } from '../quick5';
import { S } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import './Quick5.css'; // shared loading / error styles
import './Progress.css'; // card + list styles
import './Practice.css'; // tappable rows

const SLOW_AFTER_MS = 5000;

// Previous Year Papers — the app's PreviousYearScreen: GET /api/previous-year/years
// ?exam_type=<exam> → the years in the backend's order (newest first). The app shows
// them in a dropdown with the first one pre-selected; here each year is a row in the
// Practice page's list style, and the paper's question count and Start button are on
// the next page (/papers/:year), as in the app's summary line under the dropdown.
const Papers = () => {
  const { profile } = useAuth();
  const examType = profile?.selected_exam || QUICK5_DEFAULT_EXAM;
  const pro = useProStatus();

  const [loadKey, setLoadKey] = useState(0);
  const [result, setResult] = useState(null); // { key, years } | { key, error: true }
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    let alive = true;
    const slowTimer = setTimeout(() => { if (alive) setSlow(true); }, SLOW_AFTER_MS);
    api.get(`/api/previous-year/years?exam_type=${encodeURIComponent(examType)}`)
      .then((res) => {
        if (!alive) return;
        if (res.data?.success) setResult({ key: loadKey, years: (res.data.data || []).map((y) => String(y)) });
        else setResult({ key: loadKey, error: true });
      })
      .catch(() => { if (alive) setResult({ key: loadKey, error: true }); })
      .finally(() => { clearTimeout(slowTimer); if (alive) setSlow(false); });
    return () => { alive = false; clearTimeout(slowTimer); };
  }, [examType, loadKey]);

  const current = result?.key === loadKey ? result : null;

  if (pro.status === 'free') return <ProLock feature={S.features.previousYear} />;
  if (pro.status === 'error') return <ProCheckFailed onRetry={pro.retry} />;

  if (pro.status === 'loading' || !current) {
    return (
      <div className="q5-center">
        <Spinner />
        <BiText s={S.prevYear.loadingYears} center className="q5-loading-text" />
        {slow && <BiText s={W.slowWake} center className="q5-slow-text" />}
      </div>
    );
  }

  if (current.error) {
    return (
      <div className="page">
        <section className="card pg-error">
          <BiText s={W.yearsFailed} center className="pg-error-text" />
          <button type="button" className="pg-retry" onClick={() => setLoadKey((k) => k + 1)}>
            <BiText s={S.common.retry} inline onDark className="pg-retry-text" />
          </button>
        </section>
      </div>
    );
  }

  if (current.years.length === 0) {
    return (
      <div className="q5-center">
        <span className="q5-state-icon" aria-hidden="true">📭</span>
        <BiText s={W.noPapers} center className="q5-loading-text" />
      </div>
    );
  }

  return (
    <div className="page practice-page">
      <BiText as="h1" s={S.features.previousYear} className="pr-title" />
      <BiText s={W.papersHint} className="pr-hint" />
      <section className="card pg-subjects">
        <BiText s={S.prevYear.selectYear} className="pg-card-title pg-subjects-title" />
        <ul className="pg-subject-list pr-subject-list">
          {current.years.map((y) => {
            const title = W.paperYear(y);
            return (
              <li key={y} className="sp-row">
                <Link to={`/papers/${encodeURIComponent(y)}`} className="sp-link">
                  <div className="sp-top pr-year-top">
                    <div className="sp-names">
                      <span className="sp-name-ta" lang="ta">{title.ta}</span>
                      <span className="sp-name-en" lang="en">{title.en} · {examType}</span>
                    </div>
                    <span className="sp-chevron" aria-hidden="true">›</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default Papers;
