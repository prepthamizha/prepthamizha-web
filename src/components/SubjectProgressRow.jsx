import { Link } from 'react-router-dom';
import BiText from './BiText';
import { S } from '../i18n/strings';
import { MIN_ANSWERED_FOR_ACCURACY, subjectNames, barPct } from '../progressHelpers';

// Web port of the app's SubjectProgressRow (info-only variant used by Progress):
// Tamil name large, English name small below (only when different), "X / Y",
// a bar, then "N% சரி" or "after 10+ questions" in muted text.
// With `to` (Subject-wise Practice) the whole row is a link with the app's brand-blue ›.
const SubjectProgressRow = ({ subject, to }) => {
  const names = subjectNames(subject);
  const showAcc = subject.unique_attempted >= MIN_ANSWERED_FOR_ACCURACY && subject.accuracy != null;
  const pct = barPct(subject.unique_attempted, subject.pool_total);

  const body = (
    <>
      <div className="sp-top">
        <div className="sp-names">
          <span className="sp-name-ta" lang="ta">{names.ta}</span>
          {names.en && <span className="sp-name-en" lang="en">{names.en}</span>}
        </div>
        <span className="sp-count">{subject.unique_attempted} / {subject.pool_total}</span>
        {to && <span className="sp-chevron" aria-hidden="true">›</span>}
      </div>
      <div
        className="sp-bar"
        role="progressbar"
        aria-label={names.en || names.ta}
        aria-valuenow={subject.unique_attempted}
        aria-valuemin={0}
        aria-valuemax={subject.pool_total}>
        <div className="sp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      {showAcc
        ? <BiText s={S.subject.pctCorrect(subject.accuracy)} inline className="sp-acc" />
        : <BiText s={S.subject.afterN(MIN_ANSWERED_FOR_ACCURACY)} inline className="sp-acc-muted" />}
    </>
  );

  return (
    <li className="sp-row">
      {to ? <Link to={to} className="sp-link">{body}</Link> : body}
    </li>
  );
};

export default SubjectProgressRow;
