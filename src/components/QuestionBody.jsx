// Web port of the app's src/components/QuestionBody.js — the one question + options +
// feedback block: tap an option → graded at once (correct green, picked-wrong red,
// others unchanged) → explanation + "why each option" below → the page shows Next.
// Nothing about the correct answer is shown before an option is tapped.
//
// Option E: when a question has option_e it is shown as a normal fifth option. For
// ai_questions it is the "விடை தெரியவில்லை" (don't know) text; correct_answer is never
// 'e' for those, so choosing it grades as wrong and reveals the right answer — the
// same as the app, which has no special case for it either.
//
// Previous Year Papers (app: PreviousYearQuestionScreen) pick first and grade on
// "Submit Answer": pass `selectedOption` for the picked-but-not-submitted option
// (shown in brand blue) and `number` for the paper's "Q12." prefix.
import BiText from './BiText';
import { S } from '../i18n/strings';
import { optionKeys } from '../grading';
import './QuestionBody.css';

// Same state → colour mapping as the app's getColors().
const optionState = (option, { isAnswered, correctOption, answeredOption, selectedOption }) => {
  if (!isAnswered) return option === selectedOption ? 'selected' : 'idle';
  if (option === correctOption) return 'correct';
  if (option === answeredOption) return 'wrong';
  return 'idle';
};

const QuestionBody = ({ question, answeredOption, isAnswered, onSelect, selectedOption = null, number = null }) => {
  const correctOption = question.correct_answer?.toLowerCase();
  const options = optionKeys(question);
  const isWrong = isAnswered && answeredOption !== correctOption;

  return (
    <>
      <div className="qb-question">
        {number != null && <span className="qb-question-number">Q{number}.</span>}
        <p className="qb-question-text">{question.question_text}</p>
      </div>

      <div className="qb-options" role="list">
        {options.map((option) => {
          const state = optionState(option, { isAnswered, correctOption, answeredOption, selectedOption });
          return (
            <button
              key={option}
              type="button"
              role="listitem"
              className={`qb-option qb-option--${state}`}
              onClick={() => { if (!isAnswered) onSelect(option); }}
              disabled={isAnswered}
              aria-pressed={answeredOption === option || selectedOption === option}>
              <span className="qb-option-label">{option.toUpperCase()}</span>
              <span className="qb-option-text">{question[`option_${option}`]}</span>
            </button>
          );
        })}
      </div>

      {isAnswered && question.explanation ? (
        <div className={`qb-explanation ${isWrong ? 'qb-explanation--wrong' : 'qb-explanation--correct'}`} role="status">
          <BiText s={isWrong ? S.common.wrongAnswer : S.common.correctBang} inline className="qb-explanation-status" />
          <p className="qb-explanation-text">{question.explanation}</p>
        </div>
      ) : null}

      {isAnswered && question.option_explanations ? (
        <div className="qb-optexp">
          <BiText s={S.common.whyEachOption} className="qb-optexp-title" />
          {options.map((opt) => {
            const key = opt.toUpperCase();
            const expText = question.option_explanations[key];
            if (!expText) return null;
            const kind = opt === correctOption ? 'correct' : opt === answeredOption ? 'wrong' : 'neutral';
            return (
              <div key={opt} className={`qb-optexp-row qb-optexp-row--${kind}`}>
                <span className="qb-optexp-label">{key}</span>
                <span className="qb-optexp-text">{expText}</span>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

// Exit (left) + Next / See Results (right, only once answered) — same as the app.
export const PracticeFooter = ({ onExit, onNext, nextLabel, showNext, disabled }) => (
  <div className="qb-footer">
    <button type="button" className="qb-exit" onClick={onExit}>
      <BiText s={S.common.exit} center className="qb-exit-text" />
    </button>
    {showNext && (
      <button type="button" className="qb-next" onClick={onNext} disabled={disabled}>
        <BiText s={nextLabel} onDark center className="qb-next-text" />
      </button>
    )}
  </div>
);

export default QuestionBody;
