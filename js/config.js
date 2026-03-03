export const API_BASE     = 'https://dog.ceo/api';
export const TOTAL_ROUNDS = 10;
export const ROUND_TIME   = 10;   // seconds
export const LETTERS      = ['A', 'B', 'C', 'D'];

export const VERDICTS = {
  correct: {
    cls: 'correct-v',
    headlines: ['✅ IDENTITY CONFIRMED', '✅ CASE CRACKED', '✅ POSITIVE ID', '✅ GOTCHA!', '✅ CORRECT!'],
  },
  wrong: {
    cls: 'wrong-v',
    headlines: ["❌ WRONG BREED", "❌ MISIDENTIFIED", "❌ INCORRECT", "❌ NOPE", "❌ YOU'VE BEEN FOOLED"],
  },
  timeout: {
    cls: 'wrong-v',
    headlines: ["⏰ TIME'S UP, DETECTIVE", '⏰ TOO SLOW!', '⏰ THE SUSPECT WALKED FREE'],
  },
};

export const RANKS = [
  [0,  2,  'CIVILIAN',              "You couldn't identify a Golden Retriever in a room full of Golden Retrievers. Consider a career change."],
  [3,  4,  'ROOKIE',                'Some potential, but the dogs are not scared of you yet. Keep studying those case files.'],
  [5,  6,  'OFFICER',               'Respectable work. A few suspects slipped through, but the precinct is proud(ish).'],
  [7,  8,  'DETECTIVE',             'Sharp eyes, quick instincts. The dogs are starting to worry.'],
  [9,  9,  'SENIOR DETECTIVE',      'Outstanding. One slip, but we all have bad fur days.'],
  [10, 10, 'CHIEF OF THE K-9 UNIT', 'PERFECT SCORE. The entire canine community is trembling. You are a legend.'],
];
