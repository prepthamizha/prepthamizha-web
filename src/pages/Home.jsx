import { Link } from 'react-router-dom';
import { useProStatus } from '../proStatus';
import BiText from '../components/BiText';
import { S } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import { motivationOfTheDay } from '../data/motivation';

// Tamil-first welcome card, today's motivation line, the two daily entry points, and
// Subject-wise Practice with the app's PRO badge (👑 when Pro, 🔒 when not).
const Home = () => {
  const motivation = motivationOfTheDay();
  const pro = useProStatus();
  return (
    <div className="page">
      <section className="card card--brand welcome-card">
        <BiText as="h1" s={S.welcome.title} onDark className="welcome-title" />
        <BiText s={W.webIntro} onDark className="welcome-intro" />
        <span className="welcome-tagline" lang="ta">{W.tagline.ta}</span>
      </section>

      <section className="card motivation-card">
        <span className="motivation-quote" aria-hidden="true">❝</span>
        <BiText s={motivation} center className="motivation-text" />
      </section>

      <Link to="/quick5" className="card link-card link-card--quick5">
        <span className="link-card-icon" aria-hidden="true">⚡</span>
        <BiText s={S.features.quick5} className="link-card-title" />
        <span className="link-card-arrow" aria-hidden="true">›</span>
      </Link>

      <Link to="/qotd" className="card link-card link-card--qotd">
        <span className="link-card-icon" aria-hidden="true">✨</span>
        <BiText s={S.features.qotd} className="link-card-title" />
        <span className="link-card-arrow" aria-hidden="true">›</span>
      </Link>

      <Link to="/practice" className="card link-card link-card--practice">
        <span className="link-card-icon" aria-hidden="true">📚</span>
        <BiText s={S.features.subjectWise} className="link-card-title" />
        {(pro.status === 'pro' || pro.status === 'free') && (
          <span className={`pro-badge${pro.status === 'pro' ? ' pro-badge--active' : ''}`}>
            {pro.status === 'pro' ? '👑 PRO' : '🔒 PRO'}
          </span>
        )}
        <span className="link-card-arrow" aria-hidden="true">›</span>
      </Link>
    </div>
  );
};

export default Home;
