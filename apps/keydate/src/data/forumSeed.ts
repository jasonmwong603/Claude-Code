import type { ForumCategory, ForumPost } from '../types'

export const CATEGORY_META: Record<ForumCategory, { label: string; emoji: string; color: string }> = {
  milestone: { label: 'Milestone', emoji: '🎯', color: '#3FA672' },
  firsthome: { label: 'First home', emoji: '🔑', color: '#E8B84B' },
  advice: { label: 'Advice', emoji: '💡', color: '#1E4D3B' },
  question: { label: 'Question', emoji: '💬', color: '#5C6F66' },
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString()

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
]
