import { useState } from 'react';
import BiText from '../components/BiText';
import Spinner from '../components/Spinner';
import { useAuth } from '../auth/AuthContext';
import { S } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import logo from '../assets/prep-thamizha-logo-160.png';
import '../auth/auth.css';

// Same list as the app's WelcomeScreen.
const EXAMS = [
  { id: 'TNPSC Group 4', title: 'TNPSC Group 4', subtitle: S.welcome.examSub, icon: '🏛️' },
];

// Web version of the app's WelcomeScreen (exam choice for a brand-new account).
// Saves with POST /api/user/profile, then the gate lets the user into the app.
const Welcome = () => {
  const { saveExam } = useAuth();
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleStart = async () => {
    if (!selected || busy) return;
    setBusy(true);
    setFailed(false);
    try {
      await saveExam(selected);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-column">
        <header className="auth-brand auth-brand--compact">
          <img src={logo} alt="" className="auth-logo" width="90" height="90" />
          <h1 className="auth-brand-name">Prep Thamizha</h1>
          <span className="auth-tagline" lang="ta">{W.tagline.ta}</span>
        </header>

        <section className="card welcome-choice-card">
          <BiText s={S.welcome.title} className="welcome-choice-title" />
          <BiText s={S.welcome.select} className="welcome-choice-sub" />
          <BiText s={S.welcome.changeLater} className="welcome-choice-sub" />
        </section>

        <BiText s={S.welcome.choose} inline className="exam-section-label" />
        <div role="radiogroup" aria-label={S.welcome.choose.en}>
          {EXAMS.map((exam) => {
            const isSel = selected === exam.id;
            return (
              <button
                key={exam.id}
                type="button"
                role="radio"
                aria-checked={isSel}
                className={`exam-card${isSel ? ' exam-card--selected' : ''}`}
                onClick={() => setSelected(exam.id)}>
                <span className="exam-icon" aria-hidden="true">{exam.icon}</span>
                <span className="exam-text">
                  <span className="exam-title">{exam.title}</span>
                  <BiText s={exam.subtitle} className="exam-sub" />
                </span>
                <span className="exam-radio" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        {failed && (
          <div className="auth-notice" role="alert">
            <BiText s={W.saveFailed} className="auth-notice-text" />
          </div>
        )}

        <button type="button" className="primary-btn" onClick={handleStart} disabled={!selected || busy}>
          {busy ? <Spinner light small /> : S.welcome.start.ta}
        </button>

        <BiText s={S.welcome.freeNote} center className="auth-footer-note" />
      </div>
    </div>
  );
};

export default Welcome;
