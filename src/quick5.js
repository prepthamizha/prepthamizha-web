// Today's Quick 5 — shared by HomeScreen, QuestionScreen and Navigation (reminder tap).
// Quick 5 is always FREE: no Pro check anywhere on this path.
import axios from 'axios';
import { BASE_URL } from './config';

export const QUICK5_DEFAULT_EXAM = 'TNPSC Group 4';

// Route params for QuestionScreen — the Home card and the reminder tap use the same ones.
export const quick5Params = (examType) => ({
  examType: examType || QUICK5_DEFAULT_EXAM,
  count: 5,
  mode: 'nosave',
  quick5: true,
});

// GET /api/quick5/today.
// → { enabled: false } when the backend switch (QUICK5_ENABLED) is off (404),
//   { enabled: true, ...body } otherwise. Other errors are thrown.
export const fetchQuick5Today = async (examType) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/quick5/today?exam_type=${encodeURIComponent(examType || QUICK5_DEFAULT_EXAM)}`
    );
    return { enabled: true, ...res.data };
  } catch (e) {
    if (e?.response?.status === 404) return { enabled: false };
    throw e;
  }
};

// POST /api/quick5/complete — server scores and saves once per day.
export const completeQuick5 = async ({ quizDate, examType, answers }) => {
  const res = await axios.post(`${BASE_URL}/api/quick5/complete`, {
    quiz_date: quizDate,
    exam_type: examType || QUICK5_DEFAULT_EXAM,
    answers,
  });
  return res.data;
};

// Rebuild the wrong-answer list from saved answers (used when today's set is already done).
export const wrongAnswersFrom = (questions, answers) =>
  (questions || [])
    .filter((q) => answers?.[q.id] && answers[q.id] !== q.correct_answer?.toLowerCase())
    .map((q) => ({
      question: q,
      selectedAnswer: answers[q.id],
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
    }));
