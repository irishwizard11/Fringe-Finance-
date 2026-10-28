export interface DailyQuizQuestion {
  id: string;
  category: 'bitcoin' | 'whitepaper' | 'finance' | 'security';
  questionEn: string;
  questionGa: string;
  optionsEn: [string, string, string, string];
  optionsGa: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanationEn: string;
  explanationGa: string;
  xpBase: number;
}

export const DAILY_QUIZ_POOL: DailyQuizQuestion[] = [
  {
    id: 'dq-1',
    category: 'bitcoin',
    questionEn: 'What is the absolute maximum number of Bitcoins that will ever exist?',
    questionGa: 'Cad é an líon uasta Bitcoin a bheidh ann go deo?',
    optionsEn: [
      '21 Million BTC',
      '100 Million BTC',
      'Unlimited (Central banks can print more)',
      '1 Billion BTC',
    ],
    optionsGa: [
      '21 Milliún BTC',
      '100 Milliún BTC',
      'Gan teorainn (is féidir níos mó a phriontáil)',
      '1 Bhilliún BTC',
    ],
    correctIndex: 0,
    explanationEn:
      'Satoshi Nakamoto programmed a strict hard cap of 21,000,000 BTC enforced by every full node on the network.',
    explanationGa:
      'Chuir Satoshi Nakamoto teorainn dhocht de 21,000,000 BTC i bhfeidhm nach féidir a shárú.',
    xpBase: 100,
  },
  {
    id: 'dq-2',
    category: 'whitepaper',
    questionEn: 'When did Satoshi Nakamoto publish the Bitcoin Whitepaper ("A Peer-to-Peer Electronic Cash System")?',
    questionGa: 'Cathain a d’fhoilsigh Satoshi Nakamoto Páipéar Bán Bitcoin?',
    optionsEn: [
      'October 31, 2008',
      'January 1, 2015',
      'March 15, 2001',
      'December 25, 2012',
    ],
    optionsGa: [
      '31 Deireadh Fómhair 2008',
      '1 Eanáir 2015',
      '15 Márta 2001',
      '25 Nollaig 2012',
    ],
    correctIndex: 0,
    explanationEn:
      'Satoshi published the 9-page Bitcoin Whitepaper on Halloween—October 31, 2008—before mining the Genesis Block on January 3, 2009.',
    explanationGa:
      'Foilsíodh an Páipéar Bán ar 31 Deireadh Fómhair 2008, agus mianadóireacht an Chéad Bhloic ar 3 Eanáir 2009.',
    xpBase: 100,
  },
  {
    id: 'dq-3',
    category: 'bitcoin',
    questionEn: 'How many Satoshis ("sats") make up 1 full Bitcoin?',
    questionGa: 'Cé mhéad Satoshi ("sats") atá in aon Bitcoin amháin (1 BTC)?',
    optionsEn: [
      '100,000,000 sats (100 Million)',
      '1,000 sats',
      '100 sats (like cents in a Euro)',
      '21,000 sats',
    ],
    optionsGa: [
      '100,000,000 sats (100 Milliún)',
      '1,000 sats',
      '100 sats (cosúil le céinteanna)',
      '21,000 sats',
    ],
    correctIndex: 0,
    explanationEn:
      'Each Bitcoin can be divided into 100,000,000 Satoshis (0.00000001 BTC), making it easy to buy €5 or €10 of Bitcoin.',
    explanationGa:
      'Is féidir gach Bitcoin a roinnt ina 100 milliún Satoshi, ionas gur féidir le haon duine €5 nó €10 de a cheannach.',
    xpBase: 100,
  },
  {
    id: 'dq-4',
    category: 'whitepaper',
    questionEn: 'In Section 4 of the Bitcoin Whitepaper, what consensus mechanism prevents double-spending without a central bank?',
    questionGa: 'In Alt 4 den Pháipéar Bán, cén córas a chuireann cosc ar chaitheamh dúbailte gan banc ceannais?',
    optionsEn: [
      'Proof-of-Work (SHA-256)',
      'Bank Manager Approval',
      'Social Media Voting',
      'Credit Score Verification',
    ],
    optionsGa: [
      'Cruthúnas Oibre (Proof-of-Work SHA-256)',
      'Cead ó Bhainisteoir Bainc',
      'Vótáil ar na Meáin Shóisialta',
      'Seiceáil Scór Creidmheasa',
    ],
    correctIndex: 0,
    explanationEn:
      'Proof-of-Work (PoW) uses real-world computational energy and SHA-256 hashing to timestamp transactions into an unbreakable blockchain.',
    explanationGa:
      'Baineann Cruthúnas Oibre (PoW) úsáid as fuinneamh ríomhaireachta agus haisliú SHA-256 chun idirbhearta a dhaingniú.',
    xpBase: 100,
  },
  {
    id: 'dq-5',
    category: 'bitcoin',
    questionEn: 'How often does the "Bitcoin Halving" cut the new block supply reward in half?',
    questionGa: 'Cé chomh minic a ghearrann "Leathnú Bitcoin" (The Halving) luach saothair na mbloc ina leath?',
    optionsEn: [
      'Every 210,000 blocks (~4 years)',
      'Every month',
      'Every 10 years',
      'Whenever the European Central Bank decides',
    ],
    optionsGa: [
      'Gach 210,000 bloc (~4 bliana)',
      'Gach mí',
      'Gach 10 mbliana',
      'Nuair a chinneann an Banc Ceannais',
    ],
    correctIndex: 0,
    explanationEn:
      'Every 210,000 blocks (~4 years), Bitcoin’s new issuance per block is cut in half (dropping to 3.125 BTC per block in April 2024).',
    explanationGa:
      'Gach 210,000 bloc (~4 bliana), gearrtar soláthar nua Bitcoin ina leath (3.125 BTC in aghaidh an bhloic ó Aibreán 2024).',
    xpBase: 100,
  },
  {
    id: 'dq-6',
    category: 'security',
    questionEn: 'Where is the ONLY safe place to store your 12-word or 24-word Bitcoin Seed Phrase?',
    questionGa: 'Cá bhfuil an t-aon áit shábháilte chun do Fhrása Síol 12/24 focal a stóráil?',
    optionsEn: [
      'Offline on physical paper or stamped steel',
      'In a screenshot in your phone photos',
      'In an email draft or cloud notes app',
      'Typed into a Telegram support chat',
    ],
    optionsGa: [
      'As líne ar pháipéar fisiciúil nó ar chruach',
      'I ngrianghraf scáileáin ar do ghuthán',
      'I nótaí scamall nó i ríomhphost',
      'I gcomhrá tacaíochta ar Telegram',
    ],
    correctIndex: 0,
    explanationEn:
      'Your seed phrase is the master key to your funds. Never photograph it or type it onto an internet-connected device.',
    explanationGa:
      'Is é do Fhrása Síol máistir-eochair do chuid airgid. Coinnigh as líne ar pháipéar nó miotal i gcónaí é.',
    xpBase: 100,
  },
  {
    id: 'dq-7',
    category: 'bitcoin',
    questionEn: 'Which Bitcoin Layer 2 network lets you pay €3.50 for a coffee in milliseconds for a fraction of a cent?',
    questionGa: 'Cén líonra Sraith 2 a ligeann duit íoc as caife €3.50 láithreach ar chodán de chéint?',
    optionsEn: [
      'The Lightning Network',
      'SEPA Wire Transfer',
      'Paper Cheques',
      'Western Union',
    ],
    optionsGa: [
      'An Líonra Lightning',
      'Aistriú Bainc SEPA',
      'Seiceanna Páipéir',
      'Western Union',
    ],
    correctIndex: 0,
    explanationEn:
      'The Lightning Network is Bitcoin’s Layer 2 scaling solution for instant, near-zero-fee everyday payments.',
    explanationGa:
      'Is é an Líonra Lightning Sraith 2 Bitcoin le haghaidh íocaíochtaí laethúla láithreacha.',
    xpBase: 100,
  },
  {
    id: 'dq-8',
    category: 'finance',
    questionEn: 'In the popular 50/30/20 monthly budgeting rule, what does the 20% bucket represent?',
    questionGa: 'Sa riail bhuiséadaithe 50/30/20, cad chuige a n-úsáidtear an 20%?',
    optionsEn: [
      'Future Savings, Emergency Fund & Long-Term Investing',
      'Takeaway coffee and concerts',
      'Rent and electricity bills',
      'Bank overdraft fees',
    ],
    optionsGa: [
      'Coigiltis don Todhchaí, Ciste Éigeandála & Infheistíocht',
      'Caife agus ceolchoirmeacha',
      'Cíos agus billí leictreachais',
      'Táillí rótharraingthe bainc',
    ],
    correctIndex: 0,
    explanationEn:
      'The 50/30/20 rule allocates 50% to Essential Needs, 30% to Lifestyle Wants, and at least 20% to Future Savings & Investing.',
    explanationGa:
      'Cuireann riail 50/30/20 50% le haghaidh Riachtanas, 30% le haghaidh Mianta, agus 20% le haghaidh Coigiltis.',
    xpBase: 100,
  },
  {
    id: 'dq-9',
    category: 'finance',
    questionEn: 'In Ireland, how much net profit from selling Bitcoin or shares can you make tax-free each year before 33% CGT applies?',
    questionGa: 'In Éirinn, cé mhéad brabús glan sa bhliain atá saor ó cháin CGC (33%) nuair a dhíolann tú Bitcoin nó scaireanna?',
    optionsEn: [
      '€1,270 annual personal exemption',
      '€0 (every cent is taxed)',
      '€50,000 per week',
      '€100,000 per month',
    ],
    optionsGa: [
      '€1,270 díolúine phearsanta bhliantúil',
      '€0 (gearrtar cáin ar gach céint)',
      '€50,000 sa tseachtain',
      '€100,000 sa mhí',
    ],
    correctIndex: 0,
    explanationEn:
      'Every individual in Ireland gets a €1,270 annual Capital Gains Tax (CGT) exemption on net profits realized in a calendar year.',
    explanationGa:
      'Bíonn díolúine bhliantúil €1,270 ó Cháin Ghnóthachan Caipitil (CGC) ag gach duine in Éirinn.',
    xpBase: 100,
  },
  {
    id: 'dq-10',
    category: 'whitepaper',
    questionEn: 'In Section 7 & 8 of the Whitepaper, what mathematical structure lets mobile wallets verify transactions without downloading the full blockchain?',
    questionGa: 'In Alt 7 & 8 den Pháipéar Bán, cén struchtúr a ligeann do sparáin gutháin idirbhearta a fhíorú gan an blocshlabhra iomlán a íoslódáil?',
    optionsEn: [
      'A Merkle Tree (SPV)',
      'A PDF Spreadsheet',
      'A Bank IBAN Table',
      'An Email Receipt',
    ],
    optionsGa: [
      'Crann Merkle (Merkle Tree / SPV)',
      'Scarbhileog PDF',
      'Tábla IBAN Bainc',
      'Admháil Ríomhphoist',
    ],
    correctIndex: 0,
    explanationEn:
      'Transactions are hashed into a Merkle Tree inside each block, allowing lightweight SPV wallets to verify payments using just block headers.',
    explanationGa:
      'Cuirtear idirbhearta i gCrann Merkle, rud a ligeann do sparáin éadroma (SPV) íocaíochtaí a fhíorú go tapa.',
    xpBase: 100,
  },
  {
    id: 'dq-11',
    category: 'security',
    questionEn: 'You receive an SMS with a link saying "Claim your €640 Revenue tax refund before midnight." What is the golden rule?',
    questionGa: 'Faigheann tú téacs le nasc: "Éiligh d’aisíoc cánach €640 ó Revenue roimh mheán oíche." Cad í an riail órga?',
    optionsEn: [
      'Never click SMS links—Revenue and Irish banks never text sign-in or refund links',
      'Click the link quickly before midnight',
      'Reply with your Debit Card PIN',
      'Send your 12-word Bitcoin seed phrase to verify',
    ],
    optionsGa: [
      'Ná brúigh naisc SMS riamh—ní sheolann Revenue ná bainc naisc logála isteach i dtéacsanna',
      'Brúigh an nasc go tapa roimh meán oíche',
      'Seol uimhir PIN do chárta bainc mar fhreagra',
      'Cuir isteach do Fhrása Síol 12 fhocal',
    ],
    correctIndex: 0,
    explanationEn:
      '100% Smishing scam. Revenue.ie and Irish banks never send clickable sign-in or refund links via SMS.',
    explanationGa:
      'Scaim Fíodóireachta 100%. Ní chuireann Revenue.ie ná bainc Éireannacha naisc i dteachtaireachtaí SMS riamh.',
    xpBase: 100,
  },
  {
    id: 'dq-12',
    category: 'finance',
    questionEn: 'How many months of essential living expenses should you aim to keep in an accessible Emergency Fund?',
    questionGa: 'Cé mhéad míonna de chostais riachtanacha ar chóir duit a choinneáil i do Chiste Éigeandála?',
    optionsEn: [
      '3 to 6 months of essential bills',
      'Zero—put 100% into high-risk tokens immediately',
      '1 day of expenses',
      '50 years of cash under a mattress',
    ],
    optionsGa: [
      '3 go 6 mhí de bhillí riachtanacha',
      'Ná coinnigh aon Euro leataobh',
      'Lá amháin de chostais',
      '50 bliain d’airgead tirim faoin tocht',
    ],
    correctIndex: 0,
    explanationEn:
      'A 3–6 month Emergency Safety Net protects you from unexpected car repairs or job changes so you never need high-interest credit card debt.',
    explanationGa:
      'Cosnaíonn Ciste Éigeandála 3–6 mhí thú ar chostais gan choinne ionas nach mbíonn gá le fiacha daora.',
    xpBase: 100,
  },
];

/**
 * Deterministically selects 5 questions for a given date key (YYYY-MM-DD) or practice seed
 * so all players competing on the same day get the exact same 5-question Daily Blitz!
 */
export function getQuestionsForSeed(seedStr: string, count = 5): DailyQuizQuestion[] {
  let hash = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    hash ^= seedStr.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const pool = [...DAILY_QUIZ_POOL];
  const selected: DailyQuizQuestion[] = [];

  for (let i = 0; i < count && pool.length > 0; i++) {
    hash ^= i + 97;
    hash = Math.imul(hash, 16777619);
    const idx = Math.abs(hash) % pool.length;
    selected.push(pool[idx]);
    pool.splice(idx, 1);
  }

  return selected;
}

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
