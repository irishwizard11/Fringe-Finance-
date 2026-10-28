export interface BadgeDefinition {
  id: string;
  module: 'tax' | 'bitcoin' | 'budget' | 'security';
  titleEn: string;
  titleGa: string;
  descriptionEn: string;
  descriptionGa: string;
  xpReward: number;
  iconType:
    | 'emerald_knot'
    | 'gold_shield'
    | 'bitcoin_key'
    | 'lightning_bolt'
    | 'budget_compass'
    | 'pension_oak'
    | 'radar_eye'
    | 'master_salmon';
}

export interface DailyQuizRecord {
  dateKey: string;
  score: number;
  correctCount: number;
  maxCombo: number;
  timeRemainingTotalSec: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  county: string;
  personaTitleEn: string;
  personaTitleGa: string;
  avatarColor: string;
  createdAt: string;
  xp: number;
  earnedBadges: Record<string, string>; // badgeId -> ISO timestamp
  completedModules: Record<'tax' | 'bitcoin' | 'budget' | 'security', boolean>;
  dailyQuizBestScore?: number;
  dailyQuizStreak?: number;
  lastDailyQuizDate?: string;
  dailyQuizHistory?: Record<string, DailyQuizRecord>;
}

export const IRISH_COUNTIES = [
  'Baile Átha Cliath (Dublin)',
  'Corcaigh (Cork)',
  'Gaillimh (Galway)',
  'Luimneach (Limerick)',
  'Port Láirge (Waterford)',
  'Béal Feirste (Belfast)',
  'Ciarraí (Kerry)',
  'Maigh Eo (Mayo)',
  'Dún na nGall (Donegal)',
  'Cill Dara (Kildare)',
  'An Mhí (Meath)',
  'Cill Mhantáin (Wicklow)',
  'Loch Garman (Wexford)',
  'An Clár (Clare)',
  'Tiobraid Árann (Tipperary)',
  'Doire (Derry)',
];

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'badge_budget_architect',
    module: 'budget',
    titleEn: '50/30/20 Cashflow Architect',
    titleGa: 'Ailtire Buiséid 50/30/20',
    descriptionEn: 'Built and customized a balanced monthly household budget across Needs, Wants, and Future Savings.',
    descriptionGa: 'Chruthaigh tú buiséad míosúil teaghlaigh cothromaithe 50/30/20 idir Riachtanais, Mianta agus Coigiltis.',
    xpReward: 175,
    iconType: 'budget_compass',
  },
  {
    id: 'badge_pension_alchemist',
    module: 'budget',
    titleEn: 'Buying Power & Future Planner',
    titleGa: 'Pleanálaí Cumhachta Ceannaigh & Todhchaí',
    descriptionEn: 'Explored how inflation affects cash over time and how employer/pension boosts grow long-term savings.',
    descriptionGa: 'Rinne tú ionsamhlú ar chreimeadh boilscithe agus conas a fhásann coigiltis fhadtéarmacha.',
    xpReward: 175,
    iconType: 'pension_oak',
  },
  {
    id: 'badge_tax_reclaimer',
    module: 'tax',
    titleEn: 'Emergency Safety-Net Builder',
    titleGa: 'Tógálaí Ciste Éigeandála',
    descriptionEn: 'Mastered the 4-Step Money Ladder, built a 3–6 month Emergency Fund plan, and unlocked everyday bill rebates.',
    descriptionGa: 'Máistrigh tú an Dréimire Airgeadais 4-Chéim, plean Ciste Éigeandála 3–6 mhí, agus aisíocaíochtaí laethúla.',
    xpReward: 150,
    iconType: 'emerald_knot',
  },
  {
    id: 'badge_cgt_strategist',
    module: 'tax',
    titleEn: 'Compound Growth Strategist',
    titleGa: 'Straitéisí Fáis Iolraithe',
    descriptionEn: 'Simulated long-term compound interest snowball growth and compared savings accounts vs. investments.',
    descriptionGa: 'Rinne tú ionsamhlú ar fhás iolraithe fadtéarmach agus comparáid idir cuntais choigiltis agus infheistíochtaí.',
    xpReward: 200,
    iconType: 'gold_shield',
  },
  {
    id: 'badge_sovereign_keyholder',
    module: 'bitcoin',
    titleEn: 'Sovereign Keyholder',
    titleGa: 'Coimeádaí Eochrach Féin-Choinneála',
    descriptionEn: 'Mastered how decentralized digital scarcity works and practiced the 12-word wallet backup simulator.',
    descriptionGa: 'Máistrigh tú ganntanas digiteach díláraithe agus slándáil Frása Síol 12 fhocal.',
    xpReward: 250,
    iconType: 'bitcoin_key',
  },
  {
    id: 'badge_lightning_compliance',
    module: 'bitcoin',
    titleEn: 'Digital Money & Lightning Explorer',
    titleGa: 'Taiscéalaí Airgid Dhigitigh & Lightning',
    descriptionEn: 'Explored instant everyday Bitcoin payments on the Lightning Network and responsible record-keeping.',
    descriptionGa: 'Rinne tú iniúchadh ar íocaíochtaí láithreacha ar Líonra Lightning agus dea-nósanna taifeadta.',
    xpReward: 200,
    iconType: 'lightning_bolt',
  },
  {
    id: 'badge_daily_champion',
    module: 'bitcoin',
    titleEn: 'Daily Satoshi Arena Champion',
    titleGa: 'Curadh Laethúil Airéine Satoshi',
    descriptionEn: 'Scored 4/5 or higher in the competitive Daily Bitcoin & Financial Literacy Blitz Quiz.',
    descriptionGa: 'Fuair tú 4/5 nó níos airde i dTráth na gCeist Laethúil Iomaíoch Satoshi.',
    xpReward: 300,
    iconType: 'lightning_bolt',
  },
  {
    id: 'badge_scam_sentinel',
    module: 'security',
    titleEn: 'Financial Scam Sentinel',
    titleGa: 'Cosantóir Slándála & Frith-Fíodóireachta',
    descriptionEn: 'Completed the “Is It a Scam?” interactive quiz and learned to spot fake texts and investment traps.',
    descriptionGa: 'Chríochnaigh tú an Tráth na gCeist Slándála agus d’aithin tú téacsanna bréige agus gaistí airgeadais.',
    xpReward: 250,
    iconType: 'radar_eye',
  },
  {
    id: 'badge_salmon_of_knowledge',
    module: 'security',
    titleEn: 'Bradán Feasa (Salmon of Knowledge)',
    titleGa: 'An Bradán Feasa — Máistir Airgeadais',
    descriptionEn: 'Unlocked by completing all 4 Emerald Ledger learning modules across Everyday Money, Wealth Growth, Bitcoin & Security.',
    descriptionGa: 'Bronnta as na 4 mhodúl foghlama go léir in Emerald Ledger a chríochnú go rathúil.',
    xpReward: 500,
    iconType: 'master_salmon',
  },
];

