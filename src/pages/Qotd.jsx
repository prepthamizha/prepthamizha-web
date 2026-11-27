import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BiText from '../components/BiText';
import Spinner from '../components/Spinner';
import QuestionBody, { PracticeFooter } from '../components/QuestionBody';
import { useAuth } from '../auth/AuthContext';
import { api } from '../authInterceptor';
import { S } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import './Quick5.css'; // shared loading / error / retry styles
import './Qotd.css';

const SLOW_AFTER_MS = 5000;

// Today's date in India (Asia/Kolkata) as YYYY-MM-DD, whatever the device timezone.
const IST_DATE = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
});
const istToday = () => IST_DATE.format(new Date());

// One cached question per user per India day: { date, question, selected }.
const KEY_PREFIX = 'qotd:';
const cacheKey = (uid, date) => `${KEY_PREFIX}${uid}:${date}`;

const readCache = (uid, date) => {
  try {
    const raw = localStorage.getItem(cacheKey(uid, date));
    const saved = raw ? JSON.parse(raw) : null;
    return saved?.date === date && saved.question ? saved : null;
  } catch {
    return null; // storage blocked / bad JSON → just fetch
  }
};

const writeCache = (uid, date, value) => {
  try {
    // Drop this user's older days so storage doesn't grow.
    const mine = `${KEY_PREFIX}${uid}:`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k?.startsWith(mine) && k !== cacheKey(uid, date)) localStorage.removeItem(k);
    }
    localStorage.setItem(cacheKey(uid, date), JSON.stringify({ date, ...value }));
  } catch {
    // storage full / blocked — the question still works for this visit
  }
};

// Date chip like the app's: Tamil and English long dates (India time).
const dateLabel = () => {
  const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' };
  const now = new Date();
  return { ta: now.toLocaleDateString('ta-IN', opts), en: now.toLocaleDateString('en-IN', opts) };
};

// Question of the Day — the app's QuestionOfTheDayScreen: one random question from
// GET /api/questions/random/1?exam_type=…, kept for the day, answered with the shared
// QuestionBody. The app does not record QOTD attempts (no /api/attempts), so neither
// does the web.
const Qotd = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const uid = user?.uid;
  const selectedExam = profile?.selected_exam;

  // phase: 'loading' | 'error' | 'empty' | 'ready'
  const [phase, setPhase] = useState('loading');
  const [slow, setSlow] = useState(false);
  const [loadKey, setLoadKey] = useState(0);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState(istToday);

  useEffect(() => {
    if (!uid) return undefined;
    let alive = true;
    const today = istToday();
    const cached = readCache(uid, today);
    if (cached) {
      // Cache hit: render straight from storage, no network.
      Promise.resolve().then(() => {
        if (!alive) return;
        setDate(today);
        setQuestion(cached.question);
        setSelected(cached.selected || null);
        setPhase('ready');
      });
      return () => { alive = false; };
    }

    const slowTimer = setTimeout(() => { if (alive) setSlow(true); }, SLOW_AFTER_MS);
    const examParam = selectedExam ? `?exam_type=${encodeURIComponent(selectedExam)}` : '';
    api.get(`/api/questions/random/1${examParam}`)
      .then((res) => {
        if (!alive) return;
        const q = res.data?.data?.[0] || null;
        setDate(today);
        setQuestion(q);
        setSelected(null);
        if (q) {
          writeCache(uid, today, { question: q, selected: null });
          setPhase('ready');
        } else {
          setPhase('empty');
        }
      })
      .catch(() => { if (alive) setPhase('error'); })
      .finally(() => clearTimeout(slowTimer));

    return () => { alive = false; clearTimeout(slowTimer); };
  }, [uid, selectedExam, loadKey]);

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    writeCache(uid, date, { question, selected: opt }); // answered state survives reload
    requestAnimationFrame(() => {
      document.querySelector('.qb-explanation, .qb-footer')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const retry = () => {
    setPhase('loading');
    setSlow(false);
    setLoadKey((k) => k + 1);
  };

  if (phase === 'loading') {
    return (
      <div className="q5-center">
        <Spinner gold />
        <BiText s={S.qotd.loading} center className="q5-loading-text" />
        {slow && <BiText s={W.slowWake} center className="q5-slow-text" />}
      </div>
    );
  }

  if (phase === 'error' || phase === 'empty') {
    return (
      <div className="q5-center">
        <span className="q5-state-icon" aria-hidden="true">😕</span>
        <BiText s={phase === 'error' ? S.qotd.failed : S.common.noQuestions} center className="qotd-error-text" />
        <button type="button" className="q5-btn q5-btn--primary" onClick={retry}>{S.common.retry.ta}</button>
        <button type="button" className="q5-btn q5-btn--secondary" onClick={() => navigate('/')}>
          {S.common.backHome.ta}
        </button>
      </div>
    );
  }

  return (
    <div className="page qotd-page">
      <div className="qotd-date">
        <BiText s={dateLabel()} className="qotd-date-text" />
      </div>

      <QuestionBody
        question={question}
        answeredOption={selected}
        isAnswered={!!selected}
        onSelect={handleAnswer}
      />

      {!selected && <BiText s={S.qotd.tap} center className="qotd-hint" />}

      {/* App: Exit only (goes back), no Next. */}
      <PracticeFooter onExit={() => navigate('/')} showNext={false} />
    </div>
  );
};

export default Qotd;
