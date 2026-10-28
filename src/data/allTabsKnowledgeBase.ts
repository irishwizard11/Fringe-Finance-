import { DAILY_QUIZ_POOL, getTodayDateKey, getQuestionsForSeed } from './dailyQuizData.ts';

export interface TabKnowledgeGuide {
  tabId: 'bitcoin' | 'budget' | 'tax' | 'security' | 'quiz';
  tabTitleEn: string;
  tabTitleGa: string;
  subTabs: {
    id: string;
    titleEn: string;
    titleGa: string;
    coreDataAndFormulas: Record<string, string | number | string[]>;
    explanationEn: string;
    explanationGa: string;
    exampleCalculationEn: string;
    exampleCalculationGa: string;
  }[];
}

export const ALL_TABS_KNOWLEDGE_BASE: TabKnowledgeGuide[] = [
  {
    tabId: 'budget',
    tabTitleEn: 'Tab 2: Everyday Money, 50/30/20 Budgeting, Inflation & Pensions (PurchasingPowerLab)',
    tabTitleGa: 'Cluaisín 2: Airgead Laethúil, Buiséad 50/30/20, Boilsciú & Pinsin',
    subTabs: [
      {
        id: 'budget_50_30_20',
        titleEn: 'Sub-Tab 1: 50/30/20 Monthly Budget Planner',
        titleGa: 'Fo-Chluaisín 1: Pleanálaí Buiséid Míosúil 50/30/20',
        coreDataAndFormulas: {
          ruleSplit: '50% Essential Needs (Riachtanais), 30% Lifestyle Wants (Mianta), 20% Future Savings/Bitcoin/Pension (Coigiltis & Todhchaí)',
          formulaNeeds: 'Target Needs = Net Monthly Income × 0.50',
          formulaWants: 'Target Wants = Net Monthly Income × 0.30',
          formulaSavings: 'Target Savings & Bitcoin = Net Monthly Income × 0.20',
          defaultExampleIncomeEur: 3500,
          defaultNeedsItems: [
            'Rent / Mortgage (Cíos / Morgáiste): €1,250/mo',
            'Groceries (Earraí Grósaeireachta): €420/mo',
            'Electricity, Heat & Wi-Fi (Leictreachas, Teas & Wi-Fi): €195/mo',
          ],
          defaultWantsItems: [
            'Dining Out, Coffee & Social (Bialanna & Caife): €260/mo',
            'Holidays & Weekend Fund (Ciste Saoire): €180/mo',
          ],
          defaultSavingsItems: [
            'Emergency Savings Account (Ciste Éigeandála): €300/mo',
            'Pension / Long-Term Bitcoin (Pinsean / Bitcoin Fadtéarmach): €250/mo',
          ],
        },
        explanationEn:
          'The 50/30/20 rule is a stress-free way to divide your monthly after-tax (take-home) pay into three clear buckets: 50% for Essential Needs (rent, groceries, utilities), 30% for Lifestyle Wants (dining out, travel, hobbies), and at least 20% for Your Future Self (Emergency Fund, Irish Pension, and long-term Bitcoin self-custody).',
        explanationGa:
          'Is bealach simplí í an riail 50/30/20 chun do phá glan míosúil a roinnt ina thrí chuid: 50% ar Riachtanais (cíos, bia, billí), 30% ar Mhianta (bialanna, laethanta saoire), agus 20% ar Choigiltis don Todhchaí (Ciste Éigeandála, Pinsean, agus Bitcoin fadtéarmach).',
        exampleCalculationEn:
          'On a €3,500 monthly take-home pay: 50% Needs target = €1,750, 30% Wants target = €1,050, and 20% Future Savings target = €700/month (€8,400/year saved).',
        exampleCalculationGa:
          'Ar phá glan €3,500 sa mhí: Sprioc Riachtanas (50%) = €1,750, Sprioc Mianta (30%) = €1,050, agus Sprioc Coigiltis (20%) = €700 sa mhí (€8,400 sa bhliain).',
      },
      {
        id: 'inflation_erosion',
        titleEn: 'Sub-Tab 2: Fiat Inflation & Real Purchasing Power Calculator',
        titleGa: 'Fo-Chluaisín 2: Áireamhán Boilscithe & Cumhacht Cheannaigh Fhíor',
        coreDataAndFormulas: {
          realPurchasingPowerFormula: 'Real Value = Cash / (1 + InflationRate)^Years',
          purchasingPowerLostFormula: 'Purchasing Power Lost = Initial Cash - Real Value',
          ecbTargetInflation: '2.0% per year (though real-world living costs often average 3%–4%+)',
          bitcoinContrast: 'Bitcoin has a strictly fixed 21,000,000 supply cap with a decreasing programmatic issuance rate (~0.83% annual inflation after the April 2024 Halving).',
        },
        explanationEn:
          'Inflation is the quiet rise in prices caused by central banks expanding the currency supply. Even if the Euro balance in your bank account stays at €10,000, rising prices mean that same €10,000 buys fewer groceries, litres of fuel, or months of rent every year.',
        explanationGa:
          'Is éard is Boilsciú ann ná ardú ar phraghsanna de réir mar a chruthaítear níos mó airgid fiat. Fiú má fhanann €10,000 i do chuntas bainc, ceannaíonn an €10,000 sin níos lú earraí gach bliain.',
        exampleCalculationEn:
          'If you leave €10,000 in a 0% cash account with 3.5% annual inflation for 10 years: Real Purchasing Power = €10,000 / (1.035)^10 = €7,089. You silently lose €2,911 in buying power.',
        exampleCalculationGa:
          'Má fhágann tú €10,000 in airgead tirim le boilsciú 3.5% in aghaidh na bliana ar feadh 10 mbliana: Cumhacht Cheannaigh Fhíor = €7,089 (cailltear €2,911 i luach ceannaigh).',
      },
      {
        id: 'pension_boost_100_for_60',
        titleEn: 'Sub-Tab 3: The €100-for-€60 Irish Pension Tax Relief Multiplier',
        titleGa: 'Fo-Chluaisín 3: Treisiú Pinsin na hÉireann (€100 ar Chostas €60)',
        coreDataAndFormulas: {
          standardRateTaxRelief: '20% Income Tax Relief (€100 into pension costs €80 from take-home pay)',
          higherRateTaxRelief: '40% Income Tax Relief (€100 into pension costs only €60 from take-home pay — an instant +66.7% boost)',
          ageRelatedContributionLimitsPctOfEarnings: [
            'Under 30: up to 15% of net relevant earnings',
            'Age 30–39: up to 20% of net relevant earnings',
            'Age 40–49: up to 25% of net relevant earnings',
            'Age 50–54: up to 30% of net relevant earnings',
            'Age 55–59: up to 35% of net relevant earnings',
            'Age 60+: up to 40% of net relevant earnings (subject to €115,000 annual earnings cap)',
          ],
          taxFreeCompounding: 'Pension funds grow 100% free of CGT and DIRT until retirement.',
        },
        explanationEn:
          'In Ireland, personal pension contributions (PRSA, Occupational Pension, or AVC) receive Marginal Rate Income Tax Relief. If you pay the 40% higher income tax rate, putting €300 into your pension only reduces your net take-home pay by €180 because Revenue refunds €120 in income tax immediately.',
        explanationGa:
          'In Éirinn, faigheann ranníocaíochtaí pinsin Faoiseamh Cánach Ioncaim ag do ráta imeallach. Má íocann tú an ráta 40%, ní chosnaíonn €300 i do phinsean ach €180 as do phóca féin.',
        exampleCalculationEn:
          'Contributing €300/month gross at the 40% tax band costs you €180/month net (€120/month tax saved). At a 7% annual return over 20 years, that grows to ~€147,584.',
        exampleCalculationGa:
          'Cosnaíonn €300/mí i bpinsean ag an ráta 40% díreach €180/mí ort féin, agus fásann sé go ~€147,584 thar 20 bliain ag 7% sa bhliain.',
      },
    ],
  },
  {
    tabId: 'tax',
    tabTitleEn: 'Tab 3: Growing Wealth, Emergency Funds, Compounding & Cash-Back Reliefs (TaxNavigator)',
    tabTitleGa: 'Cluaisín 3: Fás Saibhris, Ciste Éigeandála, Ús Iolraithe & Airgead Ar Ais',
    subTabs: [
      {
        id: 'foundations_money_ladder',
        titleEn: 'Sub-Tab 1: The 4-Step Money Ladder & Emergency Fund Builder',
        titleGa: 'Fo-Chluaisín 1: An Dréimire Airgeadais 4-Chéim & Áireamhán Ciste Éigeandála',
        coreDataAndFormulas: {
          fourStepMoneyLadder: [
            'Step 1: Build a 3 to 6 Month Emergency Fund (Ciste Éigeandála) in instant-access cash so you never have to sell long-term Bitcoin or investments in a crisis.',
            'Step 2: Clear High-Interest Consumer Debt (Credit cards charging 18%–22% APR and personal loans).',
            'Step 3: Claim Instant Cash Back & Employer Pension Match (Rent Tax Credit €1,000, GP 20% refund, and 40% pension tax relief).',
            'Step 4: Invest Consistently for the Long Term (Dollar-Cost Averaging into Bitcoin self-custody and diversified long-term assets).',
          ],
          emergencyFundFormula: 'Target Emergency Cushion = Monthly Essential Expenses × Target Months (3 to 6 months)',
        },
        explanationEn:
          'Before investing aggressively, every household needs a 3–6 month Emergency Safety Net covering essential bills (rent, food, utilities). Having liquid cash prevents you from ever being forced to sell long-term Bitcoin during a temporary market dip or car repair emergency.',
        explanationGa:
          'Sula ndéantar infheistíocht fhadtéarmach, teastaíonn Ciste Éigeandála 3 go 6 mhí uait chun billí riachtanacha a chlúdach ionas nach mbeidh ort do chuid Bitcoin a dhíol go tobann.',
        exampleCalculationEn:
          'If your essential monthly expenses are €1,600 and you want a 3-month buffer, your Emergency Fund target is €4,800 (or €9,600 for a 6-month fortress buffer).',
        exampleCalculationGa:
          'Má tá do chostais riachtanacha €1,600 sa mhí, is é €4,800 do sprioc do Chiste Éigeandála 3 mhí (nó €9,600 do 6 mhí).',
      },
      {
        id: 'compounding_and_irish_investment_tax',
        titleEn: 'Sub-Tab 2: Compound Growth Simulator & Irish Investment Tax Comparison (DIRT vs CGT vs ETF Exit Tax)',
        titleGa: 'Fo-Chluaisín 2: Simléir Fáis Iolraithe & Comparáid Cánach (DIRT vs CGC vs Cistí ETF)',
        coreDataAndFormulas: {
          compoundFormula: 'Future Value = Principal × (1 + r)^t + AnnualContribution × (((1 + r)^t - 1) / r)',
          dirtBankSavingsTax: '33% DIRT (Deposit Interest Retention Tax) deducted automatically on bank deposit interest.',
          cgtBitcoinAndSharesTax: '33% CGT (Capital Gains Tax) on realized profits ONLY when sold/disposed, with a €1,270 tax-free annual profit exemption every calendar year.',
          etfOffshoreFundExitTax: '41% Exit Tax on ETFs / Managed Funds with no €1,270 exemption and an 8-year Deemed Disposal rule (taxed every 8 years even if you do not sell).',
        },
        explanationEn:
          'Compound growth ("interest on interest") turns small, steady monthly contributions into substantial long-term wealth. In Ireland, holding Bitcoin or individual shares directly is taxed under the 33% Capital Gains Tax (CGT) regime—meaning zero tax while holding, no 8-year deemed disposal rule, and your first €1,270 of realized profit each year is 100% tax-free.',
        explanationGa:
          'Ciallaíonn Fás Iolraithe go dtuilleann do bhrabús brabús breise gach bliain. In Éirinn, gearrtar 33% CGC ar Bitcoin agus scaireanna nuair a dhíoltar iad amháin (le díolúine €1,270 sa bhliain), murab ionann agus 33% DIRT ar bhainc nó 41% ar chistí ETF gach 8 mbliana.',
        exampleCalculationEn:
          'Starting with €5,000 + €150/month for 10 years (€23,000 total put in) at 7% annual growth reaches ~€34,741 gross (+€11,741 profit). After the €1,270 annual CGT exemption and 33% CGT, you keep ~€31,286 net.',
        exampleCalculationGa:
          'Le €5,000 tosaigh + €150/mí ar feadh 10 mbliana (€23,000 curtha isteach) ag 7% sa bhliain, fásann sé go ~€34,741 comhlán (~€31,286 glan tar éis díolúine €1,270 agus 33% CGC).',
      },
      {
        id: 'paye_cashback_reliefs',
        titleEn: 'Sub-Tab 3: Easy Irish PAYE Cash-Back Checklist (Rent, GP/Medical, Remote Work & Family)',
        titleGa: 'Fo-Chluaisín 3: Liosta Seiceála Airgead Ar Ais PAYE (Cíos, Dochtúir, Obair ón mBaile)',
        coreDataAndFormulas: {
          rentTaxCredit: 'Up to €1,000/year back for single renters or €2,000/year for jointly assessed couples via Revenue myAccount.',
          healthExpensesRelief: '20% cash refund on non-reimbursed GP visits, prescriptions, physiotherapy, laser eye surgery, and non-routine dental care (Med 2).',
          remoteWorkingRelief: '30% of home electricity, heating, and broadband bills apportioned by the number of days worked from home, taxed back at your marginal rate.',
          homeCarerTaxCredit: 'Up to €1,950/year for married/civil-partnered couples where one spouse cares for children or a dependent relative at home.',
          fourYearLookbackRule: 'You can claim unclaimed Irish PAYE tax reliefs for the previous 4 calendar years inside Revenue myAccount.',
        },
        explanationEn:
          'Hundreds of thousands of workers in Ireland leave €500 to €2,170+ on the table every year simply because they haven’t ticked their eligible reliefs inside Revenue myAccount. Claiming takes 5 minutes online and refunds are paid directly to your bank IBAN.',
        explanationGa:
          'Fágann na mílte oibrí in Éirinn idir €500 agus €2,170+ gan éileamh gach bliain. Is féidir Creidmheas Cíosa (€1,000), billí dochtúra (20%), agus billí oibre ón mbaile (30%) a éileamh ar líne ar Revenue myAccount.',
        exampleCalculationEn:
          'A renter claiming the €1,000 Rent Credit + €340 medical refund + €180 remote working relief recovers €1,520 in cash—which can immediately fund their Emergency Safety Net or long-term Bitcoin savings.',
        exampleCalculationGa:
          'Faigheann tionónta a éilíonn Creidmheas Cíosa (€1,000) + aisíoc leighis (€340) + obair ón mbaile (€180) €1,520 ar ais díreach isteach ina chuntas bainc.',
      },
    ],
  },
  {
    tabId: 'security',
    tabTitleEn: 'Tab 4: Wallet & Scam Defense — “Is It a Scam?” Threat Simulator (ScamRadar)',
    tabTitleGa: 'Cluaisín 4: Cosaint Sparáin & Radar Scaimeanna (“An Scaim É?”)',
    subTabs: [
      {
        id: 'scam_scenarios_and_red_flags',
        titleEn: '4 Real-World Irish Financial & Bitcoin Threat Scenarios',
        titleGa: '4 Chás Fíor maidir le Scaimeanna Airgeadais & Bitcoin in Éirinn',
        coreDataAndFormulas: {
          scenario1Smishing:
            'Revenue / An Post Smishing SMS (+353 87... fake link "myaccount-revenue-ie-portal.com" demanding IBAN/PIN before midnight). Verdict: 100% SCAM.',
          scenario2PigButchering:
            'WhatsApp / Telegram "AI Arbitrage VIP Club" promising guaranteed 4.5% daily returns and demanding a 20% upfront "Release Tax" in BTC to withdraw profits. Verdict: 100% SCAM.',
          scenario3SeedPhishing:
            'Fake Hardware Wallet USB Firmware Pop-up asking you to type your 24-word recovery seed phrase into a computer web browser. Verdict: 100% SCAM.',
          scenario4LegitimateNotice:
            'Official no-reply@revenue.ie notification with NO clickable links instructing you to open your browser independently and sign in at revenue.ie. Verdict: LEGITIMATE.',
          fourGoldenSecurityRules: [
            'Rule 1 (Hardware Wallet Isolation): Never type, photograph, or cloud-save your 12 or 24 recovery words on any phone or computer.',
            'Rule 2 (No Upfront Unlock Fees): Legitimate exchanges and Revenue never ask you to deposit extra Bitcoin or pay a "release fee" to withdraw your own funds.',
            'Rule 3 (Verify Central Bank Register): Check registers.centralbank.ie for MiCA VASP / regulated authorisation before using any financial firm.',
            'Rule 4 (Zero Clickable SMS Links): Revenue.ie, An Post, and Irish banks never send clickable SMS links to claim refunds or reset PINs.',
          ],
        },
        explanationEn:
          'Even the best Bitcoin and savings plan can be wiped out in 30 seconds by a phishing attack. ScamRadar trains users to spot the three most common attacks in Ireland: SMS smishing links, WhatsApp/Telegram "guaranteed daily return" pig-butchering groups, and fake hardware wallet pop-ups asking for your 12/24-word seed phrase.',
        explanationGa:
          'Múineann Radar Slándála duit conas na trí ionsaí is coitianta in Éirinn a aithint: téacsanna bréige SMS (Smishing), grúpaí infheistíochta bréige ar WhatsApp/Telegram, agus preabfhuinneoga a iarrann do Fhrása Síol 12 nó 24 focal.',
        exampleCalculationEn:
          'A scammer promising "4.5% guaranteed daily profit" is claiming (1.045)^365 ≈ 9,380,000x per year—a mathematical impossibility that immediately proves the platform is a pig-butchering trap.',
        exampleCalculationGa:
          'Is ionann "brabús ráthaithe 4.5% sa lá" agus ardú dodhéanta matamaiticiúil—cruthúnas láithreach gur scaim é.',
      },
    ],
  },
  {
    tabId: 'quiz',
    tabTitleEn: 'Tab 5: Competitive Daily Quiz Arena & Multi-User Leaderboard (DailyQuizArena)',
    tabTitleGa: 'Cluaisín 5: Aréine Tráth na gCeist Laethúil & Clár na gCeannairí',
    subTabs: [
      {
        id: 'daily_quiz_mechanics_and_questions',
        titleEn: 'Daily Seeded Challenge, Game Mechanics, Lifelines & Question Bank',
        titleGa: 'Dúshlán Laethúil, Rialacha an Chluiche, Cumhachtaí & Banc Ceisteanna',
        coreDataAndFormulas: {
          todayDateKey: getTodayDateKey(),
          questionsPerRound: 5,
          timerPerQuestionSeconds: 15,
          livesHeartsPerRound: 3,
          basePointsPerCorrectAnswer: 100,
          maxSpeedBonusPerQuestion: '+75 pts (5 pts per remaining second on the 15s clock)',
          comboMultiplierProgression: '1x → 1.5x → 2x → 2.5x → 3x for consecutive correct answers',
          lifelinesAvailable: [
            '50/50 Eliminate Two (Removes two incorrect options once per match)',
            '2x Score Boost (Doubles all points and speed bonus earned on the current question)',
          ],
          championBadgeReward: 'Unlock "Daily Quiz Champion (Curadh Tráth na gCeist)" (+300 bonus XP) by scoring at least 4/5 in the Daily Quiz Arena.',
          todaySeededQuestionTopics: getQuestionsForSeed(getTodayDateKey()).map(
            (q, idx) => `Q${idx + 1}: ${q.questionEn} (Base Points: +${q.xpBase})`
          ),
          totalQuestionBankSize: DAILY_QUIZ_POOL.length,
        },
        explanationEn:
          'The Daily Quiz Arena generates a deterministic 5-question challenge every day so all learner profiles compete on the exact same questions across Bitcoin, Satoshi’s Whitepaper, Everyday Money, and Scam Security. Players race against a 15-second clock with 3 hearts, combo multipliers up to 3x, and 50/50 + 2x Boost power-ups.',
        explanationGa:
          'Cruthaíonn Aréine Tráth na gCeist Laethúil dúshlán 5 cheist gach lá ionas go mbíonn gach foghlaimeoir san iomaíocht ar na ceisteanna céanna le clog 15 soicind, 3 chroí, iolraitheoir teaglama suas le 3x, agus cumhachtaí 50/50 & 2x.',
        exampleCalculationEn:
          'Answering with 12 seconds left on a 2x Combo with the 2x Power-Up active awards: (100 base + 60 speed bonus) × 2.0 combo × 2 power-up = 640 points on a single question!',
        exampleCalculationGa:
          'Má fhreagraíonn tú le 12 shoicind fágtha ar iolraitheoir 2x leis an gcumhacht 2x gníomhach, gheobhaidh tú 640 pointe ar cheist amháin!',
      },
    ],
  },
];
