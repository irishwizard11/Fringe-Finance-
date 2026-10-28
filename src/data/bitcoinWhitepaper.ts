export interface WhitepaperSection {
  id: string;
  sectionNumber: string;
  titleEn: string;
  titleGa: string;
  originalTextEn: string;
  originalTextGa: string;
  plainSummaryEn: string;
  plainSummaryGa: string;
  keyTermGa: string;
  keyTermEn: string;
}

export const BITCOIN_WHITEPAPER_METADATA = {
  titleEn: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
  titleGa: 'Bitcoin: Córas Airgid Leictreonaigh Piara-go-Piara',
  author: 'Satoshi Nakamoto',
  dateEn: 'October 31, 2008',
  dateGa: '31 Deireadh Fómhair 2008',
  email: 'satoshin@gmx.com · www.bitcoin.org',
  abstractEn:
    'A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution. Digital signatures provide part of the solution, but the main benefits are lost if a trusted third party is still required to prevent double-spending. We propose a solution to the double-spending problem using a peer-to-peer network. The network timestamps transactions by hashing them into an ongoing chain of hash-based proof-of-work, forming a record that cannot be changed without redoing the proof-of-work.',
  abstractGa:
    'Thabharfadh leagan piara-go-piara (peer-to-peer) d’airgead leictreonach deis íocaíochtaí ar líne a sheoladh go díreach ó pháirtí amháin go páirtí eile gan dul trí institiúid airgeadais. Soláthraíonn sínithe digiteacha cuid den réiteach, ach cailltear na príomhbhuntáistí má bhíonn tríú páirtí iontaofa fós ag teastáil chun caitheamh dúbailte (double-spending) a chosc. Molaimid réiteach ar fhadhb an chaiteachais dhúbailte trí úsáid a bhaint as líonra piara-go-piara. Cuireann an líonra stampa ama ar idirbhearta trína haisliú (hashing) isteach i slabhra leanúnach de chruthúnas oibre (Proof-of-Work), rud a chruthaíonn taifead nach féidir a athrú gan an cruthúnas oibre a dhéanamh arís.',
  plainAbstractEn:
    'Before Bitcoin, sending money online always required a bank or payment company in the middle to keep track of balances. Satoshi Nakamoto solved how two strangers anywhere on Earth can send digital cash directly to each other—just like handing over a physical coin—using a public, tamper-proof ledger maintained by thousands of independent computers.',
  plainAbstractGa:
    'Roimh Bitcoin, bhí banc nó comhlacht íocaíochta i gcónaí ag teastáil chun airgead a sheoladh ar líne. Fuair Satoshi Nakamoto amach conas is féidir le beirt ar bith airgead digiteach a sheoladh go díreach chuig a chéile—díreach mar a thabharfá bonn airgid do dhuine—trí mhórleabhar poiblí nach féidir a athrú.',
};

