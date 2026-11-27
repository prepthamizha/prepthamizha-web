// Daily Tamil motivation line for HomeScreen — the same line for every user on a given IST date.
// Add more { ta, en } entries; the order here is the rotation order.
// Review sheet: docs/tamil_strings_review.md (all 30 lines reviewed)
export const MOTIVATION = [
  { ta: 'இன்று படிப்பது, நாளை வெற்றியாகும்.', en: "What you study today becomes tomorrow's success." },
  { ta: 'தினமும் சிறிது முன்னேற்றம், பெரிய வெற்றிக்கு வழி.', en: 'A little progress daily leads to big success.' },
  { ta: 'முயற்சி செய்பவருக்கு தோல்வி இல்லை.', en: 'There is no failure for those who keep trying.' },
  { ta: 'ஒவ்வொரு கேள்வியும் உங்களை அரசுப் பணிக்கு அருகில் கொண்டு செல்கிறது.', en: 'Every question brings you closer to a government job.' },
  { ta: 'நம்பிக்கையுடன் படியுங்கள், வெற்றி உங்களுடையது.', en: 'Study with confidence; success is yours.' },
  { ta: 'காலையில் ஐந்து கேள்விகள், நாள் முழுவதும் நம்பிக்கை.', en: 'Five questions in the morning, confidence all day.' },
  { ta: 'இன்றைய உழைப்பே நாளைய அரசுப் பணி.', en: "Today's hard work is tomorrow's government job." },
  { ta: 'தவறுகள் பாடங்கள்; அவற்றைத் திருத்துவதே வெற்றி.', en: 'Mistakes are lessons; correcting them is success.' },
  { ta: 'ஒரு நாளும் விடாதீர்கள்; தொடர்ச்சியே வலிமை.', en: "Don't skip a day; consistency is strength." },
  { ta: 'உங்கள் கனவுப் பணி உங்கள் முயற்சிக்காகக் காத்திருக்கிறது.', en: 'Your dream job is waiting for your effort.' },
  { ta: 'ஒவ்வொரு கடினமான கேள்வியும் உங்களை வலிமையாக்கும்.', en: 'Every hard question makes you stronger.' },
  { ta: 'ஐந்து நிமிடப் பயிற்சியும் வீணாகாது.', en: 'Even five minutes of practice is never wasted.' },
  { ta: 'பொறுமையும் பயிற்சியும் வெற்றியின் இரு கண்கள்.', en: 'Patience and practice are the two eyes of success.' },
  { ta: 'நேற்றைவிட இன்று ஒரு படி மேலே.', en: 'Today, one step ahead of yesterday.' },
  { ta: 'தமிழ் இலக்கணம் உங்கள் பலம்; அதை நன்கு பயன்படுத்துங்கள்.', en: 'Tamil grammar is your strength; use it well.' },
  { ta: 'அறிவே உங்கள் ஆயுதம்; அதைக் கூர்மையாக்குங்கள்.', en: 'Knowledge is your weapon; keep it sharp.' },
  { ta: 'வெற்றி ஒரே நாளில் வராது; தினசரி உழைப்பில் வரும்.', en: "Success doesn't come in a day; it comes from daily effort." },
  { ta: 'ஒவ்வொரு நாளும் ஒரு புதிய வாய்ப்பு.', en: 'Every day is a new chance.' },
  { ta: 'தேர்வு நாள் நெருங்குகிறது; ஒவ்வொரு நாளும் முக்கியம்.', en: 'Exam day is coming closer; every day counts.' },
  { ta: 'சந்தேகம் வேண்டாம், உங்களால் முடியும்.', en: "Don't doubt yourself; you can do it." },
  { ta: 'பழைய வினாத்தாள்கள் புதிய வெற்றிக்கு வழிகாட்டி.', en: 'Old question papers guide you to new success.' },
  { ta: 'கவனம் சிதறாமல் படித்தால், இலக்கு நிச்சயம்.', en: 'Study with focus, and your goal is certain.' },
  { ta: 'ஓய்வும் தேவை; ஆனால் முயற்சியை நிறுத்தாதீர்கள்.', en: 'Rest when needed, but never stop trying.' },
  { ta: 'ஒவ்வொரு சரியான விடையும் உங்கள் நம்பிக்கையை உயர்த்தும்.', en: 'Every correct answer raises your confidence.' },
  { ta: 'இன்று கற்றதை நாளை மறக்காமல் மீண்டும் பாருங்கள்.', en: "Revise today's learning so you don't forget it tomorrow." },
  { ta: 'உங்கள் போட்டி மற்றவர்களுடன் அல்ல, நேற்றைய உங்களுடன்.', en: 'Your competition is not others, but yesterday’s you.' },
  { ta: 'ஒழுக்கமான பயிற்சி, உறுதியான வெற்றி.', en: 'Disciplined practice, assured success.' },
  { ta: 'கிராம நிர்வாக அலுவலர் பணி உங்கள் கைக்கு எட்டும் தூரத்தில்.', en: 'The VAO post is within your reach.' },
  { ta: 'தோல்வி ஒரு முற்றுப்புள்ளி அல்ல, ஒரு பாடம்.', en: 'Failure is not a full stop; it is a lesson.' },
  { ta: 'இன்றே தொடங்குங்கள்; நாளை என்பது தாமதம்.', en: 'Start today; tomorrow is too late.' },
];

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// Whole days since 1970-01-01 in IST — identical on every phone, whatever its timezone.
const istDayNumber = (now = Date.now()) => Math.floor((now + IST_OFFSET_MS) / 86400000);

export const motivationOfTheDay = (now = Date.now()) => MOTIVATION[istDayNumber(now) % MOTIVATION.length];
