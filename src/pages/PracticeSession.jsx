import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BiText from '../components/BiText';
import Spinner from '../components/Spinner';
import ProLock from '../components/ProLock';
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

const SLOW_AFTER_MS = 5000;
// Same as the app's SubjectSelectionScreen DEFAULT_COUNT.
const SESSION_SIZE = 20;

const subjectName = (q) => q?.syllabus_display_name_ta || q?.syllabus_display_name || q?.subject || '';

// One subject-wise practice session — the app's QuestionScreen in 'nosave' mode:
//   GET /api/questions/random/20?exam_type=<exam>&subject=<subject>
//   each answer → POST /api/attempts (fire-and-forget, counts for Progress)
//   last Next → results (Practice complete; POST /api/streak/update runs there)
// Never saved or resumed, like the app. Pro-gated here too, so a typed URL can't skip it.
const PracticeSession = () => {
  const navigate = useNavigate();
  const { subject } = useParams();
  const { profile } = useAuth();
  const examType = profile?.selected_exam || QUICK5_DEFAULT_EXAM;
  const pro = useProStatus();

  // phase: 'loading' | 'error' | 'empty' | 'quiz' | 'results'
  const [phase, setPhase] = useState('loading');
  const [slow, setSlow] = useState(false);
  const [loadKey, setLoadKey] = useState(0);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredOption, setAnsweredOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);

  const isPro = pro.status === 'pro';

  useEffect(() => {
    if (!isPro) return undefined;
    let alive = true;
    const slowTimer = setTimeout(() => { if (alive) setSlow(true); }, SLOW_AFTER_MS);
    const url = `/api/questions/random/${SESSION_SIZE}?exam_type=${encodeURIComponent(examType)}`
      + `&subject=${encodeURIComponent(subject)}`;
    api.get(url)
      .then((res) => {
        if (!alive) return;
        const qs = res.data?.success ? res.data.data || [] : [];
        setQuestions(qs);
        setCurrentIndex(0);
        setAnsweredOption(null);
        setIsAnswered(false);
        setScore(0);
        setTotalAttempted(0);
        setPhase(qs.length ? 'quiz' : 'empty');
      })
      .catch(() => { if (alive) setPhase('error'); })
      .finally(() => clearTimeout(slowTimer));
    return () => { alive = false; clearTimeout(slowTimer); };
  }, [isPro, examType, subject, loadKey]);

  const handleOptionPress = (option) => {
    if (isAnswered) return;
    const q = questions[currentIndex];
    const isCorrect = isCorrectOption(q, option);
    setAnsweredOption(option);
    setIsAnswered(true);
    if (isCorrect) setScore((s) => s + 1);
    setTotalAttempted((t) => t + 1);
    // Same as the app: record the attempt for Progress, never block on it.
    api.post('/api/attempts', {
      question_id: q.id, exam_type: examType, subject: q.subject, is_correct: isCorrect,
    }).catch(() => {});
    requestAnimationFrame(() => {
      document.querySelector('.qb-explanation, .qb-footer')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setAnsweredOption(null);
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

  // Not saved (app: 'nosave' mode) → "progress will be lost" → Home, like the app.
  const handleExit = useCallback(() => {
    biAlert(S.common.exitPractice, S.question.progressLost, [
      btn(S.common.cancel, { style: 'cancel' }),
      btn(S.common.exitWord, { style: 'destructive', onPress: () => navigate('/') }),
    ]);
  }, [navigate]);

  if (pro.status === 'free') return <ProLock feature={S.features.subjectWise} />;

  if (pro.status === 'error') {
    return (
      <div className="q5-center">
        <span className="q5-state-icon" aria-hidden="true">⚠️</span>
        <BiText s={W.proFailed} center className="q5-error-text" />
        <button type="button" className="q5-btn q5-btn--primary" onClick={pro.retry}>{S.common.retry.ta}</button>
        <button type="button" className="q5-btn q5-btn--secondary" onClick={() => navigate('/')}>{S.common.backHome.ta}</button>
      </div>
    );
  }

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
        <button type="button" className="q5-btn q5-btn--secondary" onClick={() => navigate('/practice')}>{S.common.goBack.ta}</button>
      </div>
    );
  }

  if (phase === 'empty') {
    return (
      <div className="q5-center">
        <BiText s={S.common.noQuestions} center className="q5-error-text" />
        <button type="button" className="q5-btn q5-btn--secondary" onClick={() => navigate('/practice')}>{S.common.goBack.ta}</button>
      </div>
    );
  }

  if (phase === 'results') {
    return (
      <div className="page q5-page">
        <Quick5Results score={score} total={totalAttempted} streak={null} daily={false} practiceAgainTo="/practice" />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const nextLabel = currentIndex < questions.length - 1 ? S.common.next : S.common.seeResults;

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

      <PracticeFooter onExit={handleExit} onNext={handleNext} showNext={isAnswered} nextLabel={nextLabel} />
    </div>
  );
};

export default PracticeSession;
