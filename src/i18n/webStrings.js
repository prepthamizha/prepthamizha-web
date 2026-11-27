// Web-only strings, same { ta, en } shape as strings.js (kept separate so strings.js
// stays an exact copy of the app's file).
const T = (ta, en) => ({ ta, en });
const E = (en) => ({ ta: en, en: null });

export const W = {
  tagline: T('வென்று காட்டுவோம்!', "Let's win!"),
  comingSoon: T('விரைவில் வருகிறது', 'Coming soon'),
  webIntro: T('TNPSC தேர்வுக்கு தினமும் பயிற்சி செய்யுங்கள் — இப்போது இணையத்திலும்.', 'Practise for TNPSC every day — now on the web too.'),
  // Tab labels are English-only, like the app's tab bar.
  tabs: {
    home: E('Home'),
    quick5: E('Quick 5'),
    progress: E('Progress'),
    leaderboard: E('Leaderboard'),
  },
};
