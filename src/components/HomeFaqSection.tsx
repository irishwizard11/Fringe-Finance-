import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ChevronDown,
  Volume2,
  ArrowRight,
  HelpCircle,
  BookOpen,
  X,
} from 'lucide-react';
import { Language, speakIrishText } from '../data/i18n';
import { TermTooltip } from './TermTooltip';
import type { ActivePage } from '../App';

export type FaqCategory = 'all' | 'bitcoin' | 'money' | 'tax' | 'security';

export type BitcoinLessonKey =
  | 'basics'
  | 'whitepaper'
  | 'custody'
  | 'monitor'
  | 'lightning'
  | 'tax';

interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, 'all'>;
  categoryLabelEn: string;
  categoryLabelGa: string;
  questionEn: string;
  questionGa: string;
  answerEn: string;
  answerGa: string;
  keyTakeawayEn: string;
  keyTakeawayGa: string;
  relatedTerms: string[];
  targetPage: ActivePage;
  bitcoinLesson?: BitcoinLessonKey;
  ctaLabelEn: string;
  ctaLabelGa: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-21m-scarcity',
    category: 'bitcoin',
    categoryLabelEn: 'Bitcoin & Sound Money',
    categoryLabelGa: 'Bitcoin & Airgead Fónta',
    questionEn: 'Why will there only ever be 21 million Bitcoin, and why does that matter?',
    questionGa: 'Cén fáth nach mbeidh ach 21 milliún Bitcoin ann go deo, agus cén fáth a bhfuil tábhacht leis sin?',
    answerEn:
      'Unlike fiat currencies (like the Euro or US Dollar), where central banks can expand the money supply at any time, Bitcoin’s issuance is strictly enforced by open-source code and thousands of independent nodes worldwide. Roughly every four years (every 210,000 blocks), the new supply created per block is cut in half ("The Halving") until the total supply reaches 21,000,000 BTC around the year 2140. Because each Bitcoin is divisible into 100,000,000 Satoshis (sats), you only need a few euros to own a fraction of this fixed supply.',
    answerGa:
      'Murab ionann agus airgeadraí fiat (mar an Euro nó Dollar SAM), áit ar féidir le bainc cheannais an soláthar airgid a mhéadú am ar bith, tá eisiúint Bitcoin curtha i bhfeidhm go docht ag cód foinse oscailte agus ag na mílte nód neamhspleách ar fud an domhain. Gach ceithre bliana tuairim is (gach 210,000 bloc), gearrtar an soláthar nua sa leath ("An Leathnú") go dtí go sroicheann an soláthar iomlán 21,000,000 BTC timpeall na bliana 2140. Ós rud é go bhfuil gach Bitcoin inroinnte ina 100,000,000 Satoshi (sats), ní gá ach cúpla euro chun codán den soláthar seasta seo a bheith agat.',
    keyTakeawayEn: 'Fixed 21M cap · 1 BTC = 100,000,000 Satoshis · Halving every 210,000 blocks',
    keyTakeawayGa: 'Teorainn sheasta 21M · 1 BTC = 100,000,000 Satoshi · Leathnú gach 210,000 bloc',
    relatedTerms: ['bitcoin', 'satoshi', 'halving'],
    targetPage: 'bitcoin',
    bitcoinLesson: 'basics',
    ctaLabelEn: 'Explore 21M Supply vs. Euro Lab',
    ctaLabelGa: 'Féach ar Shaotharlann 21M vs. Euro',
  },
  {
    id: 'faq-whitepaper-double-spend',
    category: 'bitcoin',
    categoryLabelEn: 'Bitcoin & Sound Money',
    categoryLabelGa: 'Bitcoin & Airgead Fónta',
    questionEn: 'What problem did Satoshi Nakamoto’s 2008 Bitcoin Whitepaper solve?',
    questionGa: 'Cén fhadhb a réitigh Páipéar Bán Bitcoin Satoshi Nakamoto (2008)?',
    answerEn:
      'Before 2008, digital cash required a trusted central intermediary (a bank or payment processor) to verify that nobody copied and spent the same digital coin twice—known as the "Double-Spending Problem." Satoshi Nakamoto combined a public timestamp server (the blockchain) with cryptographic Proof-of-Work so anyone can send value peer-to-peer across the internet without needing permission or trust in a middleman.',
    answerGa:
      'Roimh 2008, bhí gá le hidirghabhálaí lárnach iontaofa (banc nó próiseálaí íocaíochta) le haghaidh airgid dhigitigh chun a dheimhniú nár chóipeáil agus nár chaith aon duine an bonn digiteach céanna faoi dhó—an "Fhadhb Caiteachais Dhúbailte." Chuir Satoshi Nakamoto freastalaí stampa ama poiblí (an blocshlabhra) le Cruthúnas Oibre cripteagrafach ionas gur féidir le duine ar bith luach a sheoladh ó dhuine go duine gan idirghabhálaí.',
    keyTakeawayEn: 'Solved digital double-spending without banks using Proof-of-Work & decentralized nodes',
    keyTakeawayGa: 'Réitigh caiteachas dúbailte digiteach gan bhainc trí Chruthúnas Oibre & nóid',
    relatedTerms: ['blockchain', 'proof_of_work', 'node'],
    targetPage: 'whitepaper',
    ctaLabelEn: 'Read the Bilingual 2008 Whitepaper',
    ctaLabelGa: 'Léigh an Páipéar Bán Dátheangach (2008)',
  },
  {
    id: 'faq-self-custody-seed',
    category: 'bitcoin',
    categoryLabelEn: 'Bitcoin & Sound Money',
    categoryLabelGa: 'Bitcoin & Airgead Fónta',
    questionEn: 'What is the difference between keeping Bitcoin on an exchange vs. self-custody?',
    questionGa: 'Cad é an difríocht idir Bitcoin a choinneáil ar mhalartán vs. féin-choinneáil?',
    answerEn:
      'When you leave Bitcoin on a centralized exchange, you only hold an IOU; if the exchange freezes withdrawals or becomes insolvent, your funds are at risk ("Not your keys, not your coins"). With self-custody, you generate your own Private Key—backed up offline as a 12- or 24-word recovery Seed Phrase—giving you direct, sovereign control over your Bitcoin on the blockchain.',
    answerGa:
      'Nuair a fhágann tú Bitcoin ar mhalartán láraithe, níl agat ach gealltanas (IOU); má reoitear aistarraingtí nó má théann an malartán i mbá, tá do chuid airgid i mbaol ("Gan do chuid eochracha, ní leatsa na boinn"). Le féin-choinneáil, cruthaíonn tú d’Eochair Phríobháideach féin—tacaithe as líne mar Fhrása Síol 12 nó 24 focal—a thugann smacht díreach flaitheasach duit.',
    keyTakeawayEn: 'Not your keys, not your coins · Write your 12-word seed phrase on paper or steel offline',
    keyTakeawayGa: 'Gan do chuid eochracha, ní leatsa na boinn · Scríobh do fhrása síol 12 fhocal ar pháipéar as líne',
    relatedTerms: ['self_custody', 'seed_phrase', 'private_key'],
    targetPage: 'bitcoin',
    bitcoinLesson: 'custody',
    ctaLabelEn: 'Practice Seed Phrase Backup Simulator',
    ctaLabelGa: 'Cleachtaigh Insamhlóir Frása Síol',
  },
  {
    id: 'faq-address-dca-monitor',
    category: 'bitcoin',
    categoryLabelEn: 'Bitcoin & Sound Money',
    categoryLabelGa: 'Bitcoin & Airgead Fónta',
    questionEn: 'How can I inspect a Bitcoin address and calculate its DCA average price and ROI?',
    questionGa: 'Conas is féidir liom seoladh Bitcoin a scrúdú agus a Mheánphraghas DCA agus ROI a ríomh?',
    answerEn:
      'Because Bitcoin’s ledger is publicly verifiable, you can paste any public Bitcoin address (Legacy 1..., SegWit bc1q..., or Taproot bc1p...) into Emerald Ledger’s Address & ROI Monitor. It fetches live on-chain UTXO transactions, reconstructs the historical EUR price at each inflow timestamp, and calculates your Dollar-Cost Averaging (DCA) cost basis, unrealized profit/loss, and ROI percentage.',
    answerGa:
      'Ós rud é go bhfuil mórleabhar Bitcoin infhíoraithe go poiblí, is féidir leat aon seoladh poiblí Bitcoin (1..., bc1q..., nó bc1p...) a ghreamú isteach i Monatóir Seoltaí & ROI Emerald Ledger. Faigheann sé idirbhearta UTXO beo ar an slabhra, ríomhann sé an praghas stairiúil EUR ag am gach idirbhirt, agus taispeánann sé do bhonn costais DCA, brabús/caillteanas, agus céatadán ROI.',
    keyTakeawayEn: 'Zero private keys required · Tracks live balance, historical EUR cost basis & ROI %',
    keyTakeawayGa: 'Gan eochair phríobháideach · Rianaíonn sé iarmhéid beo, bonn costais EUR & ROI %',
    relatedTerms: ['dca', 'public_key', 'blockchain'],
    targetPage: 'bitcoin',
    bitcoinLesson: 'monitor',
    ctaLabelEn: 'Open Bitcoin Address & DCA ROI Monitor',
    ctaLabelGa: 'Oscail Monatóir Seoltaí & ROI Bitcoin',
  },
  {
    id: 'faq-lightning-network',
    category: 'bitcoin',
    categoryLabelEn: 'Bitcoin & Sound Money',
    categoryLabelGa: 'Bitcoin & Airgead Fónta',
    questionEn: 'How does the Lightning Network make Bitcoin fast enough for everyday coffee payments?',
    questionGa: 'Conas a dhéanann an Líonra Lightning Bitcoin sách tapa le haghaidh íocaíochtaí caife laethúla?',
    answerEn:
      'Bitcoin’s base layer prioritizes global security and decentralization, confirming blocks roughly every 10 minutes. The Lightning Network is a Layer-2 payment protocol built on top of Bitcoin that routes real Satoshis through cryptographic payment channels—settling everyday payments in milliseconds for less than a cent.',
    answerGa:
      'Tugann bunsraith Bitcoin tús áite do shlándáil dhomhanda agus dílárú, ag deimhniú bloc gach ~10 nóiméad. Is prótacal íocaíochta Sraith 2 é an Líonra Lightning atá tógtha ar bharr Bitcoin a sheolann Satoshis fíor trí chainéil íocaíochta chripteagrafacha—ag socrú íocaíochtaí laethúla i milleasoicindí ar níos lú ná pingin amháin.',
    keyTakeawayEn: 'Layer 1 = Final global settlement (~10 mins) · Layer 2 Lightning = Instant payments (<1 second)',
    keyTakeawayGa: 'Sraith 1 = Socrú domhanda (~10 nóim) · Sraith 2 Lightning = Íocaíochtaí láithreacha (<1 soicind)',
    relatedTerms: ['lightning_network', 'satoshi'],
    targetPage: 'bitcoin',
    bitcoinLesson: 'lightning',
    ctaLabelEn: 'Try the Lightning vs. Base Layer Simulator',
    ctaLabelGa: 'Triail Insamhlóir an Líonra Lightning',
  },
  {
    id: 'faq-50-30-20-budget',
    category: 'money',
    categoryLabelEn: 'Everyday Money & Inflation',
    categoryLabelGa: 'Airgead Laethúil & Boilsciú',
    questionEn: 'How does the 50/30/20 rule work for managing monthly take-home pay?',
    questionGa: 'Conas a oibríonn riail 50/30/20 chun do phá glan míosúil a bhainistiú?',
    answerEn:
      'The 50/30/20 rule divides your net monthly income (after PAYE, USC, and PRSI) into three clear buckets: 50% for Essential Needs (rent/mortgage, groceries, utilities, transport), 30% for Lifestyle Wants (dining out, hobbies, travel), and 20% for Future You (emergency cash reserve, pension contributions, and long-term savings or Bitcoin DCA).',
    answerGa:
      'Roinneann riail 50/30/20 d’ioncam glan míosúil (tar éis PAYE, USC, agus PRSI) ina thrí bhuicéad shoiléire: 50% do Riachtanais Bhunúsacha (cíos/morgáiste, grósaeireacht, fóntais), 30% do Mhianta Saoil (bia amuigh, caitheamh aimsire), agus 20% do Do Thodhchaí (ciste éigeandála, pinsean, agus coigilteas fadtéarmach nó DCA Bitcoin).',
    keyTakeawayEn: '50% Essential Needs · 30% Lifestyle Wants · 20% Future Savings, Pension & Investments',
    keyTakeawayGa: '50% Riachtanais · 30% Mianta Saoil · 20% Coigilteas, Pinsean & Infheistíochtaí',
    relatedTerms: ['dca', 'emergency_fund'],
    targetPage: 'budget',
    ctaLabelEn: 'Open 50/30/20 Budget Planner',
    ctaLabelGa: 'Oscail Pleanálaí Buiséid 50/30/20',
  },
  {
    id: 'faq-inflation-purchasing-power',
    category: 'money',
    categoryLabelEn: 'Everyday Money & Inflation',
    categoryLabelGa: 'Airgead Laethúil & Boilsciú',
    questionEn: 'How does inflation silently erode cash savings in a low-interest bank account?',
    questionGa: 'Conas a chreimeann boilsciú coigilteas airgid go ciúin i gcuntas bainc ar ús íseal?',
    answerEn:
      'Even if the euro figure in your bank account stays at €10,000, a 4% annual inflation rate reduces what that money can actually buy in the real world to roughly €6,756 over 10 years. Holding 3–6 months of living expenses in cash is essential for emergencies, but long-term wealth requires productive or scarce assets that outpace monetary debasement.',
    answerGa:
      'Fiú má fhanann an figiúr euro i do chuntas bainc ag €10,000, laghdaíonn ráta boilscithe bliantúil 4% an méid is féidir leis an airgead sin a cheannach sa bhfíorshaol go tuairim is €6,756 thar 10 mbliana. Tá sé riachtanach 3–6 mhí de chostais mhaireachtála a choinneáil in airgead tirim le haghaidh éigeandálaí, ach teastaíonn sócmhainní tearca nó táirgiúla don fhadtéarma.',
    keyTakeawayEn: 'At 4% annual inflation, €10,000 loses ~32% of its real purchasing power in 10 years',
    keyTakeawayGa: 'Ag boilsciú 4% sa bhliain, cailleann €10,000 ~32% dá chumhacht cheannaigh i 10 mbliana',
    relatedTerms: ['inflation', 'purchasing_power', 'fiat_currency'],
    targetPage: 'budget',
    ctaLabelEn: 'Test the Inflation & Purchasing Power Lab',
    ctaLabelGa: 'Triail Saotharlann Boilscithe & Cumhachta Ceannaigh',
  },
  {
    id: 'faq-emergency-fund-first',
    category: 'tax',
    categoryLabelEn: 'Growing Wealth & Irish Tax',
    categoryLabelGa: 'Fás Saibhris & Cáin in Éirinn',
    questionEn: 'Why should I build a 3–6 month emergency fund before investing in volatile assets?',
    questionGa: 'Cén fáth ar chóir dom ciste éigeandála 3–6 mhí a thógáil sula ndéanaim infheistíocht?',
    answerEn:
      'An emergency fund is a dedicated liquid euro cushion covering 3 to 6 months of essential living costs. Without it, an unexpected car repair, medical bill, or job transition could force you to sell long-term investments—like Bitcoin or equities—at the worst possible time during a market downturn and trigger unnecessary tax events.',
    answerGa:
      'Is cúlchiste euro leachtach tiomnaithe é ciste éigeandála a chlúdaíonn 3 go 6 mhí de chostais riachtanacha mhaireachtála. Gan é, d’fhéadfadh deisiú gluaisteáin gan choinne nó athrú poist iallach a chur ort infheistíochtaí fadtéarmacha—mar Bitcoin nó scaireanna—a dhíol ag bun an mhargaidh.',
    keyTakeawayEn: 'Protects you from forced selling during market dips · Keep in instant-access euro savings',
    keyTakeawayGa: 'Cosnaíonn sé thú ó dhíol éigeantach le linn titim mhargaidh · Coinnigh i gcuntas rochtana láithrí',
    relatedTerms: ['emergency_fund', 'compound_interest'],
    targetPage: 'tax',
    ctaLabelEn: 'Calculate Your Emergency Fund Target',
    ctaLabelGa: 'Ríomh Do Sprioc Chiste Éigeandála',
  },
  {
    id: 'faq-irish-cgt-vs-etf-dirt',
    category: 'tax',
    categoryLabelEn: 'Growing Wealth & Irish Tax',
    categoryLabelGa: 'Fás Saibhris & Cáin in Éirinn',
    questionEn: 'How are Bitcoin, individual shares, ETFs, and bank interest taxed in Ireland?',
    questionGa: 'Conas a ghearrtar cáin ar Bitcoin, scaireanna aonair, ETFanna, agus ús bainc in Éirinn?',
    answerEn:
      'In Ireland, realized gains from selling, swapping, or spending Bitcoin or individual shares are subject to Capital Gains Tax (CGT) at 33%, with the first €1,270 of net gains each year tax-free (Personal Exemption). By contrast, regulated ETFs face a 41% Exit Tax with an 8-year Deemed Disposal rule (and no €1,270 exemption), while bank savings interest is subject to 33% DIRT deducted at source.',
    answerGa:
      'In Éirinn, tá brabúis réadaithe ó Bitcoin nó scaireanna aonair a dhíol nó a mhalartú faoi réir Cáin Gnóthachan Caipitiúil (CGC) ag 33%, leis an gcéad €1,270 de bhrabús glan gach bliain saor ó cháin. Os a choinne sin, gearrtar Cáin Éigin 41% ar ETFanna le riail Diúscartha Measta 8 mbliana, agus gearrtar 33% DIRT ar ús coigiltis bainc.',
    keyTakeawayEn: 'Bitcoin & Shares: 33% CGT (€1,270 annual exemption) · ETFs: 41% Exit Tax · Bank Interest: 33% DIRT',
    keyTakeawayGa: 'Bitcoin & Scaireanna: 33% CGC (díolúine €1,270) · ETFanna: Cáin Éigin 41% · Ús Bainc: 33% DIRT',
    relatedTerms: ['cgt', 'deemed_disposal', 'dirt'],
    targetPage: 'tax',
    ctaLabelEn: 'Compare 20-Year After-Tax Growth & Rebates',
    ctaLabelGa: 'Déan Comparáid ar Fhás Iar-Chánach 20 Bliain',
  },
  {
    id: 'faq-pension-tax-relief',
    category: 'tax',
    categoryLabelEn: 'Growing Wealth & Irish Tax',
    categoryLabelGa: 'Fás Saibhris & Cáin in Éirinn',
    questionEn: 'How do Irish pension tax relief and annual PAYE tax rebates work?',
    questionGa: 'Conas a oibríonn faoiseamh cánach pinsin agus aisíocaíochtaí cánach PAYE in Éirinn?',
    answerEn:
      'Pension contributions in Ireland receive immediate income tax relief at your marginal PAYE rate: a €100 pension contribution costs a 40% taxpayer only €60 out of pocket (or €80 for a 20% rate taxpayer), and the fund compounds free of CGT and DIRT. Additionally, PAYE workers can claim annual rebates for Rent Tax Credit (up to €1,000 single / €2,000 jointly), qualifying medical expenses (20%), and remote working utilities (30%).',
    answerGa:
      'Faigheann ranníocaíochtaí pinsin in Éirinn faoiseamh cánach ioncaim láithreach ag do ráta imeallach PAYE: ní chosnaíonn ranníocaíocht €100 ach €60 as do phóca do cháiníocóir 40% (nó €80 ag an ráta 20%). Ina theannta sin, is féidir le hoibrithe PAYE aisíocaíochtaí bliantúla a éileamh ar Chreidmheas Cánach Cíosa (suas le €1,000 / €2,000), costais leighis (20%), agus obair chian (30%).',
    keyTakeawayEn: 'Up to 40% immediate income tax relief on pensions + Rent, Medical & Remote Work rebates',
    keyTakeawayGa: 'Suas le 40% faoiseamh cánach láithreach ar phinsin + Aisíocaíochtaí Cíosa, Leighis & Cianoibre',
    relatedTerms: ['tax_credit', 'marginal_tax_rate', 'compound_interest'],
    targetPage: 'tax',
    ctaLabelEn: 'Estimate Your Irish Tax Rebate',
    ctaLabelGa: 'Meastaigh D’Aisíocaíocht Chánach in Éirinn',
  },
  {
    id: 'faq-scam-seed-defense',
    category: 'security',
    categoryLabelEn: 'Scam & Seed Phrase Defense',
    categoryLabelGa: 'Cosaint Scaimeanna & Frása Síol',
    questionEn: 'How can I spot a Bitcoin seed phrase scam, fake Revenue text, or investment fraud?',
    questionGa: 'Conas is féidir liom scam frása síol Bitcoin, téacs bréige Revenue, nó calaois a aithint?',
    answerEn:
      'Follow three unbreakable security rules: (1) No legitimate company, hardware wallet maker (Ledger/Trezor), bank, or support agent will EVER ask for your 12- or 24-word recovery seed phrase. (2) Any promise of "guaranteed daily crypto returns" or "send 0.1 BTC to receive 0.2 BTC back" is 100% fraud. (3) Never click links in urgent SMS messages claiming to be from Revenue, An Post, or your bank—always navigate independently to the official website or app.',
    answerGa:
      'Lean trí riail shlándála dobhriste: (1) Ní iarrfaidh aon chuideachta dhlisteanach, déantóir sparán crua-earraí (Ledger/Trezor), ná banc do fhrása síol 12 nó 24 focal GO DEO. (2) Is calaois 100% é aon ghealltanas faoi "bhrabús laethúil ráthaithe" nó "seol 0.1 BTC chun 0.2 BTC a fháil ar ais". (3) Ná cliceáil naisc i dtéacsanna práinneacha SMS ó Revenue, An Post, nó do bhanc riamh.',
    keyTakeawayEn: 'Never type your 12-word seed phrase into any website · Guaranteed daily returns = 100% scam',
    keyTakeawayGa: 'Ná clóscríobh do fhrása síol 12 fhocal ar aon suíomh · Brabús laethúil ráthaithe = scam 100%',
    relatedTerms: ['seed_phrase', 'self_custody', 'private_key'],
    targetPage: 'security',
    ctaLabelEn: 'Test Yourself in the Interactive Scam Radar',
    ctaLabelGa: 'Tástáil Thú Féin sa Radar Scaimeanna',
  },
];

