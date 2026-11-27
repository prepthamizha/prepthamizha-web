import BiText from '../components/BiText';
import { W } from '../i18n/webStrings';

// Temporary page body until each screen is ported.
const Placeholder = ({ icon, title }) => (
  <div className="page">
    <section className="card placeholder-card">
      <span className="placeholder-icon" aria-hidden="true">{icon}</span>
      <BiText as="h1" s={title} center className="placeholder-title" />
      <BiText s={W.comingSoon} center className="placeholder-sub" />
    </section>
  </div>
);

export default Placeholder;
