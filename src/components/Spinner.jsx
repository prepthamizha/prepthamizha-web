import './Spinner.css';

const Spinner = ({ light = false, small = false, gold = false }) => (
  <span className={`spinner${light ? ' spinner--light' : ''}${gold ? ' spinner--gold' : ''}${small ? ' spinner--small' : ''}`} role="status" aria-label="Loading" />
);

export default Spinner;
