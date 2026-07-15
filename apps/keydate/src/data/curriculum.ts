import type { Lesson, Stage } from '../types'

export const STAGES: Stage[] = [
  { id: 'save', label: 'Save', unlockAt: 0 },
  { id: 'prep', label: 'Prep', unlockAt: 0.25 },
  { id: 'search', label: 'Search', unlockAt: 0.5 },
  { id: 'close', label: 'Close', unlockAt: 0.75 },
]

export const LESSONS: Lesson[] = [
  {
    id: 'fhsa', stage: 'save', emoji: '🌱', title: 'The FHSA: a special account just for you',
    mins: 3,
    cards: [
      'The FHSA is a savings account made just for first-time home buyers. You can add up to $8,000 a year, and $40,000 in total.',
      'It gives you two gifts. One: the money you put in lowers your taxes, so you get money back at tax time. Two: when you take the money out to buy your home, you pay no tax at all.',
      "Here's the trick most people miss. Put in $8,000, and you could get around $2,400 back on your taxes. Put that refund right back into the account. Free fuel for your savings.",
      "Open one even if you can only add $50 a month. Any room you don't use this year rolls over to next year.",
    ],
    quiz: {
      q: 'Why is the FHSA better than a normal savings account?',
      options: [
        'It pays more interest',
        'It lowers your taxes, and the money comes out tax-free',
        'The government matches what you put in',
        'There are no limits',
      ],
      answer: 1,
      why: 'The FHSA lowers your tax bill when money goes in, and you pay no tax when it comes out for your first home. No other account does both.',
    },
  },
  {
    id: 'downpayment', stage: 'save', emoji: '🧮', title: 'The down payment, made simple',
    mins: 3,
    cards: [
      'The down payment is the part of the home’s price you pay up front with your own money. The bank lends you the rest.',
      'In Canada, the minimum works like this: 5% on the first $500,000 of the price, then 10% on anything above that.',
      'Example: a $600,000 home. 5% of $500,000 is $25,000. 10% of the last $100,000 is $10,000. So you need $35,000 up front.',
      'If you put down less than 20%, you pay for something called mortgage insurance. It gets added to your loan. Think of it as the fee for getting your home years sooner.',
    ],
    quiz: {
      q: "What's the minimum down payment on a $600,000 home?",
      options: ['$30,000', '$35,000', '$60,000', '$120,000'],
      answer: 1,
      why: '5% of the first $500,000 = $25,000. 10% of the next $100,000 = $10,000. Total: $35,000.',
    },
  },
  {
    id: 'automate', stage: 'save', emoji: '⚙️', title: 'Make saving automatic',
    mins: 2,
    cards: [
      "Don't count on willpower to save. It runs out. Set up an automatic transfer instead — money that moves to your savings by itself.",
      "Time it for the day after you get paid. The money leaves before you can spend it. You'll adjust to what's left without even noticing.",
      'Start small if you have to. Saving $400 every single month beats saving $800 only when you feel rich. Steady wins.',
      "Got a raise, a tax refund, or birthday money? Send half to your house fund right away. You can't miss money you never saw.",
    ],
    quiz: {
      q: 'When is the best time for your automatic transfer?',
      options: [
        "End of the month, with whatever's left",
        'The day after payday',
        'Whenever you remember',
        'Once a year',
      ],
      answer: 1,
      why: 'Moving money right after payday means you save first and spend after. Waiting until the end of the month usually leaves nothing.',
    },
  },
  {
    id: 'credit', stage: 'prep', emoji: '📊', title: 'Your credit score, in plain words',
    mins: 3,
    cards: [
      'Your credit score is a number from 300 to 900. It tells banks how reliable you are with borrowed money. Higher is better. Above 680 gets you the best mortgage deals.',
      "Two things matter most: pay every bill on time, and don't max out your credit cards. Try to use less than a third of your card's limit.",
      "Checking your own score is free and doesn't hurt it. Most banking apps show it. Check it now — problems are easier to fix a year early than a month before you apply.",
      "Easy wins: put every bill on autopay, keep your oldest credit card open, and don't apply for new cards or loans in the year before your mortgage.",
    ],
    quiz: {
      q: 'What helps your credit score the most?',
      options: [
        'Closing old credit cards',
        'Paying every bill on time',
        'Checking your score often',
        'Getting more credit cards',
      ],
      answer: 1,
      why: 'Paying on time is the biggest piece of your score. Closing old cards can actually hurt you.',
    },
  },
  {
    id: 'preapproval', stage: 'prep', emoji: '✅', title: 'Pre-approval: know your real budget',
    mins: 3,
    cards: [
      "A pre-approval is a letter from a bank that says: 'We checked your finances, and we'd lend you this much.' It usually holds a rate for you for 3–4 months.",
      'Why it matters: you learn your real budget before you fall in love with a home, and sellers take your offer seriously.',
      "One catch, called the 'stress test': the bank checks that you could still pay if interest rates were about 2% higher. You only pay the real rate — it's just a safety check. But it does lower how much you can borrow.",
      'Talk to your bank AND a mortgage broker. A broker shops many lenders for you at once, usually for free. Even a tiny difference in rate saves you thousands.',
    ],
    quiz: {
      q: "What is the mortgage 'stress test'?",
      options: [
        'A test of how stressed you are',
        'A check that you could handle higher rates',
        'An extra fee',
        'A credit card limit',
      ],
      answer: 1,
      why: 'The bank tests you at a higher rate to make sure you’d be okay if rates go up. You still pay the real, lower rate.',
    },
  },
  {
    id: 'documents', stage: 'prep', emoji: '📁', title: 'Get your paperwork ready',
    mins: 2,
    cards: [
      'Banks check everything before lending you hundreds of thousands of dollars. Getting your papers ready early saves you weeks later.',
      'Proof of income: recent pay stubs, a letter from your job, and your last 2 years of tax papers (T4s and Notices of Assessment).',
      "Proof of savings: 3 months of bank statements for the accounts holding your down payment. If family gives you money, they sign a short 'gift letter' saying it's a gift, not a loan.",
      'Also keep handy: photo ID and a list of what you owe (car loan, student loan, credit cards). Put it all in one folder on your phone.',
    ],
    quiz: {
      q: 'Why does the bank want 3 months of your bank statements?',
      options: [
        'To judge your shopping habits',
        'To confirm where your down payment money came from',
        'To check your credit score',
        'No real reason',
      ],
      answer: 1,
      why: 'Banks must confirm your down payment money is really yours (or a true gift). A big surprise deposit will get questions.',
    },
  },
  {
    id: 'realtor', stage: 'search', emoji: '🤝', title: 'How realtors work for you',
    mins: 3,
    cards: [
      'Good news: as a buyer, your realtor usually costs you nothing. They get paid from the seller’s side when the deal closes.',
      'Your agent works for YOU. They negotiate for you and keep your budget secret. The seller’s agent works for the seller — never tell them your top price.',
      "Talk to 2 or 3 agents before picking one. Ask: 'How many first-time buyers have you helped this year?' and 'How well do you know this area?'",
      "You'll sign an agreement to work together. Check how long it lasts and what area it covers before signing. A few months in one city is normal.",
    ],
    quiz: {
      q: "Who usually pays your realtor when you're the buyer?",
      options: [
        'You, up front',
        "It comes from the seller's side",
        'The bank',
        'Nobody — they work for free',
      ],
      answer: 1,
      why: "The seller's payment usually covers both agents. That's why having your own agent is normally free for you.",
    },
  },
  {
    id: 'truecost', stage: 'search', emoji: '💡', title: 'What a home REALLY costs each month',
    mins: 3,
    cards: [
      'The mortgage payment is not the whole bill. Owning also means property tax, home insurance, and utilities like heat and water.',
      'Condos charge monthly fees too ($200–$800+) for building upkeep. Houses have no fee — but when something breaks, you pay to fix it.',
      'Smart rule: set aside about 1% of your home’s value every year for repairs. For a $500,000 home, that’s about $400 a month. Furnaces don’t break on a convenient schedule.',
      'Quick math: take your mortgage payment and add about one-third more. That’s closer to your real monthly cost. If that number scares you, the home is too expensive — even if the bank approved you.',
    ],
    quiz: {
      q: 'Compared to just the mortgage payment, the real monthly cost is usually…',
      options: ['The same', 'A tiny bit more', 'About a third to almost half more', 'Double'],
      answer: 2,
      why: 'Tax, insurance, utilities, and repairs usually add 30–45% on top of the mortgage payment.',
    },
  },
  {
    id: 'redflags', stage: 'search', emoji: '🔍', title: 'What to look for at a viewing',
    mins: 3,
    cards: [
      'Look past the nice furniture. Check ceilings and basement walls for water stains. Look for big cracks in the foundation. Ask how old the roof and furnace are.',
      'Use your nose. A musty smell can mean hidden moisture or mould. Air freshener everywhere? Ask what it’s hiding.',
      'Before you buy, hire a home inspector ($400–$700). They check the whole house — roof, wiring, plumbing, heating — and give you a report. Go with them; you’ll learn a lot in 3 hours. They work for you, not the seller.',
      'The report isn’t pass or fail. It’s a bargaining chip. Big problems can mean a lower price, the seller fixing things, or you walking away safely.',
    ],
    quiz: {
      q: 'What is a home inspection really for?',
      options: [
        "It's required by law",
        'To show you what you’re buying and give you power to negotiate',
        'To make the seller happy',
        'To set your property tax',
      ],
      answer: 1,
      why: 'An inspection tells you what you’re really buying, and gives you power to negotiate or walk away.',
    },
  },
  {
    id: 'offers', stage: 'close', emoji: '✍️', title: 'Making an offer: your escape hatches',
    mins: 3,
    cards: [
      "An offer is more than a price. It also includes your deposit, your move-in date, and 'conditions' — escape hatches that protect you.",
      'The two big conditions: financing (your bank officially approves the loan for THIS home) and inspection (the home checks out). If either fails, you can walk away and keep your deposit.',
      'Careful: a pre-approval is not a guarantee. The bank also checks the home itself. Skip the financing condition and you could lose your deposit if the bank says no.',
      'In bidding wars, people drop conditions to win. Only do that if you fully understand what you could lose. Some buyers do the inspection before offering instead.',
    ],
    quiz: {
      q: 'What does the financing condition do for you?',
      options: [
        'Locks in your interest rate',
        'Lets you walk away safely if the bank says no',
        'Makes the seller pay your fees',
        'Speeds up the sale',
      ],
      answer: 1,
      why: 'If the bank turns down the loan for this home, the condition lets you exit and keep your deposit.',
    },
  },
  {
    id: 'closingcosts', stage: 'close', emoji: '🧾', title: 'Closing costs: the surprise bill',
    mins: 3,
    cards: [
      "Surprise: the down payment isn't the only money you need. Plan for an extra 3–4% of the home's price in 'closing costs.'",
      'The biggest one is land transfer tax — a tax for putting the home in your name. It’s different in every province. Alberta charges almost nothing. Ontario and BC charge a lot (but first-time buyers get a break).',
      "You'll also need a real estate lawyer ($1,200–$2,500). They handle the legal transfer and move the money safely. Not optional.",
      "Add moving costs, home insurance, and small things like new locks. Don't worry — your KeyDate savings goal already includes an estimate for all of this.",
    ],
    quiz: {
      q: 'How much extra should you plan for closing costs?',
      options: [
        'Nothing — the seller pays',
        'Less than 1% of the price',
        'About 3–4% of the price',
        'About 15% of the price',
      ],
      answer: 2,
      why: 'On a $500,000 home, closing costs are usually $15,000–$20,000. Plan for them from day one.',
    },
  },
  {
    id: 'first90', stage: 'close', emoji: '🏠', title: 'You got the keys! Now what?',
    mins: 2,
    cards: [
      "First things first: change the locks (you don't know who has copies), find the water shut-off valve, and test the smoke alarms.",
      'First week: put the utilities in your name and update your address everywhere — bank, licence, CRA, work.',
      'First month: build your emergency fund back up before renovating anything. Buying probably drained it. Live in the home a while before changing it.',
      "Keep your automatic savings going — just point it at a 'home repair fund' now. The habit that got you the house will now protect it.",
    ],
    quiz: {
      q: "What's the smartest first money move after you get the keys?",
      options: [
        'Renovate the kitchen',
        'Build your emergency fund back up',
        'Buy new furniture on credit',
        'Pay off the whole mortgage',
      ],
      answer: 1,
      why: 'Buying a home usually empties your savings. Refill your safety cushion first — every home has a surprise waiting.',
    },
  },
]
