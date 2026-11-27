import { useCallback, useEffect, useRef, useState } from 'react';
import BiText from '../components/BiText';
import Spinner from '../components/Spinner';
import { useAuth } from '../auth/AuthContext';
import { api } from '../authInterceptor';
import { S } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import './Quick5.css'; // shared loading / error styles
import './Leaderboard.css';

const SLOW_AFTER_MS = 5000;

// Same as the app's getRankDisplay().
const rankDisplay = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

// One row: rank (medal for 1–3), name (+ "You" badge), Attempted, Accuracy
// (green at 70%+). The backend already sends 'Learner' for an empty name; the
// fallback here only guards an empty value.
const Row = ({ entry, isMe }) => (
  <li className={`lb-row${isMe ? ' lb-row--me' : ''}`}>
    <span className={`lb-rank${entry.rank <= 3 ? ' lb-rank--medal' : ''}`}>{rankDisplay(entry.rank)}</span>
    <span className="lb-name-col">
      <span className="lb-name">{entry.display_name || 'Learner'}</span>
      {isMe && <BiText s={S.leaderboard.you} inline className="lb-you" />}
    </span>
    <span className="lb-attempted">{entry.total_attempted}</span>
    <span className={`lb-accuracy${entry.accuracy >= 70 ? ' lb-accuracy--good' : ''}`}>{entry.accuracy}%</span>
  </li>
);

// Leaderboard — the app's LeaderboardScreen: GET /api/leaderboard?exam_type=<exam>
// → top 50 (data) + my_rank. Like the app, the whole screen uses the English-only
// S.leaderboard strings.
const Leaderboard = () => {
  const { profile } = useAuth();
  const exam = profile?.selected_exam || null;

  // phase: 'loading' | 'error' | 'ready'
  const [phase, setPhase] = useState('loading');
  const [slow, setSlow] = useState(false);
  const [rows, setRows] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const aliveRef = useRef(true);

  const load = useCallback(() => {
    const slowTimer = setTimeout(() => { if (aliveRef.current) setSlow(true); }, SLOW_AFTER_MS);
    api.get('/api/leaderboard', { params: exam ? { exam_type: exam } : {} })
      .then((res) => {
        if (!aliveRef.current) return;
        setRows(res.data?.data || []);
        setMyRank(res.data?.my_rank || null);
        setPhase('ready');
      })
      .catch(() => { if (aliveRef.current) setPhase('error'); })
      .finally(() => { clearTimeout(slowTimer); if (aliveRef.current) setSlow(false); });
  }, [exam]);

  useEffect(() => {
    aliveRef.current = true;
    load();
    return () => { aliveRef.current = false; };
  }, [load]);

  const retry = () => {
    setPhase('loading');
    load();
  };

  if (phase === 'loading') {
    return (
      <div className="q5-center">
        <Spinner />
        <BiText s={S.common.loading} center className="q5-loading-text" />
        {slow && <BiText s={W.slowWake} center className="q5-slow-text" />}
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="q5-center">
        <span className="q5-state-icon" aria-hidden="true">⚠️</span>
        <BiText s={W.leaderboardFailed} center className="q5-error-text" />
        <button type="button" className="q5-btn q5-btn--primary" onClick={retry}>{S.common.retry.ta}</button>
      </div>
    );
  }

  const meInTop = rows.some((e) => e.is_me);

  return (
    <div className="page lb-page">
      <section className="lb-info">
        <BiText s={S.leaderboard.title} as="h1" onDark className="lb-info-title" />
        <BiText s={S.leaderboard.rankedBy(exam || 'TNPSC')} onDark className="lb-info-sub" />
      </section>

      {rows.length === 0 ? (
        <div className="lb-empty">
          <span className="lb-empty-icon" aria-hidden="true">📊</span>
          <BiText s={S.leaderboard.noData} center className="lb-empty-title" />
          <BiText s={S.leaderboard.startPractising} center className="lb-empty-sub" />
        </div>
      ) : (
        <div className="lb-table">
          <div className="lb-head" aria-hidden="true">
            <BiText s={S.leaderboard.rank} className="lb-rank lb-head-text" />
            <BiText s={S.leaderboard.name} className="lb-name-col lb-head-text" />
            <BiText s={S.leaderboard.attempted} className="lb-attempted lb-head-text" />
            <BiText s={S.leaderboard.accuracy} className="lb-accuracy lb-head-text" />
          </div>
          <ol className="lb-list">
            {rows.map((e, i) => <Row key={`${e.rank}-${i}`} entry={e} isMe={e.is_me} />)}
          </ol>

          {myRank && !meInTop && (
            <>
              <div className="lb-divider">
                <BiText s={S.leaderboard.yourPosition} inline className="lb-divider-text" />
              </div>
              <ol className="lb-list">
                <Row entry={myRank} isMe />
              </ol>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
