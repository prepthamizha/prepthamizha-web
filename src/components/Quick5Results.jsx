import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BiText from './BiText';
import { api } from '../authInterceptor';
import { S } from '../i18n/strings';
import './Quick5Results.css';

// Web version of the app's ResultsScreen for Today's Quick 5: title, Questions /
// Correct / Wrong, accuracy bar, performance message, streak card, Back to Home.
// Like the app, it calls POST /api/streak/update when shown (idempotent per IST day)
// and shows the stored streak from that, falling back to the streak the Quick 5
// response carried.
const performanceFor = (accuracy) => {
  if (accuracy >= 70) return { emoji: '🎉', message: S.results.great, kind: 'great' };
  if (accuracy >= 50) return { emoji: '👍', message: S.results.good, kind: 'good' };
  return { emoji: '📚', message: S.results.keepGoing, kind: 'low' };
};

const Quick5Results = ({ score, total, streak: initialStreak, daily }) => {
  const [streakCount, setStreakCount] = useState(initialStreak?.current_streak ?? null);
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const perf = performanceFor(accuracy);

  useEffect(() => {
    let alive = true;
    api.post('/api/streak/update', {})
      .then((res) => {
        const current = res.data?.data?.current_streak;
        if (alive && typeof current === 'number') setStreakCount(current);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <div className="q5r">
      <header className="q5r-header">
        <span className="q5r-icon" aria-hidden="true">🏆</span>
        <BiText as="h1" s={daily ? S.features.quick5 : S.results.practiceComplete} center className="q5r-title" />
      </header>

      <div className="q5r-stats">
        <div className="q5r-stat q5r-stat--total">
          <span className="q5r-stat-value">{total}</span>
          <BiText s={S.common.questions} center className="q5r-stat-label" />
        </div>
        <div className="q5r-stat q5r-stat--correct">
          <span className="q5r-stat-value">{score}</span>
          <BiText s={S.common.correct} center className="q5r-stat-label" />
        </div>
        <div className="q5r-stat q5r-stat--wrong">
          <span className="q5r-stat-value">{total - score}</span>
          <BiText s={S.common.wrong} center className="q5r-stat-label" />
        </div>
      </div>

      <div className="q5r-accuracy">
        <div className="q5r-accuracy-row">
          <BiText s={S.common.accuracy} inline className="q5r-accuracy-label" />
          <span className={`q5r-accuracy-value q5r--${perf.kind}`}>{accuracy}%</span>
        </div>
        <div className="q5r-bar" role="progressbar" aria-valuenow={accuracy} aria-valuemin={0} aria-valuemax={100}>
          <div className={`q5r-bar-fill q5r-bg--${perf.kind}`} style={{ width: `${accuracy}%` }} />
        </div>
      </div>

      <div className={`q5r-performance q5r-perf--${perf.kind}`}>
        <span className="q5r-perf-emoji" aria-hidden="true">{perf.emoji}</span>
        <BiText s={perf.message} className={`q5r-perf-msg q5r--${perf.kind}`} />
      </div>

      {daily && (
        <div className="q5r-streak">
          {streakCount > 0 && <BiText s={S.home.streak(streakCount)} center className="q5r-streak-text" />}
          <BiText s={S.results.comeBack} center className="q5r-comeback" />
        </div>
      )}

      <Link to="/" className="q5r-home">
        <BiText s={S.common.backHome} center className="q5r-home-text" />
      </Link>
    </div>
  );
};

export default Quick5Results;
