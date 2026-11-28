// Web-only strings, same { ta, en } shape as strings.js (kept separate so strings.js
// stays an exact copy of the app's file).
const T = (ta, en) => ({ ta, en });
const E = (en) => ({ ta: en, en: null });

export const W = {
  tagline: T('வென்று காட்டுவோம்!', "Let's win!"),
  webIntro: T('TNPSC தேர்வுக்கு தினமும் பயிற்சி செய்யுங்கள் — இப்போது இணையத்திலும்.', 'Practise for TNPSC every day — now on the web too.'),
  // Login / account (web only — the rest comes from S.auth, S.welcome, S.me)
  notConfigured: T('உள்நுழைவு இன்னும் அமைக்கப்படவில்லை.', 'Sign-in is not set up yet (Firebase config missing).'),
  popupBlocked: T('உள்நுழைவு சாளரம் தடுக்கப்பட்டது. Pop-up-களை அனுமதித்து மீண்டும் முயலவும்.', 'The sign-in window was blocked. Allow pop-ups and try again.'),
  profileFailed: T('உங்கள் கணக்கை ஏற்ற முடியவில்லை. இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயலவும்.', 'Could not load your account. Check your connection and try again.'),
  saveFailed: T('சேமிக்க முடியவில்லை. மீண்டும் முயலவும்.', 'Could not save. Please try again.'),
  account: T('கணக்கு', 'Account'),
  exam: T('தேர்வு', 'Exam'),
  // Quick 5 — shown when the backend (Render free tier) is slow to wake up
  slowWake: T('சர்வர் தயாராகிக் கொண்டிருக்கிறது… ஒரு நிமிடம் வரை ஆகலாம். சற்று காத்திருங்கள்!', 'Getting the server ready… this can take up to a minute. Please wait a moment!'),
  leaderboardFailed: T('தரவரிசையை ஏற்ற முடியவில்லை. மீண்டும் முயலவும்.', 'Could not load the leaderboard. Please try again.'),
  // Subject-wise Practice — Pro lock (no purchase on the web; Pro is bought in the Android app)
  proFailed: T('Pro நிலையைச் சரிபார்க்க முடியவில்லை. மீண்டும் முயலவும்.', 'Could not check your Pro status. Please try again.'),
  proLockBody: T(
    'இப்போதைக்கு Pro-வை Android செயலியில் மட்டுமே பெற முடியும். அதே Google கணக்கில் உள்நுழைந்தால், இங்கேயும் Pro தானாகக் கிடைக்கும்.',
    'For now, Pro is available only in the Android app. Sign in with the same Google account and Pro works here too.'),
  // Previous Year Papers
  paperYear: (y) => T(`${y} வினாத்தாள்`, `${y} Paper`),
  papersHint: T('ஆண்டைத் தொட்டு வினாத்தாளைத் தொடங்குங்கள்', 'Tap a year to open that paper'),
  yearsFailed: T('வினாத்தாள்களை ஏற்ற முடியவில்லை. மீண்டும் முயலவும்.', 'Could not load the papers. Please try again.'),
  noPapers: T('வினாத்தாள்கள் இல்லை', 'No papers available'),
  backToPapers: T('வினாத்தாள்களுக்குத் திரும்பு', 'Back to Papers'),
  getAndroidApp: T('Google Play-யில் செயலியைப் பெறுங்கள்', 'Get the app on Google Play'),
  // Tab labels are English-only, like the app's tab bar.
  tabs: {
    home: E('Home'),
    quick5: E('Quick 5'),
    practice: E('Practice'),
    papers: E('Papers'),
    progress: E('Progress'),
    leaderboard: E('Leaderboard'),
  },
};
