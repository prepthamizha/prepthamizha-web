import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BiText from '../components/BiText';
import Spinner from '../components/Spinner';
import ProLock, { ProCheckFailed } from '../components/ProLock';
import QuestionBody, { PracticeFooter } from '../components/QuestionBody';
import Quick5Results from '../components/Quick5Results';
import { isCorrectOption } from '../grading';
import { useAuth } from '../auth/AuthContext';
import { api } from '../authInterceptor';
import { useProStatus } from '../proStatus';
import { QUICK5_DEFAULT_EXAM } from '../quick5';
import { S, biAlert, btn } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import './Quick5.css';
import './Practice.css';

const SLOW_AFTER_MS = 5000;

// One previous-year paper — the app's PreviousYearScreen summary + Start, then
// PreviousYearQuestionScreen:
//   GET /api/previous-year/questions?exam_type=<exam>&exam_year=<year>&count=1000
//   → the whole paper in question_number order (backend order; no shuffle). Part A
//     and Part B are not split — one run through all parts, as in the app
//     ("N questions · All parts").
//   pick an option → "Submit Answer" grades it → POST /api/attempts with
//     subject = subject_tag (same body as the app) → Next Question / View Results
//   → results (Practice complete) with Back to Papers and Back to Home.
// Not saved or resumed in this step (the app saves after each Next).
const PaperSession = () => {
  const navigate = useNavigate();
  const { year } = useParams();
  const { profile } = useAuth();
  const examType = profile?.selected_exam || QUICK5_DEFAULT_EXAM;
  const pro = useProStatus();
  const isPro = pro.status === 'pro';

  // phase: 'loading' | 'error' | 'empty' | 'ready' | 'quiz' | 'results'
  const [phase, setPhase] = useState('loading');
  const [slow, setSlow] = useState(false);
  const [loadKey, setLoadKey] = useState(0);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);

  useEffect(() => {
    if (!isPro) return undefined;
    let alive = true;
    const slowTimer = setTimeout(() => { if (alive) setSlow(true); }, SLOW_AFTER_MS);
    api.get(`/api/previous-year/questions?exam_type=${encodeURIComponent(examType)}`
      + `&exam_year=${encodeURIComponent(year)}&count=1000`)
      .then((res) => {
        if (!alive) return;
        if (!res.data?.success) { setPhase('error'); return; }
        const qs = res.data.data || [];
        setQuestions(qs);
        setPhase(qs.length ? 'ready' : 'empty');
      })
      .catch(() => { if (alive) setPhase('error'); })
      .finally(() => { clearTimeout(slowTimer); if (alive) setSlow(false); });
    return () => { alive = false; clearTimeout(slowTimer); };
  }, [isPro, examType, year, loadKey]);

  const start = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setTotalAttempted(0);
    setPhase('quiz');
    window.scrollTo({ top: 0 });
  };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    const q = questions[currentIndex];
    const isCorrect = isCorrectOption(q, selectedOption);
    setIsAnswered(true);
    if (isCorrect) setScore((s) => s + 1);
    setTotalAttempted((t) => t + 1);
    // Same body as the app's PreviousYearQuestionScreen (subject = subject_tag).
    api.post('/api/attempts', {
      question_id: q.id, exam_type: examType, subject: q.subject_tag, is_correct: isCorrect,
    }).catch(() => {});
    requestAnimationFrame(() => {
      document.querySelector('.qb-explanation, .qb-footer')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setPhase('results');
    }
    window.scrollTo({ top: 0 });
  };

  const retry = () => {
    setPhase('loading');
    setSlow(false);
    setLoadKey((k) => k + 1);
  };

  // Not saved on the web yet → "progress will be lost" (the app says "session saved").
  const handleExit = useCallback(() => {
    biAlert(S.common.exitPractice, S.question.progressLost, [
      btn(S.common.cancel, { style: 'cancel' }),
      btn(S.common.exitWord, { style: 'destructive', onPress: () => navigate('/') }),
    ]);
  }, [navigate]);

  if (pro.status === 'free') return <ProLock feature={S.features.previousYear} />;
  if (pro.status === 'error') return <ProCheckFailed onRetry={pro.retry} />;

  if (pro.status === 'loading' || phase === 'loading') {
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
        <button type="button" className="q5-btn q5-btn--primary" onClick={retry}>{S.common.retry.ta}</button>
        <Link to="/papers" className="q5-btn q5-btn--secondary pr-btn-link">{S.common.goBack.ta}</Link>
      </div>
    );
  }

  if (phase === 'empty') {
    return (
      <div className="q5-center">
        <BiText s={S.common.noQuestions} center className="q5-error-text" />
        <Link to="/papers" className="q5-btn q5-btn--secondary pr-btn-link">{S.common.goBack.ta}</Link>
      </div>
    );
  }

  if (phase === 'ready') {
    return (
      <div className="page practice-page">
        <BiText as="h1" s={W.paperYear(year)} className="pr-title" />
        <section className="card pp-start-card">
          <BiText s={S.prevYear.paperSummary(questions.length)} center className="pp-summary" />
          <button type="button" className="pp-start" onClick={start}>
            <BiText s={S.prevYear.startPaper(year)} center onDark className="pp-start-text" />
          </button>
        </section>
      </div>
    );
  }

  if (phase === 'results') {
    return (
      <div className="page q5-page">
        <Quick5Results
          score={score}
          total={totalAttempted}
          streak={null}
          daily={false}
          practiceAgainTo="/papers"
          practiceAgainLabel={W.backToPapers}
        />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const last = currentIndex >= questions.length - 1;

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
            <span className="q5-score-value pp-score-value--year">{year}</span>
            <BiText s={S.common.year} center className="q5-score-label" />
          </div>
        </div>
        <div className="q5-progress" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={questions.length}>
          <div className="q5-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="q5-badge-row pp-badges">
        {currentQuestion.subject_tag && <span className="q5-badge">{currentQuestion.subject_tag}</span>}
        {currentQuestion.language && <span className="q5-badge pp-lang">{currentQuestion.language}</span>}
        <BiText s={S.prevYear.pctDone(Math.round(progress))} inline className="pp-pct" />
      </div>

      <QuestionBody
        key={currentQuestion.id ?? currentIndex}
        question={currentQuestion}
        number={currentQuestion.question_number}
        selectedOption={isAnswered ? null : selectedOption}
        answeredOption={isAnswered ? selectedOption : null}
        isAnswered={isAnswered}
        onSelect={setSelectedOption}
      />

      <PracticeFooter
        onExit={handleExit}
        onNext={isAnswered ? handleNext : handleSubmit}
        showNext
        disabled={!isAnswered && selectedOption === null}
        nextLabel={!isAnswered ? S.common.submitAnswer : last ? S.common.viewResults : S.common.nextQuestion}
      />
    </div>
  );
};

export default PaperSession;
