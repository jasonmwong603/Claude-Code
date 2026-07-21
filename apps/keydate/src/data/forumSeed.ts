import type { ForumCategory, ForumPost } from '../types'

export const CATEGORY_META: Record<ForumCategory, { label: string; emoji: string; color: string }> = {
  milestone: { label: 'Milestone', emoji: '🎯', color: '#3FA672' },
  firsthome: { label: 'First home', emoji: '🔑', color: '#E8B84B' },
  advice: { label: 'Advice', emoji: '💡', color: '#1E4D3B' },
  question: { label: 'Question', emoji: '💬', color: '#5C6F66' },
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString()

// A little "SOLD" illustration so the media feature is visible in the feed
// before a user attaches anything. Encoded inline so there's no asset to fetch.
const SOLD_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340">' +
  '<rect width="600" height="340" fill="#E3F2E9"/>' +
  '<rect x="170" y="150" width="260" height="150" fill="#F1E8D2" stroke="#17302A" stroke-width="4"/>' +
  '<polygon points="150,150 300,60 450,150" fill="#3FA672"/>' +
  '<rect x="270" y="212" width="60" height="88" fill="#1E4D3B"/>' +
  '<rect x="196" y="176" width="46" height="40" fill="#BFDFF0" stroke="#17302A" stroke-width="3"/>' +
  '<rect x="358" y="176" width="46" height="40" fill="#BFDFF0" stroke="#17302A" stroke-width="3"/>' +
  '<rect x="70" y="70" width="150" height="86" rx="10" fill="#ffffff" stroke="#B4452F" stroke-width="6"/>' +
  '<text x="145" y="126" font-family="Arial,sans-serif" font-size="42" font-weight="bold" fill="#B4452F" text-anchor="middle">SOLD</text>' +
  '</svg>'
const SAMPLE_IMG = `data:image/svg+xml,${encodeURIComponent(SOLD_SVG)}`

/* Example community posts. These illustrate the feed and voice; real cross-user
   posting arrives when a backend is wired (see src/lib/forum.ts). */
export const SEED_POSTS: ForumPost[] = [
  {
    id: 'seed-1',
    author: 'Priya',
    avatar: '🌷',
    location: 'Calgary, AB',
    category: 'firsthome',
    title: 'Got the keys to our first place today 🔑',
    body: "Two and a half years of saving $700/month and it finally happened — a little townhouse in the northwest. The FHSA refund trick from the lessons genuinely added a whole extra month of savings each year. To anyone in the Save stage: it works. Keep going.",
    createdAt: daysAgo(1),
    likes: 42,
    media: { kind: 'image', url: SAMPLE_IMG },
  },
  {
    id: 'seed-2',
    author: 'Marcus',
    avatar: '🧭',
    location: 'Halifax, NS',
    category: 'milestone',
    title: 'Hit 50% of my down payment goal!',
    body: 'Halfway there. Automating the transfer for the day after payday was the single biggest change — I genuinely stopped noticing the money was gone. Onward to 75%.',
    createdAt: daysAgo(3),
    likes: 28,
  },
  {
    id: 'seed-3',
    author: 'Jen & Sam',
    avatar: '👫',
    location: 'Kitchener, ON',
    category: 'advice',
    title: 'Co-buying with a sibling — what we learned',
    body: "We bought with my brother to get in sooner. Get a co-ownership agreement drawn up by a lawyer BEFORE you buy — who pays what, what happens if someone wants out. Awkward conversation, saved us a huge headache. Best decision we made.",
    createdAt: daysAgo(6),
    likes: 35,
  },
  {
    id: 'seed-4',
    author: 'Dev',
    avatar: '🛠️',
    location: 'Edmonton, AB',
    category: 'question',
    title: 'Fixed vs variable rate for a first mortgage?',
    body: "Getting close to pre-approval and the broker asked fixed or variable. I know it's not advice here — just curious what other first-timers chose and how it worked out for you?",
    createdAt: daysAgo(8),
    likes: 12,
  },
  {
    id: 'seed-5',
    author: 'Amara',
    avatar: '🌻',
    location: 'Winnipeg, MB',
    category: 'milestone',
    title: 'First $10K saved — a year ago I had nothing',
    body: 'Posting this so future-me remembers. Started with $50/month because that was all I had. Raises and a tax refund later, I just crossed $10,000. Small starts count.',
    createdAt: daysAgo(11),
    likes: 51,
  },
  {
    id: 'seed-6',
    author: 'Noah',
    avatar: '🌲',
    location: 'Victoria, BC',
    category: 'advice',
    title: 'The FHSA + HBP combo actually stacks',
    body: "Didn't realize until the lessons spelled it out: you can use the FHSA and the RRSP Home Buyers' Plan together on the same purchase. That was another ~$8K of down payment I left on the table last year. Do the lesson before you lock anything in.",
    createdAt: daysAgo(13),
    likes: 39,
  },
  {
    id: 'seed-7',
    author: 'Leah',
    avatar: '🐦',
    location: 'Saskatoon, SK',
    category: 'question',
    title: 'How did you decide on your target neighbourhood?',
    body: 'My keys-date is way sooner if I look one town over, but I keep second-guessing. For those who compromised on location to buy sooner — any regrets, or would you do it again?',
    createdAt: daysAgo(15),
    likes: 17,
  },
  {
    id: 'seed-8',
    author: 'Tomas',
    avatar: '🎯',
    location: 'Montréal, QC',
    category: 'milestone',
    title: '18-month streak — never missed a deposit',
    body: 'The badge for a 12-month streak is what kept me honest, not gonna lie. Set it, forget it, watch the house build itself. The gamification sounds silly until it quietly changes your habits.',
    createdAt: daysAgo(18),
    likes: 46,
  },
  {
    id: 'seed-9',
    author: 'Aisha',
    avatar: '🔑',
    location: 'Brampton, ON',
    category: 'firsthome',
    title: 'Closed on a condo — the plan said Nov 2026, we did it early',
    body: 'Picked up a side gig for a year and threw all of it at the goal. Beat my keys-date by four months. Seeing the date move up every time I logged extra was weirdly addictive. We have keys. Still can’t believe it.',
    createdAt: daysAgo(21),
    likes: 58,
    media: { kind: 'image', url: SAMPLE_IMG },
  },
]
