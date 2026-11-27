// Web port of the app's src/components/BiText.js.
// Tamil-first label with its English tagline (never drop the English when `s.en` is set).
//   <BiText s={S.features.quick5} className="card-title" />
//     → Tamil in the given class (large, bold); English below at 70% size, muted grey
//       (light white when `onDark` — navy header, brand cards, buttons).
//   <BiText s={...} inline />  → "தமிழ் (English)" on one line (English part small + grey).
//   s.en null (English-only common words, see strings.js `E()`) → just one line of text.
// `as` sets the Tamil element (e.g. 'h1'); the wrapper is a block span so it sits anywhere.
import './BiText.css';

const BiText = ({ s, as: Tag = 'span', className = '', inline = false, onDark = false, center = false, ...rest }) => {
  if (!s) return null;
  const cls = ['bitext', onDark && 'bitext--on-dark', center && 'bitext--center', className].filter(Boolean).join(' ');

  if (!s.en) {
    return <Tag className={`${cls} bitext-ta`} {...rest}>{s.ta}</Tag>;
  }

  if (inline) {
    return (
      <Tag className={`${cls} bitext-ta bitext--inline`} lang="ta" {...rest}>
        {s.ta} <span className="bitext-en" lang="en">({s.en})</span>
      </Tag>
    );
  }

  return (
    <span className={`${cls} bitext--stack`} {...rest}>
      <Tag className="bitext-ta" lang="ta">{s.ta}</Tag>
      <span className="bitext-en" lang="en">{s.en}</span>
    </span>
  );
};

export default BiText;
