import { Link } from 'react-router-dom';
import BiText from './BiText';
import { S } from '../i18n/strings';
import { W } from '../i18n/webStrings';
import '../pages/Practice.css';

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.exammasterapp';

// Shown instead of a Pro feature when GET /api/payment/status says is_pro:false.
// Web has no payments: it only points to the Android app on Google Play.
const ProLock = ({ feature }) => (
  <div className="q5-center pr-lock">
    <span className="pr-lock-icon" aria-hidden="true">🔒</span>
    <BiText as="h1" s={S.home.requiresPro(feature)} center className="pr-lock-title" />
    <BiText s={W.proLockBody} center className="pr-lock-body" />
    <a className="pr-lock-play" href={PLAY_URL} target="_blank" rel="noopener noreferrer">
      <BiText s={W.getAndroidApp} center onDark className="pr-lock-play-text" />
    </a>
    <Link to="/" className="pr-lock-home">
      <BiText s={S.common.backHome} center className="pr-lock-home-text" />
    </Link>
  </div>
);

export default ProLock;