interface HomeFaqSectionProps {
  lang: Language;
  onNavigateToPage: (page: ActivePage, bitcoinLesson?: BitcoinLessonKey) => void;
  onOpenGlossary: () => void;
}

export const HomeFaqSection: React.FC<HomeFaqSectionProps> = ({
  lang,
  onNavigateToPage,
  onOpenGlossary,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('all');
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({
    'faq-21m-scarcity': true,
    'faq-irish-cgt-vs-etf-dirt': true,
  });

  const categories: { id: FaqCategory; labelEn: string; labelGa: string }[] = [
    { id: 'all', labelEn: 'All Questions (11)', labelGa: 'Gach Ceist (11)' },
    { id: 'bitcoin', labelEn: 'Bitcoin & Wallet', labelGa: 'Bitcoin & Sparán' },
    { id: 'money', labelEn: 'Money & Inflation', labelGa: 'Airgead & Boilsciú' },
    { id: 'tax', labelEn: 'Irish Tax & Wealth', labelGa: 'Cáin & Saibhreas' },
    { id: 'security', labelEn: 'Scam Defense', labelGa: 'Cosaint Scaimeanna' },
  ];

  const quickSearchTopics: { labelEn: string; labelGa: string; query: string }[] = [
    { labelEn: '21M Supply', labelGa: 'Soláthar 21M', query: '21 million' },
    { labelEn: 'Seed Phrase', labelGa: 'Frása Síol', query: 'seed' },
    { labelEn: '33% CGT vs 41% ETF', labelGa: 'CGC 33% vs ETF 41%', query: '33%' },
    { labelEn: 'Address DCA & ROI', labelGa: 'DCA & ROI Seoltaí', query: 'DCA' },
    { labelEn: 'Lightning', labelGa: 'Lightning', query: 'Lightning' },
    { labelEn: '50/30/20 Rule', labelGa: 'Riail 50/30/20', query: '50/30/20' },
  ];

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.questionEn.toLowerCase().includes(q) ||
        item.questionGa.toLowerCase().includes(q) ||
        item.answerEn.toLowerCase().includes(q) ||
        item.answerGa.toLowerCase().includes(q) ||
        item.keyTakeawayEn.toLowerCase().includes(q) ||
        item.keyTakeawayGa.toLowerCase().includes(q) ||
        item.relatedTerms.some((term) => term.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAllVisible = () => {
    const allOpen = filteredFaqs.every((f) => Boolean(openFaqIds[f.id]));
    if (allOpen) {
      setOpenFaqIds({});
    } else {
      const next: Record<string, boolean> = { ...openFaqIds };
      filteredFaqs.forEach((f) => {
        next[f.id] = true;
      });
      setOpenFaqIds(next);
    }
  };

  const allVisibleExpanded =
    filteredFaqs.length > 0 && filteredFaqs.every((f) => Boolean(openFaqIds[f.id]));

  return (
    <section
      aria-labelledby="home-faq-heading"
      className="pt-4 border-t border-slate-200/80 dark:border-[#1E3A5F]"
    >
      <div className="bg-white dark:bg-[#0D1F38] rounded-3xl border border-slate-200/90 dark:border-[#1E3A5F] p-5 sm:p-7 shadow-xs space-y-6">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#006B3F] dark:text-emerald-400 uppercase tracking-wide">
              <HelpCircle className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
              <span>
                {lang === 'ga'
                  ? 'CEISTEANNA COITIANTA (FAQ) · AIRGEAD & BITCOIN'
                  : 'FREQUENTLY ASKED QUESTIONS · CORE CONCEPTS FINDER'}
              </span>
            </div>
            <h2
              id="home-faq-heading"
              className="text-xl sm:text-2xl font-bold text-[#0A192F] dark:text-white tracking-tight"
            >
              {lang === 'ga'
                ? 'Cuardaigh Ceisteanna Coitianta faoi Bitcoin, Buiséadú & Cáin in Éirinn'
                : 'Frequently Asked Questions: Bitcoin, Everyday Money & Irish Tax'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              {lang === 'ga'
                ? 'Cuardaigh aon choincheap—ó theorainn 21 milliún Bitcoin agus féin-choinneáil go riail 50/30/20 agus CGC 33%—agus léim díreach chuig an uirlis idirghníomhach.'
                : 'Search common financial and Bitcoin questions—from the 21M supply cap and seed phrases to the 50/30/20 rule and 33% Irish CGT—and jump straight into the matching interactive calculator or simulator.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={expandAllVisible}
              className="btn-google-outlined h-9 !py-0 !px-3.5 text-xs"
            >
              <span>
                {allVisibleExpanded
                  ? lang === 'ga'
                    ? 'Dún Gach Freagra'
                    : 'Collapse All'
                  : lang === 'ga'
                  ? 'Oscail Gach Freagra'
                  : 'Expand All'}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenGlossary}
              className="btn-google-tonal h-9 !py-0 !px-3.5 text-xs"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>
                {lang === 'ga' ? 'Foclóir Iomlán (GA/EN)' : 'Full Glossary (GA/EN)'}
              </span>
            </button>
          </div>
        </div>

        {/* Search Input + Quick Concept Filter Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ga'
                  ? 'Cuardaigh ceist nó coincheap (m.sh. 21 milliún, frása síol, CGC 33%, ETF 41%, 50/30/20, DCA)...'
                  : 'Search questions or concepts (e.g., 21 million, seed phrase, 33% CGT, 41% ETF, 50/30/20, DCA)...'
              }
              aria-label={
                lang === 'ga'
                  ? 'Cuardaigh Ceisteanna Coitianta'
                  : 'Search Frequently Asked Questions'
              }
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F] text-sm text-[#0A192F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#006B3F] dark:focus:border-[#F7931A] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={lang === 'ga' ? 'Glan an cuardach' : 'Clear search'}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Segmented Category Filter Controls */}
            <div
              role="tablist"
              aria-label={lang === 'ga' ? 'Catagóirí Ceisteanna' : 'FAQ Categories'}
              className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0A192F] rounded-2xl border border-slate-200/70 dark:border-[#1E3A5F]"
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#0A192F] dark:bg-[#F7931A] text-white dark:text-[#0A192F] shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white'
                    }`}
                  >
                    {lang === 'ga' ? cat.labelGa : cat.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Quick Concept Shortcut Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium mr-1">
                {lang === 'ga' ? 'Coitianta:' : 'Quick search:'}
              </span>
              {quickSearchTopics.map((topic) => {
                const isSelected =
                  searchQuery.trim().toLowerCase() === topic.query.toLowerCase();
                return (
                  <button
                    key={topic.query}
                    type="button"
                    onClick={() =>
                      setSearchQuery(isSelected ? '' : topic.query)
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#006B3F] text-white border-[#006B3F]'
                        : 'bg-slate-50 dark:bg-[#102444] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#1E3A5F] hover:border-[#F7931A]'
                    }`}
                  >
                    {lang === 'ga' ? topic.labelGa : topic.labelEn}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {lang === 'ga'
              ? `Ag taispeáint ${filteredFaqs.length} as ${FAQ_ITEMS.length} ceist`
              : `Showing ${filteredFaqs.length} of ${FAQ_ITEMS.length} core questions`}
          </span>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-semibold text-[#006B3F] dark:text-emerald-400 hover:underline cursor-pointer"
            >
              {lang === 'ga' ? 'Athshocraigh scagairí' : 'Reset filters'}
            </button>
          )}
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#F8FAFC] dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F] text-center space-y-3">
            <p className="text-sm font-semibold text-[#0A192F] dark:text-white">
              {lang === 'ga'
                ? `Níor aimsíodh aon cheist do "${searchQuery}".`
                : `No questions matched "${searchQuery}".`}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {lang === 'ga'
                ? 'Bain triail as téarma eile (m.sh. "Satoshi", "CGC", "50/30/20", "síol") nó oscail an Foclóir Dátheangach.'
                : 'Try searching for another term (e.g., "Satoshi", "CGT", "50/30/20", "seed") or reset the search filters.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn-google-outlined mx-auto"
            >
              <span>{lang === 'ga' ? 'Taispeáin Gach Ceist' : 'Show All Questions'}</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/80 dark:divide-[#1E3A5F] border border-slate-200/90 dark:border-[#1E3A5F] rounded-2xl overflow-hidden bg-[#F8FAFC]/60 dark:bg-[#0A192F]/60">
            {filteredFaqs.map((faq, index) => {
              const isOpen = Boolean(openFaqIds[faq.id]);
              return (
                <div
                  key={faq.id}
                  className="transition-colors bg-white/80 dark:bg-[#0D1F38]/90 hover:bg-white dark:hover:bg-[#102444]"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full px-4 sm:px-6 py-4 text-left flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1 min-w-0">
                      {/* Unboxed static metadata line per design constitution */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-[#F7931A]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#006B3F] dark:text-emerald-400">
                          {lang === 'ga' ? faq.categoryLabelGa : faq.categoryLabelEn}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0A192F] dark:text-white leading-snug">
                        {lang === 'ga' ? faq.questionGa : faq.questionEn}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-xl border border-slate-200 dark:border-[#1E3A5F] flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-200 ${
                        isOpen
                          ? 'rotate-180 bg-[#0A192F] text-[#F7931A] border-[#0A192F]'
                          : 'bg-slate-50 dark:bg-[#0A192F] text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-6 pb-5 pt-1 space-y-4 border-t border-slate-100 dark:border-[#1E3A5F]/60">
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                            {lang === 'ga' ? faq.answerGa : faq.answerEn}
                          </p>

                          {/* Key Takeaway Summary Strip */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0A192F] border border-slate-200/80 dark:border-[#1E3A5F] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="text-xs font-mono text-[#0A192F] dark:text-slate-200">
                              <span className="font-bold text-[#006B3F] dark:text-emerald-400 mr-1.5">
                                {lang === 'ga' ? 'Príomhphointe:' : 'Key Takeaway:'}
                              </span>
                              <span>
                                {lang === 'ga' ? faq.keyTakeawayGa : faq.keyTakeawayEn}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                speakIrishText(
                                  lang === 'ga'
                                    ? `${faq.questionGa}. ${faq.answerGa}`
                                    : `${faq.questionEn}. ${faq.answerEn}`,
                                  lang
                                )
                              }
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A192F] dark:text-slate-200 hover:text-[#F7931A] dark:hover:text-[#F7931A] transition-colors shrink-0 cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
                              <span>
                                {lang === 'ga' ? 'Éist leis an bhfreagra' : 'Listen to answer'}
                              </span>
                            </button>
                          </div>

                          {/* Related Interactive Terms + Deep-Link Action Button */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-semibold text-slate-600 dark:text-slate-300">
                                {lang === 'ga' ? 'Coincheapa gaolmhara:' : 'Core concepts:'}
                              </span>
                              {faq.relatedTerms.map((termKey, idx) => (
                                <React.Fragment key={termKey}>
                                  <TermTooltip termKey={termKey} lang={lang} />
                                  {idx < faq.relatedTerms.length - 1 && (
                                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                                      ·
                                    </span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                onNavigateToPage(faq.targetPage, faq.bitcoinLesson)
                              }
                              className="btn-google-filled h-9 !py-0 !px-4 text-xs w-full sm:w-auto justify-center shrink-0"
                            >
                              <span className="truncate">
                                {lang === 'ga' ? faq.ctaLabelGa : faq.ctaLabelEn}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