export const BITCOIN_WHITEPAPER_SECTIONS: WhitepaperSection[] = [
  {
    id: 'sec-1',
    sectionNumber: '1',
    titleEn: 'Introduction',
    titleGa: 'Réamhrá',
    originalTextEn:
      'Commerce on the Internet has come to rely almost exclusively on financial institutions serving as trusted third parties to process electronic payments. While the system works well enough for most transactions, it still suffers from the inherent weaknesses of the trust based model. Completely non-reversible transactions are not really possible, since financial institutions cannot avoid mediating disputes. What is needed is an electronic payment system based on cryptographic proof instead of trust, allowing any two willing parties to transact directly with each other without the need for a trusted third party.',
    originalTextGa:
      'Tá tráchtáil ar an Idirlíon ag brath beagnach go hiomlán ar institiúidí airgeadais a fheidhmíonn mar thríú páirtithe iontaofa chun íocaíochtaí leictreonacha a phróiseáil. Cé go n-oibríonn an córas go maith don chuid is mó d’idirbhearta, tá laigí bhunúsacha an mhúnla iontaobhais fós ag baint leis. Is é atá ag teastáil ná córas íocaíochta leictreonach atá bunaithe ar chruthúnas cripteagrafach in ionad muiníne, a ligeann d’aon dá pháirtí idirbheart a dhéanamh go díreach le chéile gan gá le tríú páirtí.',
    plainSummaryEn:
      'Traditional online payments rely on trusting banks and middlemen, which adds costs, delays, and account freezes. Bitcoin replaces "trusting a middleman" with mathematical proof ("verify, don’t trust").',
    plainSummaryGa:
      'Braitheann gnáth-íocaíochtaí ar líne ar mhuinín i mbainc. Cuireann Bitcoin cruthúnas matamaiticiúil in ionad idirghabhálaithe ionas gur féidir le daoine airgead a sheoladh go díreach.',
    keyTermGa: 'Cruthúnas Cripteagrafach',
    keyTermEn: 'Cryptographic Proof',
  },
  {
    id: 'sec-2',
    sectionNumber: '2',
    titleEn: 'Transactions',
    titleGa: 'Idirbhearta',
    originalTextEn:
      'We define an electronic coin as a chain of digital signatures. Each owner transfers the coin to the next by digitally signing a hash of the previous transaction and the public key of the next owner and adding these to the end of the coin. A payee can verify the signatures to verify the chain of ownership. The only way to confirm the absence of a transaction is to be aware of all transactions.',
    originalTextGa:
      'Sainmhínímid bonn leictreonach mar shlabhra de shínithe digiteacha. Aistríonn gach úinéir an bonn chuig an gcéad úinéir eile trí shíniú digiteach a chur le hais an idirbhirt roimhe sin agus eochair phoiblí an chéad úinéara eile. Is féidir leis an bhfaighteoir na sínithe a fhíorú chun slabhra na húinéireachta a dheimhniú. Is é an t-aon bhealach chun a dheimhniú nár caitheadh an bonn cheana ná gach idirbheart a bheith feicthe ag an líonra.',
    plainSummaryEn:
      'A Bitcoin isn’t a file stored on your phone—it is a verified history of ownership recorded on a shared public ledger. You unlock and send your Bitcoin using your private digital signature.',
    plainSummaryGa:
      'Ní comhad ar do ghuthán é Bitcoin—is slabhra de shínithe digiteacha é ar mhórleabhar poiblí. Úsáideann tú d’eochair phríobháideach chun é a sheoladh.',
    keyTermGa: 'Síniú Digiteach',
    keyTermEn: 'Digital Signature',
  },
  {
    id: 'sec-3',
    sectionNumber: '3',
    titleEn: 'Timestamp Server',
    titleGa: 'Freastalaí Stampa Ama',
    originalTextEn:
      'The solution we propose begins with a timestamp server. A timestamp server works by taking a hash of a block of items to be timestamped and widely publishing the hash. The timestamp proves that the data must have existed at the time, obviously, in order to get into the hash. Each timestamp includes the previous timestamp in its hash, forming a chain, with each additional timestamp reinforcing the ones before it.',
    originalTextGa:
      'Tosaíonn an réiteach a mholaimid le freastalaí stampa ama. Oibríonn sé trí hais (hash) de bhloc míreanna a ghlacadh agus an hais sin a fhoilsiú go forleathan. Cruthaíonn an stampa ama go raibh na sonraí ann ag an am sin. Cuimsíonn gach stampa ama an stampa ama roimhe sin ina hais féin, ag cruthú slabhra (blocshlabhra), ina neartaíonn gach bloc nua na bloic roimhe.',
    plainSummaryEn:
      'Transactions are grouped into "blocks" and stamped with the exact time. Each new block locks into the block before it like amber—creating a "blockchain" where history cannot be secretly rewritten.',
    plainSummaryGa:
      'Cuirtear idirbhearta i "mbloic" le stampa ama. Nascann gach bloc nua leis an mbloc roimhe, ag cruthú "blocshlabhra" nach féidir sonraí ná stair a athrú ann.',
    keyTermGa: 'Blocshlabhra (Slabhra Stampaí Ama)',
    keyTermEn: 'Blockchain (Timestamp Chain)',
  },
  {
    id: 'sec-4',
    sectionNumber: '4',
    titleEn: 'Proof-of-Work',
    titleGa: 'Cruthúnas Oibre (Proof-of-Work)',
    originalTextEn:
      'To implement a distributed timestamp server on a peer-to-peer basis, we will need to use a proof-of-work system similar to Adam Back’s Hashcash. The proof-of-work involves scanning for a value that when hashed, such as with SHA-256, the hash begins with a number of zero bits. Once the CPU effort has been expended to make it satisfy the proof-of-work, the block cannot be changed without redoing the work. Proof-of-work is essentially one-CPU-one-vote.',
    originalTextGa:
      'Chun freastalaí stampa ama dáilte a chur i bhfeidhm ar bhonn piara-go-piara, bainfimid úsáid as córas Cruthúnas Oibre (Proof-of-Work) cosúil le Hashcash Adam Back. Nuair a bhíonn an iarracht ríomhaireachta caite chun an cruthúnas oibre a shásamh, ní féidir an bloc a athrú gan an obair go léir a dhéanamh arís agus gach bloc ina dhiaidh a athdhéanamh.',
    plainSummaryEn:
      'Proof-of-Work anchors digital Bitcoin to real-world energy. Computers ("miners") compete to solve cryptographic puzzles; this energy shield makes the Bitcoin ledger practically impossible to hack or counterfeit.',
    plainSummaryGa:
      'Ceanglaíonn Cruthúnas Oibre Bitcoin leis an bhfíorshaol trí fhuinneamh. Cosnaíonn sé seo an líonra ionas nach féidir le haon duine idirbhearta bréige a chruthú.',
    keyTermGa: 'Cruthúnas Oibre (PoW)',
    keyTermEn: 'Proof-of-Work (SHA-256)',
  },
  {
    id: 'sec-5',
    sectionNumber: '5',
    titleEn: 'Network',
    titleGa: 'An Líonra (Network)',
    originalTextEn:
      'The steps to run the network are as follows: 1) New transactions are broadcast to all nodes. 2) Each node collects new transactions into a block. 3) Each node works on finding a difficult proof-of-work for its block. 4) When a node finds a proof-of-work, it broadcasts the block to all nodes. 5) Nodes accept the block only if all transactions in it are valid and not already spent. 6) Nodes express their acceptance of the block by working on creating the next block in the chain.',
    originalTextGa:
      'Is iad seo a leanas na céimeanna chun an líonra a rith: 1) Craoltar idirbhearta nua chuig gach nód. 2) Bailíonn gach nód idirbhearta nua isteach i mbloc. 3) Oibríonn gach nód ar chruthúnas oibre deacair a aimsiú dá bhloc. 4) Nuair a aimsíonn nód cruthúnas oibre, craolann sé an bloc chuig gach nód. 5) Ní ghlacann nóid leis an mbloc ach amháin má tá gach idirbheart ann bailí.',
    plainSummaryEn:
      'Anyone in Ireland or around the world can run a Bitcoin "node" on an ordinary home computer. Every node independently checks the rules so nobody can cheat or print extra coins.',
    plainSummaryGa:
      'Is féidir le duine ar bith in Éirinn nó ar fud an domhain "nód" Bitcoin a rith. Seiceálann gach nód na rialacha go neamhspleách ionas nach féidir le haon duine calaois a dhéanamh.',
    keyTermGa: 'Nóid Neamhspleácha',
    keyTermEn: 'Independent Network Nodes',
  },
  {
    id: 'sec-6',
    sectionNumber: '6',
    titleEn: 'Incentive & The 21 Million Scarcity Rule',
    titleGa: 'Dreasacht & Riail na 21 Milliún Bonn',
    originalTextEn:
      'By convention, the first transaction in a block is a special transaction that starts a new coin owned by the creator of the block. This adds an incentive for nodes to support the network, and provides a way to initially distribute coins into circulation, since there is no central authority to issue them. The steady addition of a constant amount of new coins is analogous to gold miners expending resources to add gold to circulation. Once a predetermined number of coins have entered circulation, the incentive can transition entirely to transaction fees and be completely inflation free.',
    originalTextGa:
      'De réir gnás, is idirbheart speisialta é an chéad idirbheart i mbloc a chruthaíonn boinn nua d’údar an bhloic. Tugann sé seo dreasacht chun tacú leis an líonra, agus cuireann sé bealach ar fáil chun boinn a chur i gcúrsaíocht gan banc ceannais. Tá sé seo cosúil le mianadóirí óir ag cur óir i gcúrsaíocht. Nuair a bheidh líon réamhshocraithe bonn (21 milliún) i gcúrsaíocht, beidh an córas saor ó bhoilsciú go hiomlán.',
    plainSummaryEn:
      'New bitcoins are released slowly with each block—and cut in half every 4 years ("The Halving")—until exactly 21,000,000 BTC exist. Unlike government currencies, no extra Bitcoin can ever be printed.',
    plainSummaryGa:
      'Eisítear Bitcoin nua go mall le gach bloc—agus gearrtar an líon sin ina leath gach 4 bliana—go dtí go mbeidh díreach 21,000,000 BTC ann. Ní féidir níos mó a phriontáil go deo.',
    keyTermGa: 'Teorainn 21 Milliún (Saor ó Bhoilsciú)',
    keyTermEn: '21 Million Hard Cap (Inflation-Free)',
  },
  {
    id: 'sec-7',
    sectionNumber: '7–8',
    titleEn: 'Reclaiming Disk Space & Simplified Payment Verification (SPV)',
    titleGa: 'Spás Diosca & Fíorú Íocaíochta Simplí (SPV)',
    originalTextEn:
      'Once the latest transaction in a coin is buried under enough blocks, the spent transactions before it can be discarded to save disk space. To accomplish this without breaking the block’s hash, transactions are hashed in a Merkle Tree. It is possible to verify payments without running a full network node. A user only needs to keep a copy of the block headers of the longest proof-of-work chain and obtain the Merkle branch linking the transaction to the block it is timestamped in.',
    originalTextGa:
      'Chun spás a shábháil gan hais an bhloic a bhriseadh, cuirtear idirbhearta i gCrann Merkle (Merkle Tree). Ina theannta sin, is féidir íocaíochtaí a fhíorú ar ghuthán póca gan nód iomlán a rith (SPV) trí cheanntásca na mbloc agus brainse Merkle a sheiceáil.',
    plainSummaryEn:
      'Thanks to a clever mathematical structure called a "Merkle Tree," you can verify Bitcoin transactions securely on a lightweight mobile phone wallet without downloading the entire multi-gigabyte blockchain.',
    plainSummaryGa:
      'A bhuíochas le "Crann Merkle", is féidir leat íocaíochtaí Bitcoin a fhíorú go sábháilte ar aip gutháin phóca gan an blocshlabhra iomlán a íoslódáil.',
    keyTermGa: 'Crann Merkle & Sparán Éadrom',
    keyTermEn: 'Merkle Tree & Mobile Verification',
  },
  {
    id: 'sec-9',
    sectionNumber: '9–10',
    titleEn: 'Combining and Splitting Value & Privacy',
    titleGa: 'Luach a Chomhcheangal/Roinnt & Príobháideacht',
    originalTextEn:
      'Although it would be possible to handle coins individually, it would be unwieldy to make a separate transaction for every cent in a transfer. To allow value to be split and combined, transactions contain multiple inputs and outputs. The traditional banking model achieves a level of privacy by limiting access to information to the parties involved and the trusted third party. Bitcoin accomplishes privacy by breaking the flow of information in another place: by keeping public keys anonymous.',
    originalTextGa:
      'Chun gur féidir luach a roinnt agus a chomhcheangal, bíonn ionchuir agus aschuir iolracha in idirbhearta (cosúil le nóta €20 a thabhairt agus sóinseáil a fháil ar ais). Cosnaítear príobháideacht trí eochracha poiblí a choinneáil gan ainm—feiceann an pobal go bhfuil suim á seoladh ó sheoladh amháin go seoladh eile, ach gan ainm pearsanta ceangailte leis.',
    plainSummaryEn:
      'Bitcoin can be divided down to 100 millionths of a coin (called "Satoshis" or "sats"), so you never have to buy a whole Bitcoin. Addresses on the blockchain are pseudonymous strings of letters and numbers rather than your real name.',
    plainSummaryGa:
      'Is féidir Bitcoin amháin a roinnt ina 100 milliún cuid bheag ("Satoshis" nó "sats"), mar sin is féidir leat €5 nó €10 de a cheannach. Baineann seoltaí úsáid as uimhreacha agus litreacha in ionad d’ainm.',
    keyTermGa: 'Satoshis (Sats) & Eochair Phoiblí',
    keyTermEn: 'Satoshis (Sats) & Pseudonymous Keys',
  },
  {
    id: 'sec-11',
    sectionNumber: '11–12',
    titleEn: 'Calculations & Conclusion',
    titleGa: 'Ríomhanna & Conclúid',
    originalTextEn:
      'We consider the scenario of an attacker trying to generate an alternate chain faster than the honest chain. The probability of a slower attacker catching up diminishes exponentially as subsequent blocks are added. We have proposed a system for electronic transactions without relying on trust. We started with the usual framework of coins made from digital signatures, which provides strong control of ownership, but is incomplete without a way to prevent double-spending. To solve this, we proposed a peer-to-peer network using proof-of-work to record a public history of transactions that quickly becomes computationally impractical for an attacker to change.',
    originalTextGa:
      'Titeann an dóchúlacht go n-éireoidh le hionsaitheoir slabhra malartach a chruthú go heaspónantúil le gach bloc nua a chuirtear leis. Tá córas molta againn le haghaidh idirbhearta leictreonacha gan a bheith ag brath ar mhuinín i dtríú páirtí. Réitigh muid fadhb an chaiteachais dhúbailte le líonra piara-go-piara agus Cruthúnas Oibre a chruthaíonn stair phoiblí nach féidir le hionsaitheoir a athrú.',
    plainSummaryEn:
      'Conclusion: Satoshi proved mathematically that as long as honest computers hold the majority of network energy, the Bitcoin ledger is unbreakable. For the first time in human history, we have digital money governed by math and open rules—not institutions.',
    plainSummaryGa:
      'Conclúid: Chruthaigh Satoshi go matamaiticiúil go bhfuil mórleabhar Bitcoin do-bhriste. Don chéad uair sa stair, tá airgead digiteach againn atá á rialú ag matamaitic agus rialacha oscailte—ní ag bainc.',
    keyTermGa: 'Airgead Gan Muinín i dTríú Páirtí',
    keyTermEn: 'Trustless Peer-to-Peer Money',
  },
];