export interface RankTier {
  level: number;
  titleEn: string;
  titleGa: string;
  minXp: number;
}

export const RANK_TIERS: RankTier[] = [
  { level: 1, titleEn: 'Money Explorer', titleGa: 'Foghlaimeoir Airgeadais', minXp: 0 },
  { level: 2, titleEn: 'Smart Budgeter', titleGa: 'Pleanálaí Buiséid', minXp: 250 },
  { level: 3, titleEn: 'Confident Saver & Builder', titleGa: 'Coigilteoir Muiníneach', minXp: 600 },
  { level: 4, titleEn: 'Wealth & Digital Navigator', titleGa: 'Loingseoir Saibhris', minXp: 1000 },
  { level: 5, titleEn: 'Saoi Airgeadais (Financial Sage)', titleGa: 'Saoi Airgeadais & Bitcoine', minXp: 1500 },
];

export function getRankForXp(xp: number): { current: RankTier; next: RankTier | null; progressPct: number } {
  let current = RANK_TIERS[0];
  let next: RankTier | null = null;

  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (xp >= RANK_TIERS[i].minXp) {
      current = RANK_TIERS[i];
      next = RANK_TIERS[i + 1] || null;
    }
  }

  if (!next) {
    return { current, next: null, progressPct: 100 };
  }

  const span = next.minXp - current.minXp;
  const intoTier = xp - current.minXp;
  const progressPct = Math.min(100, Math.max(0, Math.round((intoTier / span) * 100)));
  return { current, next, progressPct };
}

export const STORAGE_KEY_PROFILES = 'fringe_finance_user_profiles_v1';
export const STORAGE_KEY_ACTIVE_PROFILE_ID = 'fringe_finance_active_profile_id_v1';

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'profile-aoife',
    displayName: 'Aoife Ní Chonaill',
    county: 'Gaillimh (Galway)',
    personaTitleEn: 'Bitcoin Self-Custody & Smart Budgeting',
    personaTitleGa: 'Féin-Choinneáil Bitcoine & Buiséad Cliste',
    avatarColor: '#006B3F',
    createdAt: '2026-10-01',
    xp: 650,
    earnedBadges: {
      badge_budget_architect: '2026-10-05T10:00:00.000Z',
      badge_pension_alchemist: '2026-10-06T14:20:00.000Z',
    },
    completedModules: {
      budget: true,
      tax: false,
      bitcoin: false,
      security: false,
    },
    dailyQuizBestScore: 740,
    dailyQuizStreak: 3,
  },
  {
    id: 'profile-ciaran',
    displayName: 'Ciarán Ó Briain',
    county: 'Baile Átha Cliath (Dublin)',
    personaTitleEn: 'Whitepaper Scholar & Lightning Node Runner',
    personaTitleGa: 'Scoláire an Pháipéir Bháin & Nód Lightning',
    avatarColor: '#D97706',
    createdAt: '2026-10-02',
    xp: 920,
    earnedBadges: {
      badge_sovereign_keyholder: '2026-10-04T09:15:00.000Z',
      badge_lightning_compliance: '2026-10-05T18:30:00.000Z',
      badge_daily_champion: '2026-10-08T12:00:00.000Z',
    },
    completedModules: {
      bitcoin: true,
      budget: false,
      tax: false,
      security: false,
    },
    dailyQuizBestScore: 910,
    dailyQuizStreak: 5,
  },
  {
    id: 'profile-niamh',
    displayName: 'Niamh Nic Cárthaigh',
    county: 'Corcaigh (Cork)',
    personaTitleEn: 'Compound Growth & Scam Defense',
    personaTitleGa: 'Fás Iolraithe & Cosaint Slándála',
    avatarColor: '#2563EB',
    createdAt: '2026-10-03',
    xp: 540,
    earnedBadges: {
      badge_scam_sentinel: '2026-10-07T11:00:00.000Z',
    },
    completedModules: {
      bitcoin: false,
      budget: false,
      tax: false,
      security: true,
    },
    dailyQuizBestScore: 680,
    dailyQuizStreak: 2,
  },
];

