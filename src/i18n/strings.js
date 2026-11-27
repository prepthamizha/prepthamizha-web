// All UI text. Tamil (`ta`) is the main label; `en` is its English tagline — never remove it.
// Strings with values are functions returning { ta, en }.
// Render with <BiText s={...} /> (English small below) or <BiText s={...} inline /> ("தமிழ் (English)").
// Review sheet: docs/tamil_strings_review.md
import { Alert } from '../web/alert'; // web shim for RN Alert (only change from the app's copy)

const T = (ta, en) => ({ ta, en });
// English-only common app word (no Tamil, no second line). List: docs/tamil_strings_review.md.
const E = (en) => ({ ta: en, en: null });

export const S = {
  common: {
    ok: E('OK'),
    cancel: E('Cancel'),
    error: T('பிழை', 'Error'),
    retry: E('Retry'),
    goBack: E('Go Back'),
    backHome: E('Back to Home'),
    next: E('Next →'),
    nextQuestion: E('Next Question →'),
    viewResults: E('🏆 View Results'),
    seeResults: E('See Results'),
    exit: E('✕ Exit'),
    exitWord: E('Exit'),
    question: T('கேள்வி', 'Question'),
    questions: T('கேள்விகள்', 'Questions'),
    correct: T('சரி', 'Correct'),
    wrong: T('தவறு', 'Wrong'),
    accuracy: T('துல்லியம்', 'Accuracy'),
    progress: T('முன்னேற்றம்', 'Progress'),
    year: T('ஆண்டு', 'Year'),
    resume: E('Resume →'),
    saving: E('Saving…'),
    loading: E('Loading…'),
    connecting: E('Connecting…'),
    pleaseWait: E('Please wait…'),
    maybeLater: E('Maybe Later'),
    submitAnswer: E('Submit Answer'),
    saveExit: E('Save & Exit'),
    startFresh: E('Start Fresh'),
    exitPractice: E('Exit Practice?'),
    correctBang: T('✅ சரி!', 'Correct!'),
    wrongAnswer: T('❌ தவறான விடை', 'Wrong Answer'),
    whyEachOption: T('📊 ஒவ்வொரு விருப்பத்தின் விளக்கம்', 'Why each option?'),
    yourAnswer: T('உங்கள் விடை', 'Your Answer'),
    correctAnswer: T('சரியான விடை', 'Correct Answer'),
    explanation: T('விளக்கம்', 'Explanation'),
    free: E('FREE'),
    qOfN: (i, n) => T(`கேள்வி ${i}/${n}`, `Q${i} of ${n}`),
    pctComplete: (p) => T(`${p}% முடிந்தது`, 'complete'),
    days: (n) => E(`${n} days`),
    noQuestions: T('கேள்விகள் இல்லை', 'No questions available'),
    loadingQuestions: E('Loading questions…'),
    loadQuestionsFailed: T('கேள்விகளை ஏற்ற முடியவில்லை. மீண்டும் முயலவும்.', 'Failed to load questions. Please try again.'),
    tryAgainFailed: (ta, en) => T(`${ta} மீண்டும் முயலவும்.`, `${en} Please try again.`),
  },

  features: {
    quick5: T('இன்றைய 5 கேள்விகள்', '5 rapid questions for today'),
    mockTest: T('மாதிரித் தேர்வு', 'Mock Test'),
    subjectWise: T('பாடவாரியான பயிற்சி', 'Subject-wise Practice'),
    previousYear: T('முந்தைய ஆண்டு வினாத்தாள்கள்', 'Previous Year Papers'),
    previousYearHeader: T('முந்தைய வினாத்தாள்கள்', 'Previous Year Papers'), // shorter, fits the header bar
    previousYearQuestions: T('முந்தைய ஆண்டு வினாக்கள்', 'Previous Year Questions'),
    qotd: T('தினம் ஒரு கேள்வி', 'Question of the Day'),
    bookmarks: T('சேமித்த கேள்விகள்', 'My Bookmarks'),
    practiceBookmarks: T('சேமித்த கேள்விகள் — பயிற்சி', 'Practice Bookmarks'),
    progress: T('எனது முன்னேற்றம்', 'My Progress'),
    practiceQuestions: T('பயிற்சிக் கேள்விகள்', 'Practice Questions'),
    quick5Header: T('இன்றைய 5 கேள்விகள்', "Today's 5 Questions"), // Question screen title bar in Quick 5
    answer: T('விடை', 'Answer'),
    results: T('முடிவுகள்', 'Results'),
    reviewWrong: T('தவறான விடைகள்', 'Review Wrong Answers'),
    upgradePro: E('Upgrade to Pro'),
  },

  auth: {
    accountDeleted: T('கணக்கு நீக்கப்பட்டது', 'Account Deleted'),
    accountDeletedMsg: T('இந்தக் கணக்கு நிரந்தரமாக நீக்கப்பட்டது.', 'This account has been permanently deleted.'),
    signedOut: T('வெளியேற்றப்பட்டீர்கள்', 'Signed Out'),
    signedOutMsg: T(
      'உங்கள் கணக்கு வேறொரு சாதனத்தில் உள்நுழைந்துள்ளது. அதனால் இங்கிருந்து வெளியேற்றப்பட்டீர்கள்.',
      'Your account has been signed in on another device. You have been signed out.'),
    newDevice: T('புதிய சாதனம் கண்டறியப்பட்டது', 'New Device Detected'),
    newDeviceMsg: T(
      'நீங்கள் புதிய சாதனத்தில் உள்நுழைகிறீர்கள். முந்தைய சாதனத்திலிருந்து உங்கள் கணக்கு வெளியேற்றப்படும்.',
      'You are signing in from a new device. Your account will be signed out from the previous device.'),
    reactivateFailed: T(
      'இப்போது மீண்டும் செயல்படுத்த முடியவில்லை. இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயலவும்.',
      'Could not reactivate right now. Check your connection and try again.'),
    signInToContinue: T('தொடர உள்நுழையவும்', 'Sign in to continue'),
    consent: T(
      'தொடர்வதன் மூலம், எங்கள் சேவை விதிமுறைகளையும் தனியுரிமைக் கொள்கையையும் ஏற்கிறீர்கள்',
      'By continuing, you agree to our Terms of Service and Privacy Policy'),
    signingIn: E('Signing in…'),
    googleFailed: T('Google உள்நுழைவு தோல்வியடைந்தது', 'Google Sign-In Failed'),
    welcomeBack: T('மீண்டும் வருக!', 'Welcome back!'),
    reactivateMsg: T(
      'இந்தக் கணக்கு நிரந்தரமாக நீக்கப்பட உள்ளது. இப்போது மீண்டும் செயல்படுத்தாவிட்டால், 2 நாள் காலம் முடிந்ததும் உங்கள் சுயவிவரம், முன்னேற்றம், சேமித்த கேள்விகள், தொடர்ச்சி அனைத்தும் அழிக்கப்படும்.',
      "This account is scheduled to be permanently deleted. If you don't reactivate it now, your profile, progress, bookmarks and streak will be erased once the 2-day window ends."),
    reactivate: T('என் கணக்கை மீண்டும் செயல்படுத்து', 'Reactivate My Account'),
    keepScheduled: T('வேண்டாம், நீக்கம் தொடரட்டும்', 'No, keep it scheduled for deletion'),
  },

  legal: {
    terms: T('சேவை விதிமுறைகள்', 'Terms of Service'),
    privacy: T('தனியுரிமைக் கொள்கை', 'Privacy Policy'),
  },

  welcome: {
    examSub: T('VAO · அனைத்துப் பாடங்கள் · 200 கேள்விகள்', 'VAO · All Subjects · 200 Questions'),
    title: T('வரவேற்கிறோம்! 👋', 'Welcome!'),
    select: T('நீங்கள் தயாராகும் தேர்வைத் தேர்ந்தெடுக்கவும்.', 'Select the exam you are preparing for.'),
    changeLater: T('இதை எப்போது வேண்டுமானாலும் உங்கள் சுயவிவரத்தில் மாற்றலாம்.', 'You can change this anytime from your profile.'),
    choose: T('உங்கள் தேர்வைத் தேர்ந்தெடுங்கள்', 'CHOOSE YOUR EXAM'),
    start: E('Start Preparing →'),
    freeNote: T('🔒 இலவசம் · கடன் அட்டை தேவையில்லை', 'Free · No credit card required'),
  },

  update: {
    force: T('இந்த பதிப்பு இனி ஆதரிக்கப்படாது. தொடர புதுப்பிக்கவும்.', 'This version is no longer supported. Please update to continue.'),
    soft: T('புதிய பதிப்பு கிடைக்கிறது', 'A new version is available'),
    update: T('புதுப்பி', 'Update'),
    later: T('பின்னர்', 'Later'),
  },

  reminder: {
    channel: 'படிப்பு நினைவூட்டல் (Study Reminders)',
    title: 'இன்றைய 5 கேள்விகள் 🔥',
    body: '2 நிமிடம் போதும் — உங்கள் தொடர்ச்சியை காப்பாற்றுங்கள்!\n5 rapid questions for today — keep your streak alive!',
  },

  home: {
    greeting: (hourIst) => (hourIst >= 5 && hourIst < 12
      ? T('காலை வணக்கம்', 'Good morning')
      : hourIst >= 12 && hourIst < 17
        ? T('மதிய வணக்கம்', 'Good afternoon')
        : T('மாலை வணக்கம்', 'Good evening')),
    // Tamil only (v11 polish) — the card title above already carries the English name
    doneToday: (s, t) => ({ ta: `✅ இன்று முடிந்தது ${s}/${t}`, en: null }),
    streak: (n) => T(`🔥 ${n} நாள் தொடர்ச்சி`, `${n}-day streak`),
    daysLeft: T('நாட்கள் உள்ளன', 'days left'),
    sessionMock: (a, t) => E(`Mock Test · ${a} answered · ${t} left`),
    sessionPaper: (y, i, n) => E(`${y} Paper · Q${i} of ${n}`),
    sessionPractice: (i, n) => E(`Practice · Q${i} of ${n}`),
    continueLeft: E('Continue where you left off'),
    startPracticing: T('🎯 பயிற்சியைத் தொடங்குங்கள்', 'Start Practicing'),
    upgradeTitle: E('Upgrade to Pro'),
    requiresPro: (f) => T(`${f.ta}-க்கு Pro தேவை`, `${f.en} requires Pro`),
    plansFrom: T('திட்டங்கள் தொடக்க விலை', 'Plans starting from'),
    plansAvail: T('3 மாத, 6 மாத & ஆண்டுத் திட்டங்களும் உள்ளன', '3-month, 6-month & yearly plans available'),
    viewPlans: E('View Plans & Upgrade →'),
    proFeatures: [
      T('📝 முழு நீள மாதிரித் தேர்வுகள்', 'Full-length Mock Tests'),
      T('📚 பாடவாரியான பயிற்சி', 'Subject-wise Practice'),
      T('🗂️ முந்தைய ஆண்டு வினாத்தாள்கள்', 'Previous Year Papers'),
    ],
  },

  question: {
    onQOfN: (i, n) => E(`You are on Q${i} of ${n}. What would you like to do?`),
    progressLost: E('Your progress will be lost. Are you sure you want to exit?'),
    freeUsed: T('உங்கள் 20 இலவசக் கேள்விகளும் முடிந்துவிட்டன!', "You've used your 20 free questions!"),
    upgradeToContinue: (exam) => T(
      `அனைத்து ${exam} கேள்விகளையும் தொடர்ந்து பயிற்சி செய்ய PRO-க்கு மேம்படுத்துங்கள்.`,
      `Upgrade to PRO to continue practising all ${exam} questions.`),
    upgradeBtn: E('Upgrade to PRO →'),
    bookmark: E('Bookmark'),
  },

  results: {
    great: T('அருமை! இப்படியே தொடருங்கள்!', 'Great job! Keep it up!'),
    good: T('நல்ல முயற்சி! தொடர்ந்து பயிற்சி செய்யுங்கள்.', 'Good effort! Keep practicing.'),
    keepGoing: T('தொடருங்கள்! விளக்கங்களை மீண்டும் படியுங்கள்.', 'Keep going! Review the explanations.'),
    practiceComplete: T('பயிற்சி முடிந்தது!', 'Practice Complete!'),
    mockComplete: T('மாதிரித் தேர்வு முடிந்தது!', 'Mock Test Complete!'),
    comeBack: T('நாளை மீண்டும் வாருங்கள்!', 'Come back tomorrow!'),
    upsell: T('இன்னும் பயிற்சி வேண்டுமா? Pro-வில் 1,100+ கேள்விகள்', 'Want more practice? 1,100+ questions in Pro'),
    getPro: E('Get Pro'),
    reviewN: (n) => T(`📝 ${n} தவறான விடைகளை மறுபார்வை செய்`, `Review ${n} Wrong Answer${n > 1 ? 's' : ''}`),
    practiceAgain: E('Practice Again'),
  },

  review: {
    toReview: (n) => T(`${n} கேள்விகள் மறுபார்வைக்கு`, `${n} question${n === 1 ? '' : 's'} to review`),
    done: E('Done'),
  },

  answer: {
    wellDone: T('அருமை, தொடருங்கள்!', 'Well done, keep it up!'),
    correctIs: (x) => T(`சரியான விடை: ${x}`, 'Correct answer'),
    breakdown: T('📊 விடை விளக்கம்', 'Answer Breakdown'),
    explanation: T('💡 விளக்கம்', 'Explanation'),
    bookmarked: T('🔖 சேமிக்கப்பட்டது', 'Bookmarked'),
  },

  mock: {
    quitTitle: E('Quit Mock Test?'),
    quitMsg: E('Your progress will be saved. You can resume this test later.'),
    stay: E('Stay'),
    saveQuit: E('Save & Quit'),
    discardQuit: E('Discard & Quit'),
    submitTitle: T('மாதிரித் தேர்வைச் சமர்ப்பிக்கவா?', 'Submit Mock Test?'),
    unanswered: (n) => T(
      `இன்னும் ${n} கேள்விகளுக்குப் பதிலளிக்கவில்லை. இருந்தாலும் சமர்ப்பிக்கவா?`,
      `You have ${n} unanswered question${n !== 1 ? 's' : ''}. Submit anyway?`),
    sureSubmit: T('தேர்வை நிச்சயமாகச் சமர்ப்பிக்க வேண்டுமா?', 'Are you sure you want to submit the test?'),
    submit: E('Submit'),
    resumeTitle: T('மாதிரித் தேர்வைத் தொடரவா?', 'Resume Mock Test?'),
    unfinished: T('முடிக்காத மாதிரித் தேர்வு ஒன்று உள்ளது.', 'You have an unfinished mock test.'),
    answeredRemaining: (a, t) => T(`${a} பதிலளித்தவை · ${t} மீதம்`, `${a} answered · ${t} remaining`),
    resumeTest: E('Resume Test →'),
    discardFresh: E('Discard & Start Fresh'),
    preparing: T('உங்கள் மாதிரித் தேர்வு தயாராகிறது…', 'Preparing your mock test...'),
    loadingN: (n) => T(`${n} கேள்விகள் ஏற்றப்படுகின்றன`, `Loading ${n} questions`),
    noQuestions: T('இந்தத் தேர்வுக்குக் கேள்விகள் இல்லை.', 'No questions available for this exam.'),
    answered: T('பதிலளித்தவை', 'answered'),
    marked: E('🔖 Marked'),
    mark: E('🔖 Mark'),
    prev: E('← Prev'),
    questionsBtn: E('⊞ Questions'),
    palette: T('கேள்விப் பட்டியல்', 'Question Palette'),
    answeredLegend: T('பதிலளித்தவை', 'Answered'),
    notAnswered: T('பதிலளிக்காதவை', 'Not answered'),
    markedLegend: T('குறிக்கப்பட்டவை', 'Marked'),
    close: E('Close'),
  },

  prevYear: {
    loadingYears: T('ஆண்டுகள் ஏற்றப்படுகின்றன…', 'Loading years…'),
    selectYear: T('தேர்வு ஆண்டைத் தேர்ந்தெடுக்கவும்', 'Select Exam Year'),
    selectAYear: T('ஆண்டைத் தேர்ந்தெடுக்கவும்', 'Select a year'),
    paperSummary: (n) => T(`📝 ${n} கேள்விகள் · அனைத்துப் பகுதிகளும்`, `${n} questions · All parts`),
    startPaper: (y) => E(`Start ${y} Paper →`),
    pctDone: (p) => T(`${p}% முடிந்தது`, 'done'),
    sessionSaved: E('Your session is saved. You can resume from where you left off.'),
  },

  subject: {
    loadFailed: T('முன்னேற்றத்தை ஏற்ற முடியவில்லை', "Couldn't load progress"),
    noSubjects: T('பாடங்கள் இல்லை', 'No subjects'),
    progressTitle: T('📚 பாடவாரியான முன்னேற்றம்', 'Subject-wise progress'),
    tapHint: T('பாடத்தைத் தொட்டு பயிற்சி தொடங்குங்கள்', 'Tap a subject to start practice'),
    pctCorrect: (p) => T(`${p}% சரி`, 'correct'),
    afterN: (n) => T(`${n}+ கேள்விகளுக்குப் பிறகு`, `after ${n}+ questions`),
  },

  progress: {
    loading: T('முன்னேற்றம் ஏற்றப்படுகிறது…', 'Loading progress…'),
    tagline: T('உங்கள் முன்னேற்றத்தைக் கண்காணியுங்கள்', 'Track your progress'),
    mockTest: E('Mock Test'),
    paper: (y) => E(`${y} Paper`),
    practiceSession: E('Practice Session'),
    answeredLeft: (a, t) => E(`${a} answered · ${t} left`),
    qCorrect: (i, n, c) => E(`Q${i} of ${n} · ${c} correct`),
    weakest: T('📉 குறைந்த மதிப்பெண்', 'Weakest subject'),
    streakTitle: T('🔥 பயிற்சி தொடர்ச்சி', 'Practice streak'),
    currentBest: (cTa, bTa, c, b) => T(`தற்போது: ${cTa} · அதிகபட்சம்: ${bTa}`, `Current: ${c} · Best: ${b}`),
    totalDays: (n) => T(`மொத்த பயிற்சி நாட்கள்: ${n}`, 'Total practice days'),
    refresh: E('🔄 Refresh'),
  },

  me: {
    nameFailed: T('பெயரை மாற்ற முடியவில்லை. மீண்டும் முயலவும்.', 'Could not update name. Please try again.'),
    reminderNotSet: T('நினைவூட்டல் அமைக்கப்படவில்லை', 'Reminder not set'),
    reminderNotSetMsg: T('நினைவூட்டலை அமைக்க முடியவில்லை. மீண்டும் முயலவும்.', 'Could not schedule the reminder. Please try again.'),
    reminderSet: T('✅ நினைவூட்டல் அமைக்கப்பட்டது', 'Reminder Set'),
    reminderSetMsg: (t) => T(`தினமும் ${t}-க்கு நினைவூட்டல்`, `Daily reminder set for ${t}`),
    shareTa: 'நான் Prep Thamizha மூலம் TNPSC-க்குத் தயாராகிறேன்! 🎯\n1000+ கேள்விகளுடன் பயிற்சி செய்து, முன்னேற்றத்தைக் கண்காணித்து, தேர்வில் வெல்லுங்கள்.',
    shareEn: "I'm preparing for TNPSC with Prep Thamizha! 🎯\nPractice with 1000+ questions, track your progress, and ace the exam.",
    empty: T('காலியாக உள்ளது', 'Empty'),
    emptyMsg: T('அனுப்பும் முன் உங்கள் கருத்தை எழுதவும்.', 'Please write your feedback before submitting.'),
    thanks: T('நன்றி!', 'Thank You!'),
    thanksMsg: T(
      'உங்கள் கருத்து அனுப்பப்பட்டது. ஒவ்வொரு செய்தியையும் படித்து, செயலியை மேம்படுத்தப் பயன்படுத்துகிறோம்.',
      'Your feedback has been submitted. We read every message and use it to improve the app.'),
    feedbackFailed: T('கருத்தை அனுப்ப முடியவில்லை. மீண்டும் முயலவும்.', 'Could not submit feedback. Please try again.'),
    examUpdated: T('✅ தேர்வு மாற்றப்பட்டது', 'Exam Updated'),
    examUpdatedMsg: (e) => T(`உங்கள் தேர்வு ${e} ஆக மாற்றப்பட்டது`, `Your exam has been changed to ${e}`),
    examFailed: T('தேர்வை மாற்ற முடியவில்லை. மீண்டும் முயலவும்.', 'Failed to update exam. Try again.'),
    logout: E('Logout'),
    logoutBtn: E('🚪 Logout'),
    logoutSure: T('நிச்சயமாக வெளியேற வேண்டுமா?', 'Are you sure you want to logout?'),
    deletionScheduled: E('Account Scheduled for Deletion'),
    deletionScheduledMsg: E('Your account and data will be permanently deleted in 2 days. Log in again before then to cancel and keep your account.'),
    requestFailed: E('Could not process the request. Please try again.'),
    errorEn: E('Error'), // reset / delete popups are English-only
    resetDone: E('✅ Reset Complete'),
    resetDoneMsg: E('Your progress has been reset. Start fresh and aim higher!'),
    resetFailed: E('Failed to reset progress. Please try again.'),
    feedback: T('கருத்துகள் & ஆலோசனைகள்', 'Feedback & Suggestions'),
    shareApp: E('Share App'),
    googleAccount: E('🔵 Google Account'),
    emailAccount: E('📧 Email Account'),
    setLbName: T('தரவரிசைப் பெயரை அமை', 'Set leaderboard name'),
    planActive: (p) => E(`${p} Active`),
    freePlan: E('Free Plan'),
    expires: (d) => E(`Expires ${d}`),
    upgradeUnlimited: E('Upgrade for unlimited access'),
    upgradeBtn: E('Upgrade'),
    selectedExam: E('Selected Exam'),
    notSelected: T('தேர்ந்தெடுக்கவில்லை', 'Not selected'),
    change: E('Change'),
    selectNewExam: T('புதிய தேர்வைத் தேர்ந்தெடுக்கவும்:', 'Select New Exam'),
    darkMode: E('Dark Mode'),
    studyReminder: T('படிப்பு நினைவூட்டல்', 'Study Reminder'),
    dailyAt: (t) => ({ ta: `தினமும் ${t}`, en: null }), // Tamil only (R6)
    edit: E('Edit'),
    danger: E('Danger Zone'),
    resetProgress: E('Reset Progress'),
    deleteAccount: E('Delete Account'),
    version: (v) => E(`Version ${v}`),
    resetTitle: E('Reset All Progress?'),
    resetWill: E('This will permanently delete:'),
    resetItems: [
      E('• All quiz attempts & scores'),
      E('• All bookmarked questions'),
      E('• Your day streak'),
    ],
    resetUndo: E('This cannot be undone. You will start completely fresh.'),
    resetting: E('Resetting...'),
    resetYes: E('Yes, Reset Everything'),
    deleteTitle: E('Delete Account?'),
    deleteMsg: E('Your account will be permanently deleted in 2 days. You can cancel any time before then by simply logging back in.'),
    deleteRemoved: E('Permanently removed after 2 days:'),
    deleteItems: [
      E('• Profile & leaderboard name'),
      E('• All quiz attempts & bookmarks'),
      E('• Day streak & progress history'),
    ],
    deleteKept: E('Your subscription and payment records are kept in anonymised form for legal and tax compliance.'),
    deleteMine: E('Delete My Account'),
    keepMine: E('Keep My Account'),
    feedbackTitle: T('💬 கருத்துகள் & ஆலோசனைகள்', 'Feedback & Suggestions'),
    feedbackHelp: T('Prep Thamizha-வை மேம்படுத்த உதவுங்கள்', 'Help us improve Prep Thamizha'),
    category: T('வகை', 'Category'),
    // Keys are the English values stored in the feedback table — do not change them.
    categories: {
      'Content Mistake': T('உள்ளடக்கப் பிழை', 'Content Mistake'),
      'Feature Request': T('புதிய வசதி கோரிக்கை', 'Feature Request'),
      'General Feedback': T('பொதுக் கருத்து', 'General Feedback'),
      Other: T('மற்றவை', 'Other'),
    },
    yourMessage: T('உங்கள் செய்தி', 'Your Message'),
    messagePh: 'பிரச்சினை அல்லது ஆலோசனையை விரிவாக எழுதவும்… (Describe the issue or suggestion in detail)',
    sendFeedback: E('Send Feedback'),
    reminderTime: T('⏰ நினைவூட்டல் நேரம்', 'Set Reminder Time'),
    reminderWhen: T('எப்போது பயிற்சிக்கு நினைவூட்ட வேண்டும்?', 'When should we remind you to practice?'),
    hh: E('HH'),
    mm: E('MM'),
    setReminder: E('Set Reminder'),
    lbNameTitle: T('🏆 தரவரிசைப் பெயர்', 'Leaderboard Name'),
    lbNameMsg: T(
      'இந்தப் பெயர் தரவரிசைப் பட்டியலில் காட்டப்படும். உங்கள் முதல் பெயர் அல்லது புனைப்பெயர் போதும்.',
      'This name is shown on the community leaderboard. First name or a nickname is fine.'),
    namePh: 'உங்கள் பெயரை உள்ளிடவும்… (Enter your name)',
    saveName: E('Save Name'),
  },

  bookmarks: {
    removed: T('நீக்கப்பட்டது', 'Removed'),
    removedMsg: T('சேமித்த கேள்வி நீக்கப்பட்டது!', 'Bookmark removed successfully!'),
    removeFailed: T('நீக்க முடியவில்லை', 'Failed to remove bookmark'),
    saveFailed: T('சேமிக்க முடியவில்லை. மீண்டும் முயலவும்.', 'Could not save the bookmark. Please try again.'),
    removeTitle: E('Remove Bookmark?'),
    removeMsg: E('Remove this question from your bookmarks?'),
    remove: E('Remove'),
    none: T('சேமித்தவை இல்லை', 'No Bookmarks'),
    noneMsg: T('நீங்கள் இன்னும் எந்தக் கேள்வியையும் சேமிக்கவில்லை!', "You haven't bookmarked any questions yet!"),
    loading: T('சேமித்த கேள்விகள் ஏற்றப்படுகின்றன…', 'Loading bookmarks...'),
    practiceAll: (n) => E(`Practice All (${n}) →`),
    noneYet: T('இன்னும் சேமித்த கேள்விகள் இல்லை', 'No Bookmarks Yet'),
    tapStar: T('பயிற்சியின்போது ★ குறியைத் தட்டி கேள்விகளை இங்கே சேமிக்கலாம்.', 'Tap the ★ icon while practicing to save questions here.'),
    correctAnswer: T('✅ சரியான விடை', 'Correct Answer'),
  },

  qotd: {
    loading: T('இன்றைய கேள்வி ஏற்றப்படுகிறது…', "Loading today's question…"),
    failed: T('கேள்வியை ஏற்ற முடியவில்லை. பின்னர் மீண்டும் முயலவும்.', 'Could not load question. Please try again later.'),
    tap: T('விடையைக் காண ஒரு விருப்பத்தைத் தட்டவும்', 'Tap an option to reveal the answer'),
  },

  leaderboard: {
    // Leaderboard screen is fully English.
    accuracy: E('Accuracy'),
    you: E('You'),
    title: E('Community Leaderboard'),
    rankedBy: (exam) => E(`${exam} · Ranked by questions attempted`),
    rank: E('Rank'),
    name: E('Name'),
    attempted: E('Attempted'),
    yourPosition: E('Your Position'),
    noData: E('No data yet'),
    startPractising: E('Start practising to appear on the leaderboard!'),
  },

  payment: {
    features: [
      T('முழு நீள மாதிரித் தேர்வுகள் (200 கேள்விகள், 3 மணி நேரம்)', 'Full length Mock Tests (200 Qs, 3 hrs)'),
      T('பாடவாரியான பயிற்சி', 'Subject-wise Practice'),
      T('அனைத்து முந்தைய ஆண்டு வினாத்தாள்கள்', 'All Previous Year Papers'),
      T('வரம்பற்ற சேமிப்புகள்', 'Unlimited Bookmarks'),
      T('புதிய கேள்விகள் தொடர்ந்து சேர்க்கப்படும்', 'New questions added regularly'),
    ],
    failed: (m) => T(`கட்டணம் தோல்வி: ${m}`, 'Payment failed'),
    errorMsg: (m) => T(`கட்டணப் பிழை: ${m}`, 'Payment error'),
    loginFirst: T('தொடர உள்நுழையவும்.', 'Please login to continue.'),
    notAvailable: T('இந்தத் திட்டத்தை இப்போது வாங்க முடியாது.', 'This plan is not available for purchase right now.'),
    noPricing: T('இந்தத் திட்டத்தின் விலையை ஏற்ற முடியவில்லை. சிறிது நேரம் கழித்து முயலவும்.', 'Could not load pricing for this plan. Please try again in a moment.'),
    notVerified: T(
      'கட்டணத்தைச் சரிபார்க்க முடியவில்லை. பணம் எடுக்கப்பட்டிருந்தால், எங்களைத் தொடர்பு கொள்ளவும்.',
      'Payment could not be verified. If amount was debited, contact support.'),
    verifyFailed: T(
      'சரிபார்ப்பு தோல்வியடைந்தது. உங்கள் சந்தா நிலையைச் சரிபார்க்கவும் அல்லது எங்களைத் தொடர்பு கொள்ளவும்.',
      'Verification failed. Please check your subscription status or contact support.'),
    loadingPlans: E('Loading plans…'),
    verifying: T('உங்கள் கட்டணம் சரிபார்க்கப்படுகிறது…', 'Verifying your payment…'),
    dontClose: T('காத்திருக்கவும், செயலியை மூட வேண்டாம்', 'Please wait, do not close the app'),
    subtitle: T('Pro மூலம் முழுமையாகத் தயாராகுங்கள்', 'Unlock your full exam potential'),
    included: T('இதில் உள்ளவை', "What's included"),
    choosePlan: T('உங்கள் திட்டத்தைத் தேர்ந்தெடுங்கள்', 'Choose your plan'),
    pay: (price, label) => E(`Pay ${price} — ${label} PRO`),
    youArePro: E("You're PRO!"),
    active: T('உங்கள் சந்தா செயலில் உள்ளது.', 'Your subscription is active.'),
    enjoy: T('அனைத்து பிரீமியம் வசதிகளையும் அனுபவியுங்கள்!', 'Enjoy all premium features!'),
    successFeatures: [
      T('📝 முழு மாதிரித் தேர்வுகள்', 'Full Mock Tests'),
      T('📚 பாடவாரியான பயிற்சி', 'Subject-wise Practice'),
      T('🗂️ அனைத்து முந்தைய ஆண்டு வினாத்தாள்கள்', 'All Previous Year Papers'),
    ],
    startPractising: E('🚀 Start Practising'),
  },
};

// "தமிழ் (English)" — small buttons, alert buttons, placeholders.
export const inline = (s) => (s.en ? `${s.ta} (${s.en})` : s.ta);

// Android alert titles are one line, so the title is Tamil only and the English
// title goes with the English message:  "<ta msg>\n\n<en title> — <en msg>".
export const biAlert = (title, msg, buttons, options) => {
  const titleEn = title?.en;
  let body;
  if (msg) {
    const enPart = msg.en ? (titleEn ? `${titleEn} — ${msg.en}` : msg.en) : titleEn;
    body = enPart ? `${msg.ta}\n\n${enPart}` : msg.ta;
  } else {
    body = titleEn || '';
  }
  Alert.alert(title ? title.ta : '', body, buttons, options);
};

// Alert button: { ...btn, text: 'தமிழ் (English)' }.
export const btn = (s, extra = {}) => ({ text: inline(s), ...extra });
