import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BiText from '../components/BiText';
import Spinner from '../components/Spinner';
import QuestionBody, { PracticeFooter } from '../components/QuestionBody';
import { isCorrectOption } from '../grading';
import Quick5Results from '../components/Quick5Results';
import { useAuth } from '../auth/AuthContext';
import { api } from '../authInterceptor';
import { fetchQuick5Today, completeQuick5, QUICK5_DEFAULT_EXAM } from '../quick5';
import { S, biAlert, btn } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import './Quick5.css';

// Render's free tier can take ~30–60 s to wake; after this long the loader says so.
const SLOW_AFTER_MS = 5000;

// Subject chip text, same order as the app's subjectName() (Tamil first).
const subjectName = (q) => q?.syllabus_display_name_ta || q?.syllabus_display_name || q?.subject || '';

// Today's Quick 5 — the app's QuestionScreen Quick 5 path:
//   GET /api/quick5/today → already completed today → straight to that result
//                         → otherwise the 5 questions, one at a time
//   each answer → POST /api/attempts (fire-and-forget, counts for Progress)
//   last Next → POST /api/quick5/complete (server scores) → results
//   404 from /today (QUICK5_ENABLED off) → old random Quick 5 (/api/questions/random/5)
const Quick5 = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const examType = profile?.selected_exam || QUICK5_DEFAULT_EXAM;

  // phase: 'loading' | 'error' | 'empty' | 'quiz' | 'results'
  const [phase, setPhase] = useState('loading');
  const [slow, setSlow] = useState(false);
  const [loadKey, setLoadKey] = useState(0); // bump to retry

  const [questions, setQuestions] = useState([]);
  const [isDaily, setIsDaily] = useState(false);
  const [quizDate, setQuizDate] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredOption, setAnsweredOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [dailyAnswers, setDailyAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { score, total, streak, daily }

  useEffect(() => {
    let alive = true;
    const slowTimer = setTimeout(() => { if (alive) setSlow(true); }, SLOW_AFTER_MS);

    (async () => {
      try {
        const today = await fetchQuick5Today(examType);
        if (!alive) return;
        if (!today.enabled) {
          // Backend switch off → the app's old random Quick 5 (not saved, no daily result).
          const res = await api.get(`/api/questions/random/5?exam_type=${encodeURIComponent(examType)}`);
          if (!alive) return;
          const qs = res.data?.success ? res.data.data || [] : [];
          setQuestions(qs);
          setIsDaily(false);
          setPhase(qs.length ? 'quiz' : 'empty');
          return;
        }
        if (today.completed && today.my_result) {
          setResult({
            score: today.my_result.score,
            total: today.my_result.total,
            streak: today.streak || null,
            daily: true,
          });
          setPhase('results');
          return;
        }
        const qs = today.questions || [];
        setQuizDate(today.quiz_date);
        setIsDaily(true);
        setQuestions(qs);
        setPhase(qs.length ? 'quiz' : 'empty');
      } catch {
        if (alive) setPhase('error');
      } finally {
        clearTimeout(slowTimer);
      }
    })();

    return () => { alive = false; clearTimeout(slowTimer); };
  }, [examType, loadKey]);

  const handleOptionPress = (option) => {
    if (isAnswered) return;
    const q = questions[currentIndex];
    const isCorrect = isCorrectOption(q, option);
    setAnsweredOption(option);
    setIsAnswered(true);
    if (isCorrect) setScore((s) => s + 1);
    setTotalAttempted((t) => t + 1);
    if (isDaily) setDailyAnswers((prev) => ({ ...prev, [q.id]: option.toLowerCase() }));
    // Same as the app: record the attempt for Progress, never block on it.
    api.post('/api/attempts', {
      question_id: q.id, exam_type: examType, subject: q.subject, is_correct: isCorrect,
    }).catch(() => {});
    // Bring the explanation into view on small screens.
    requestAnimationFrame(() => {
      document.querySelector('.qb-explanation, .qb-footer')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setAnsweredOption(null);
      setIsAnswered(false);
      window.scrollTo({ top: 0 });
      return;
    }
    if (isDaily) {
      if (submitting) return;
      setSubmitting(true);
      let finalScore = score;
      let finalTotal = totalAttempted;
      let streak = null;
      try {
        const res = await completeQuick5({ quizDate, examType, answers: dailyAnswers });
        if (res?.my_result) {
          finalScore = res.my_result.score;
          finalTotal = res.my_result.total;
        }
        streak = res?.streak || null;
      } catch {
        // Not saved — like the app, the result still shows (streak update still runs).
      }
      setSubmitting(false);
      setResult({ score: finalScore, total: finalTotal, streak, daily: true });
    } else {
      setResult({ score, total: totalAttempted, streak: null, daily: false });
    }
    setPhase('results');
    window.scrollTo({ top: 0 });
  };

  const retry = () => {
    setPhase('loading');
    setSlow(false);
    setLoadKey((k) => k + 1);
  };

  const handleExit = useCallback(() => {
    biAlert(S.common.exitPractice, S.question.progressLost, [
      btn(S.common.cancel, { style: 'cancel' }),
      btn(S.common.exitWord, { style: 'destructive', onPress: () => navigate('/') }),
    ]);
  }, [navigate]);

  if (phase === 'loading') {
    return (
      <div className="q5-center">
        <Spinner />
        <BiText s={S.common.loadingQuestions} center className="q5-loading-text" />
        {slow && <BiText s={W.slowWake} center className="q5-slow-text" />}
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="q5-center">
        <span className="q5-state-icon" aria-hidden="true">⚠️</span>
        <BiText s={S.common.loadQuestionsFailed} center className="q5-error-text" />
        <button type="button" className="q5-btn q5-btn--primary" onClick={retry}>
          {S.common.retry.ta}
        </button>
        <button type="button" className="q5-btn q5-btn--secondary" onClick={() => navigate('/')}>
          {S.common.backHome.ta}
        </button>
      </div>
    );
  }

  if (phase === 'empty') {
    return (
      <div className="q5-center">
        <BiText s={S.common.noQuestions} center className="q5-error-text" />
        <button type="button" className="q5-btn q5-btn--secondary" onClick={() => navigate('/')}>
          {S.common.goBack.ta}
        </button>
      </div>
    );
  }

  if (phase === 'results' && result) {
    return (
      <div className="page q5-page">
        <Quick5Results {...result} />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const nextLabel = currentIndex < questions.length - 1
    ? S.common.next
    : submitting ? S.common.saving : S.common.seeResults;

  return (
    <div className="page q5-page">
      <div className="q5-scorebar">
        <div className="q5-scorebar-row">
          <div className="q5-score-item">
            <span className="q5-score-value" aria-label={`${currentIndex + 1} of ${questions.length}`}>
              {currentIndex + 1}/{questions.length}
            </span>
            <BiText s={S.common.question} center className="q5-score-label" />
          </div>
          <span className="q5-score-divider" aria-hidden="true" />
          <div className="q5-score-item">
            <span className="q5-score-value q5-score-value--correct">{score}</span>
            <BiText s={S.common.correct} center className="q5-score-label" />
          </div>
          <span className="q5-score-divider" aria-hidden="true" />
          <div className="q5-score-item">
            <span className="q5-score-value q5-score-value--wrong">{totalAttempted - score}</span>
            <BiText s={S.common.wrong} center className="q5-score-label" />
          </div>
        </div>
        <div className="q5-progress" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={questions.length}>
          <div className="q5-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {subjectName(currentQuestion) && (
        <div className="q5-badge-row">
          <span className="q5-badge">{subjectName(currentQuestion)}</span>
        </div>
      )}

      <QuestionBody
        key={currentQuestion.id ?? currentIndex}
        question={currentQuestion}
        answeredOption={answeredOption}
        isAnswered={isAnswered}
        onSelect={handleOptionPress}
      />

      <PracticeFooter
        onExit={handleExit}
        onNext={handleNext}
        showNext={isAnswered}
        disabled={submitting}
        nextLabel={nextLabel}
      />
    </div>
  );
};

export default Quick5;
