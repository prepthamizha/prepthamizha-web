import './Spinner.css';

const Spinner = ({ light = false, small = false }) => (
  <span className={`spinner${light ? ' spinner--light' : ''}${small ? ' spinner--small' : ''}`} role="status" aria-label="Loading" />
);

export default Spinner;
