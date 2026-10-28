export interface BitcoinKnowledgeItem {
  id: string;
  category:
    | 'monetary_properties'
    | 'whitepaper_mechanics'
    | 'halving_issuance'
    | 'self_custody_wallets'
    | 'lightning_scaling'
    | 'nodes_mining'
    | 'history_milestones'
    | 'irish_tax_security';
  topicEn: string;
  topicGa: string;
  keyMetrics: Record<string, string | number>;
  explanationEn: string;
  explanationGa: string;
  beginnerAnalogyEn: string;
  beginnerAnalogyGa: string;
}

export const BITCOIN_CORE_METRICS = {
  ticker: 'BTC',
  smallestUnit: '1 Satoshi (sat) = 0.00000001 BTC (100,000,000 sats per 1 BTC)',
  maxSupplyHardCap: '21,000,000 BTC (Strictly enforced by consensus code)',
  whitepaperPublishedDate: 'October 31, 2008 (Satoshi Nakamoto)',
  genesisBlockDate: 'January 3, 2009 (Block 0)',
  genesisBlockHeadline: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks',
  consensusAlgorithm: 'Proof-of-Work (PoW) using SHA-256 cryptographic hashing',
  targetBlockTime: '10 minutes (~144 blocks per day)',
  difficultyAdjustmentInterval: 'Every 2,016 blocks (~2 weeks / 14 days)',
  halvingIntervalBlocks: 'Every 210,000 blocks (~4 years)',
  currentBlockSubsidy2024To2028: '3.125 BTC per block (after the 4th Halving on April 20, 2024 at Block 840,000)',
  estimatedFinalBitcoinMinedYear: '~2140 (when subsidy drops below 1 satoshi and miners earn 100% transaction fees)',
  layer2ScalingProtocol: 'Lightning Network (Instant, sub-second, near-zero fee off-chain payment channels)',
  seedPhraseStandard: 'BIP-39 (12 or 24 recovery words from a standardized 2,048-word dictionary)',
  hierarchicalDeterministicStandard: 'BIP-32 / BIP-44 / BIP-84 (Native SegWit bc1q... and Taproot bc1p... addresses)',
};

export const BITCOIN_HALVING_SCHEDULE = [
  {
    era: 'Genesis Era (Launch)',
    blockHeight: 0,
    date: 'Jan 3, 2009',
    blockRewardBtc: 50,
    dailyIssuanceBtc: 7200,
    percentSupplyMinedAtEnd: '50% (10,500,000 BTC)',
  },
  {
    era: '1st Halving',
    blockHeight: 210000,
    date: 'Nov 28, 2012',
    blockRewardBtc: 25,
    dailyIssuanceBtc: 3600,
    percentSupplyMinedAtEnd: '75% (15,750,000 BTC)',
  },
  {
    era: '2nd Halving',
    blockHeight: 420000,
    date: 'Jul 9, 2016',
    blockRewardBtc: 12.5,
    dailyIssuanceBtc: 1800,
    percentSupplyMinedAtEnd: '87.5% (18,375,000 BTC)',
  },
  {
    era: '3rd Halving',
    blockHeight: 630000,
    date: 'May 11, 2020',
    blockRewardBtc: 6.25,
    dailyIssuanceBtc: 900,
    percentSupplyMinedAtEnd: '93.75% (19,687,500 BTC)',
  },
  {
    era: '4th Halving (Current Era)',
    blockHeight: 840000,
    date: 'Apr 20, 2024',
    blockRewardBtc: 3.125,
    dailyIssuanceBtc: 450,
    percentSupplyMinedAtEnd: '96.875% (20,343,750 BTC)',
  },
  {
    era: '5th Halving (Next)',
    blockHeight: 1050000,
    date: '~Spring 2028',
    blockRewardBtc: 1.5625,
    dailyIssuanceBtc: 225,
    percentSupplyMinedAtEnd: '98.4375% (20,671,875 BTC)',
  },
];

