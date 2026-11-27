// Helpers copied unchanged from the app's src/components/SubjectProgressRow.js.

// A subject's accuracy is shown only after this many distinct questions
// (same number as the backend's WEAKEST_MIN_ATTEMPTS — keep the two equal).
export const MIN_ANSWERED_FOR_ACCURACY = 10;

// Tamil name is the main line; the English name goes below it, only when it differs.
// Names come from the backend (syllabus_display_map), never hard-coded.
export const subjectNames = (s) => {
  const en = s?.syllabus_display_name || s?.subject || '';
  const ta = s?.syllabus_display_name_ta || en;
  return { ta, en: en !== ta ? en : null };
};

// Bar fill %: at least a sliver once anything is answered, so a start is visible.
export const barPct = (done, total) => {
  if (!total || !done) return 0;
  return Math.min(100, Math.max(2, Math.round((done / total) * 100)));
};

// From the app's ProgressScreen: "N நாள்" for 1, "N நாட்கள்" otherwise.
export const daysTa = (n) => {
  const v = n ?? 0;
  return `${v} ${v === 1 ? 'நாள்' : 'நாட்கள்'}`;
};
export const daysEn = (n) => {
  const v = n ?? 0;
  return `${v} ${v === 1 ? 'day' : 'days'}`;
};
