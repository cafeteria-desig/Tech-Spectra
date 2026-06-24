export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Admin password for the admin dashboard
// Set via VITE_ADMIN_PASSWORD env variable, or use a secure default
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'techspectra2026';

export const EVENTS = [
  {
    name: 'Prompt War',
    day: 1,
    date: '29 June 2026',
    time: '9:00 AM – 11:00 AM',
    description:
      'A battle of wits and creativity where participants craft the most compelling AI prompts to solve real-world challenges. Showcase your ability to communicate with AI effectively.',
    rules: [
      'Participants will be given a problem statement individually.',
      'Use any AI tool of your choice to generate solutions.',
      'Judges evaluate based on creativity, precision, and output quality.',
      'Time limit: 2 hours.',
    ],
    eligibility: 'Open to all students. No prior AI experience required.',
    rulebookUrl: '/rules/prompt-wars-rulebook.pdf',
  },
  {
    name: 'Hackathon',
    day: 1,
    date: '29 June 2026',
    time: '11:30 AM – 1:30 PM',
    description:
      'Form your dream team and build something amazing from scratch in this high-energy coding marathon. Innovation meets execution.',
    rules: [
      'Teams of 2–4 members.',
      'Problem statements will be revealed at the start.',
      'Any tech stack is allowed.',
      'Final submission via GitHub repository.',
    ],
    eligibility: 'Open to all students with basic programming knowledge.',
    rulebookUrl: '/rules/hackathon-rulebook.pdf',
  },
  {
    name: 'Nukkad Natak (Street Play)',
    day: 1,
    date: '29 June 2026',
    time: '1:30 PM – 3:00 PM',
    description:
      'Street theatre at its finest — bring social issues to life through powerful performances that captivate and inspire.',
    rules: [
      'Teams of 4–8 members.',
      'Duration: 10–15 minutes per performance.',
      'Theme must be socially relevant.',
      'Props and costumes to be arranged by the team.',
    ],
    eligibility: 'Open to all students. No prior acting experience needed.',
  },
  {
    name: 'Short Movie',
    day: 2,
    date: '30 June 2026',
    time: '9:00 AM – 11:00 AM',
    description:
      'Lights, camera, action! Create a short film that tells a compelling story in limited time. Showcase your filmmaking prowess.',
    rules: [
      'Teams of up to 5 members.',
      'Duration: 5–10 minutes.',
      'Theme will be provided on the spot.',
      'Entries must be submitted in MP4 format.',
    ],
    eligibility: 'Open to all students. Bring your own camera/phone.',
  },
  {
    name: 'Shark Tank',
    day: 2,
    date: '30 June 2026',
    time: '11:30 AM – 1:30 PM',
    description:
      'Pitch your business idea to a panel of "sharks" and compete for the best startup concept. Convince them to invest in your vision.',
    rules: [
      'Individual or teams of up to 3 members.',
      'Pitch duration: 5 minutes + 3 minutes Q&A.',
      'Present a business model, market analysis, and revenue plan.',
      'Bring pitch decks on a USB drive.',
    ],
    eligibility: 'Open to all students with an entrepreneurial mindset.',
  },
  {
    name: 'Instrumental Singing',
    day: 2,
    date: '30 June 2026',
    time: '1:30 PM – 3:00 PM',
    description:
      'Let your voice and instrument harmonize in this musical showcase. Solo or duet performances that stir the soul.',
    rules: [
      'Solo or duet performances.',
      'Duration: 5–7 minutes.',
      'Instruments (except piano) to be arranged by participant.',
      'Karaoke tracks are not allowed — live accompaniment only.',
    ],
    eligibility: 'Open to all students who sing or play instruments.',
  },
] as const;

export const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E'];
export const SEAT_COLS = 20;
export const TOTAL_SEATS = 100;