export const BITCOIN_ENCYCLOPEDIA: BitcoinKnowledgeItem[] = [
  {
    id: 'btc-scarcity-21m',
    category: 'monetary_properties',
    topicEn: 'The 21 Million Hard Cap & Digital Scarcity',
    topicGa: 'Teorainn Dhocht 21 Milliún & Ganntanas Digiteach',
    keyMetrics: {
      hardCap: '21,000,000 BTC',
      satsPerBtc: '100,000,000 satoshis',
      alreadyMinedPct: '~94%+',
    },
    explanationEn:
      'Bitcoin is the first digital asset in history with absolute, mathematically verifiable scarcity. Every full node on the network enforces the rule that no more than 21,000,000 BTC can ever be created. Each Bitcoin is divisible into 100,000,000 smaller units called Satoshis (sats), so anyone can buy €5 or €10 worth of Bitcoin.',
    explanationGa:
      'Is é Bitcoin an chéad sócmhainn dhigiteach sa stair a bhfuil ganntanas matamaiticiúil dearbhaithe aici. Cuireann gach nód ar an líonra i bhfeidhm nach féidir níos mó ná 21,000,000 BTC a chruthú go deo. Is féidir gach Bitcoin a roinnt ina 100,000,000 cuid bheag darbh ainm Satoshis (sats).',
    beginnerAnalogyEn:
      'If Euros are like concert tickets where the organizer can print unlimited extra tickets at any time, Bitcoin is like a stadium with strictly 21 million seats bolted into mathematical stone.',
    beginnerAnalogyGa:
      'Má tá an Euro cosúil le ticéid ar féidir níos mó díobh a phriontáil am ar bith, tá Bitcoin cosúil le staidiam ina bhfuil díreach 21 milliún suíochán greanta i gcloch.',
  },
  {
    id: 'btc-utxo-signatures',
    category: 'whitepaper_mechanics',
    topicEn: 'How Bitcoin Transactions Work (UTXOs & Digital Signatures)',
    topicGa: 'Conas a Oibríonn Idirbhearta Bitcoin (UTXO & Sínithe Digiteacha)',
    keyMetrics: {
      whitepaperSection: 'Section 2 & Section 9',
      cryptography: 'ECDSA (secp256k1) & Schnorr Signatures (Taproot)',
      addressPrefixes: 'bc1q (SegWit), bc1p (Taproot), 3 (Script), 1 (Legacy)',
    },
    explanationEn:
      'Bitcoin does not use account balances like a bank spreadsheet. Instead, it uses Unspent Transaction Outputs (UTXOs)—digital "cash notes" of specific amounts locked to your public address. When you send Bitcoin, your wallet selects one or more UTXOs, signs them with your Private Key, sends the payment amount to the recipient, and returns the "change" to a fresh address in your wallet.',
    explanationGa:
      'Ní úsáideann Bitcoin iarmhéideanna cuntais cosúil le banc. Ina áit sin, úsáideann sé UTXOanna—cosúil le nótaí airgid digiteacha atá glasáilte le do sheoladh poiblí. Nuair a sheolann tú Bitcoin, síníonn do sparán an t-idirbheart le d’Eochair Phríobháideach agus cuireann sé an tsóinseáil ar ais chugat.',
    beginnerAnalogyEn:
      'Paying with Bitcoin UTXOs is just like paying for a €4 coffee with a €10 note: you hand over the €10 note, €4 goes to the café, and €6 comes back to your wallet as a new €6 note.',
    beginnerAnalogyGa:
      'Tá sé díreach cosúil le caife €4 a cheannach le nóta €10: tugann tú an nóta €10 uait, téann €4 chuig an gcaifé, agus tagann nóta nua €6 ar ais i do sparán.',
  },
  {
    id: 'btc-pow-difficulty',
    category: 'nodes_mining',
    topicEn: 'Proof-of-Work (PoW), SHA-256 Mining & Difficulty Adjustment',
    topicGa: 'Cruthúnas Oibre (PoW), Mianadóireacht SHA-256 & Coigeartú Deacrachta',
    keyMetrics: {
      whitepaperSection: 'Section 4 & Section 11',
      hashFunction: 'SHA-256',
      blockInterval: '10 minutes',
      adjustmentCycle: '2,016 blocks (~14 days)',
    },
    explanationEn:
      'Miners bundle pending transactions from the mempool into a candidate block and race to find a number (nonce) that produces a SHA-256 hash starting with many zeros. Finding this hash requires real electricity and hardware work, but any node can verify the answer in a millisecond. Every 2,016 blocks (~2 weeks), Bitcoin automatically adjusts the puzzle difficulty so blocks continue arriving roughly every 10 minutes regardless of how many miners join or leave.',
    explanationGa:
      'Cruinníonn mianadóirí idirbhearta i mbloc agus bíonn siad san iomaíocht chun tomhas cripteagrafach SHA-256 a réiteach. Cosnaíonn sé seo fuinneamh fíor, ach is féidir le haon nód an freagra a sheiceáil láithreach. Gach 2,016 bloc (~2 sheachtain), coigeartaíonn Bitcoin an deacracht go huathoibríoch chun am 10 nóiméad an bhloic a choinneáil.',
    beginnerAnalogyEn:
      'Proof-of-Work is like a massive Sudoku puzzle: it takes huge effort to solve, but anyone can check that the completed grid is correct in two seconds. The difficulty adjustment is like a thermostat that keeps the block clock steady at 10 minutes.',
    beginnerAnalogyGa:
      'Tá Cruthúnas Oibre cosúil le puzal Sudoku: tógann sé obair mhór é a réiteach, ach is féidir le duine ar bith a sheiceáil go bhfuil sé ceart i dhá shoicind.',
  },
  {
    id: 'btc-nodes-vs-miners',
    category: 'nodes_mining',
    topicEn: 'Full Nodes vs. Miners (Who Enforces Bitcoin’s Rules?)',
    topicGa: 'Nóid Iomlána vs. Mianadóirí (Cé a Chuireann na Rialacha i bhFeidhm?)',
    keyMetrics: {
      whitepaperSection: 'Section 5, Section 7 & Section 8 (SPV)',
      nodeCost: 'Runs on a Raspberry Pi or home laptop (~€150)',
      merkleTreeRole: 'Allows SPV mobile wallets to verify payments without full blockchain',
    },
    explanationEn:
      'A common misconception is that miners control Bitcoin. In reality, Miners only order transactions and propose blocks, while Full Nodes (run by everyday citizens on home computers) independently audit every block against the consensus rules (such as the 21M cap and valid signatures). If a miner ever tried to create 22 million BTC or spend someone else’s coins, every full node would immediately reject the block.',
    explanationGa:
      'Ceapann daoine uaireanta go rialaíonn mianadóirí Bitcoin. I ndáiríre, ní dhéanann mianadóirí ach bloic a mholadh, ach déanann Nóid Iomlána (ar ríomhairí baile gnáthdhaoine) gach bloc a iniúchadh. Dá ndéanfadh mianadóir iarracht boinn bhréige a chruthú, dhiúltódh na nóid don bhloc láithreach.',
    beginnerAnalogyEn:
      'Miners are like security guards sealing bricks into a wall, while Full Nodes are the referees and auditors who check every single brick and reject anything that breaks the rulebook.',
    beginnerAnalogyGa:
      'Is iad na mianadóirí na tógálaithe a chuireann brící sa bhalla, ach is iad na Nóid Iomlána na réiteoirí a sheiceálann gach uile bhríce.',
  },
  {
    id: 'btc-self-custody-seed',
    category: 'self_custody_wallets',
    topicEn: 'Self-Custody, Private Keys, BIP-39 Seed Phrases & Hardware Wallets',
    topicGa: 'Féin-Choinneáil, Eochracha Príobháideacha, Frása Síol 12/24 Focal & Sparáin Chrua-Earraí',
    keyMetrics: {
      seedStandard: 'BIP-39 (12 or 24 words)',
      securityRule1: 'Never photograph or type seed words on a computer/phone',
      securityRule2: 'Not your keys, not your coins',
    },
    explanationEn:
      'Leaving Bitcoin on an exchange means the exchange holds the Private Keys—you only have an IOU. With Self-Custody, you generate your own Private Key (represented as a human-readable 12-word or 24-word BIP-39 Seed Phrase). A Hardware Wallet (Cold Storage) is a dedicated offline device that signs transactions internally so your private keys never touch an internet-connected phone or computer.',
    explanationGa:
      'Má fhágann tú Bitcoin ar mhalartán, is leis an malartán na heochracha. Le Féin-Choinneáil, gintear Frása Síol 12 nó 24 focal duit féin. Coinníonn Sparán Crua-Earraí (Stóráil Fhuar) d’eochair phríobháideach go hiomlán as líne.',
    beginnerAnalogyEn:
      'An exchange account is like leaving gold in someone else’s locker; a hardware wallet is your own home safe, and the 12-word seed phrase is the master blueprint that can rebuild that safe anywhere in the world if you lose the device.',
    beginnerAnalogyGa:
      'Tá sparán crua-earraí cosúil le do thaisceadán pearsanta féin sa bhaile, agus is é an Frása Síol 12 fhocal an máistir-eochair a thugann do chuid airgid ar ais má chailltear an gléas.',
  },
  {
    id: 'btc-lightning-network',
    category: 'lightning_scaling',
    topicEn: 'The Lightning Network (Layer 2 Instant Payments)',
    topicGa: 'An Líonra Lightning (Íocaíochtaí Láithreacha Sraith 2)',
    keyMetrics: {
      settlementSpeed: 'Milliseconds (< 1 second)',
      typicalFee: '< €0.01 (fractions of a cent / a few satoshis)',
      architecture: 'Layer 2 bi-directional multi-sig payment channels anchored to Bitcoin Layer 1',
    },
    explanationEn:
      'Because Bitcoin’s main blockchain (Layer 1) prioritizes maximum decentralization and security with ~10-minute blocks, it isn’t meant for buying a €3.50 coffee on-chain. The Lightning Network (Layer 2) lets users open payment channels secured by real Bitcoin smart contracts, enabling millions of instant, sub-cent payments per second without waiting for block confirmations.',
    explanationGa:
      'Ós rud é go dtógann bloc ar phríomh-bhlocshlabhra Bitcoin ~10 nóiméad, úsáidtear an Líonra Lightning (Sraith 2) le haghaidh íocaíochtaí laethúla. Ligeann sé duit íoc as caife nó earraí i milleasoicindí ar chostas codán de chéint.',
    beginnerAnalogyEn:
      'Bitcoin Layer 1 is like a high-security armored bullion truck for final settlement; the Lightning Network is like a bar tab or contactless debit card backed 1-for-1 by the gold in that vault.',
    beginnerAnalogyGa:
      'Tá Sraith 1 Bitcoin cosúil le trucail armúrtha óir le haghaidh coigiltis mhóra; tá Lightning cosúil le cárta tadhaill láithreach le haghaidh caife.',
  },
  {
    id: 'btc-irish-tax-and-safety',
    category: 'irish_tax_security',
    topicEn: 'Bitcoin Rules in Ireland (33% CGT, €1,270 Exemption & Scam Defense)',
    topicGa: 'Rialacha Bitcoin in Éirinn (33% CGC, Díolúine €1,270 & Cosaint ar Scaimeanna)',
    keyMetrics: {
      irishCgtRate: '33%',
      annualTaxFreeGainExemption: '€1,270 per person (non-transferable)',
      holdingTax: '€0 (No tax while buying and holding in a wallet)',
      taxableEvents: 'Selling BTC for EUR, swapping BTC for another crypto token, or spending BTC on goods/services',
    },
    explanationEn:
      'In Ireland, buying and holding Bitcoin (or transferring it between your own exchange account and your personal hardware wallet) is NOT a taxable event. Capital Gains Tax (33% CGT) only applies when you dispose of Bitcoin (sell for Euro, swap for another coin, or spend it) and realize a net profit above the €1,270 annual personal exemption.',
    explanationGa:
      'In Éirinn, níl aon cháin le híoc nuair a cheannaíonn tú Bitcoin ná nuair a aistríonn tú chuig do sparán féin é. Ní bhaineann Cáin Ghnóthachan Caipitil (33% CGC) ach le díol, babhtáil, nó caitheamh Bitcoin nuair a bhíonn do bhrabús glan os cionn €1,270 sa bhliain.',
    beginnerAnalogyEn:
      'Holding Bitcoin is like owning a painting in your house—you pay zero tax while it hangs on your wall. You only calculate 33% tax on the profit above €1,270 in the year you actually sell or trade it.',
    beginnerAnalogyGa:
      'Níl aon cháin ort fad is a choinníonn tú Bitcoin i do sparán—ní ríomhtar 33% CGC ach ar an mbrabús os cionn €1,270 nuair a dhíolann nó a bhabhtálann tú é.',
  },
];
