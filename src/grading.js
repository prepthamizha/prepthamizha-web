// Grading helpers — copied unchanged from the app's src/components/QuestionBody.js.
// (Kept in their own file so QuestionBody.jsx exports only components.)
export const optionKeys = (q) => (q?.option_e ? ['a', 'b', 'c', 'd', 'e'] : ['a', 'b', 'c', 'd']);

export const isCorrectOption = (q, option) =>
  !!option && option.toLowerCase() === q?.correct_answer?.toLowerCase();
