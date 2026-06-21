import type {
  Background,
  Category,
  Collection,
  DailyQuestion,
  Deity,
  Localized,
  PracticeRef,
  ResolvedPractice,
  Sadhana,
  SadhanaDay,
  Voice,
} from "@/lib/types";

// Saarthi seed content corpus.
//
// SACRED TEXT NOTE: All Devanagari and IAST transliterations below are preserved
// verbatim and must never be altered to fit layout. English and Hindi meanings are
// faithful, unembellished renderings.
//
// TODO: ingest full verified corpus; scale deities via lib/content.ts.

// ---------------------------------------------------------------------------
// GANESHA
// ---------------------------------------------------------------------------
const ganesha: Deity = {
  id: "ganesha",
  name: { en: "Ganesha", hi: "गणेश" },
  devanagariName: "गणेश",
  tagline: {
    en: "Remover of obstacles, lord of beginnings",
    hi: "विघ्नों के हर्ता, शुभारंभ के स्वामी",
  },
  accent: "#E8A33C",
  available: true,
  shlokas: [
    {
      id: "ganesha-vakratunda",
      title: { en: "Vakratunda Mahakaya", hi: "वक्रतुण्ड महाकाय" },
      devanagari:
        "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
      transliteration:
        "Vakratuṇḍa mahākāya sūryakoṭi samaprabha / nirvighnaṃ kuru me deva sarvakāryeṣu sarvadā",
      meaning: {
        en: "O curved-trunked, mighty Lord, radiant as a million suns — make all my endeavours free of obstacles, always.",
        hi: "हे वक्र सूँड़ वाले, महाकाय, करोड़ों सूर्यों के समान तेजस्वी देव — मेरे समस्त कार्यों को सदा निर्विघ्न कीजिए।",
      },
      audio: "/audio/chant-placeholder.wav", // TODO: replace with produced audio.
      source: "Traditional",
    },
    {
      id: "ganesha-gayatri",
      title: { en: "Ganesha Gayatri", hi: "गणेश गायत्री" },
      devanagari:
        "ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि। तन्नो दन्तिः प्रचोदयात्॥",
      transliteration:
        "Om ekadantāya vidmahe, vakratuṇḍāya dhīmahi, tanno dantiḥ prachodayāt",
      meaning: {
        en: "We meditate upon the single-tusked One; we contemplate the curved-trunked Lord. May that tusked deity inspire and awaken us.",
        hi: "हम एकदन्त को जानते हैं, वक्रतुण्ड का ध्यान करते हैं। वह दन्ती (गणेश) हमें सत्प्रेरणा दें।",
      },
      audio: "/audio/chant-placeholder.wav", // TODO: replace with produced audio.
      source: "Traditional",
    },
  ],
  aarti: {
    id: "ganesha-aarti",
    title: { en: "Jai Ganesh Deva", hi: "जय गणेश देवा" },
    // TODO: full aarti text.
    devanagari: "जय गणेश जय गणेश जय गणेश देवा",
    transliteration: "Jai Ganesh, Jai Ganesh, Jai Ganesh Deva",
    meaning: {
      en: "Victory to Lord Ganesha, victory to Lord Ganesha, victory to the divine Ganesha.",
      hi: "जय हो गणेश देव की, जय हो गणेश की, जय हो दिव्य गणेश की।",
    },
    audio: "/audio/chant-placeholder.wav", // TODO: replace with produced audio.
    source: "Traditional aarti",
  },
  meditations: [
    {
      id: "ganesha-med-clearing",
      title: { en: "Clearing obstacles", hi: "विघ्नों को दूर करना" },
      minutes: 10,
      audio: "/audio/meditation-placeholder.wav", // TODO: replace with produced audio.
      description: {
        en: "A settling practice to release what blocks your path and begin again with a clear, steady mind.",
        hi: "रास्ते की रुकावटों को छोड़ने और स्थिर, स्वच्छ मन से नए सिरे से आरंभ करने हेतु एक शांत अभ्यास।",
      },
    },
    {
      id: "ganesha-med-beginnings",
      title: { en: "Sacred beginnings", hi: "शुभ आरंभ" },
      minutes: 12,
      audio: "/audio/meditation-placeholder.wav", // TODO: replace with produced audio.
      description: {
        en: "Invoke Ganesha at the threshold of something new — a calm intention-setting before any first step.",
        hi: "किसी नई शुरुआत की दहलीज़ पर गणेश का स्मरण — किसी भी प्रथम चरण से पहले शांत संकल्प।",
      },
    },
    {
      id: "ganesha-med-breath",
      title: { en: "Breath of stillness", hi: "स्थिरता की श्वास" },
      minutes: 8,
      audio: "/audio/meditation-placeholder.wav", // TODO: replace with produced audio.
      description: {
        en: "A short breath meditation to soften restlessness and return to a grounded, unshakable centre.",
        hi: "बेचैनी को शांत कर स्थिर, अडिग केंद्र में लौटने हेतु एक संक्षिप्त श्वास ध्यान।",
      },
    },
  ],
  lessons: [
    {
      id: "ganesha-lesson-who",
      title: { en: "Who is Ganesha?", hi: "गणेश कौन हैं?" },
      body: {
        en: "Ganesha is the elephant-headed son of Shiva and Parvati, honoured at the start of every new venture, journey, and prayer. Known as Vighnaharta, the remover of obstacles, and Vinayaka, the foremost guide, he is invoked first so that what follows may proceed with ease.",
        hi: "गणेश शिव और पार्वती के गजमुख पुत्र हैं, जिनका स्मरण प्रत्येक नए कार्य, यात्रा और पूजा के आरंभ में किया जाता है। विघ्नहर्ता और विनायक के रूप में पूजित, उन्हें सबसे पहले पुकारा जाता है ताकि आगे का कार्य सुगमता से सम्पन्न हो।",
      },
    },
    {
      id: "ganesha-lesson-elephant-head",
      title: {
        en: "Why Ganesha has an elephant head",
        hi: "गणेश का गजमुख क्यों है",
      },
      body: {
        en: "The elephant head carries deep meaning: large ears that listen more than they speak, a wide head that holds great wisdom, and a trunk both powerful and delicate — strength joined with gentleness. Ganesha's form teaches that true greatness is patient, perceptive, and adaptable.",
        hi: "गजमुख का गूढ़ अर्थ है: बड़े कान जो बोलने से अधिक सुनते हैं, विशाल मस्तक जो महान ज्ञान धारण करता है, और सूँड़ जो शक्तिशाली भी है और कोमल भी — शक्ति और सौम्यता का मेल। गणेश का यह रूप सिखाता है कि सच्ची महानता धैर्यवान, सूक्ष्मदर्शी और अनुकूलनशील होती है।",
      },
    },
    {
      id: "ganesha-lesson-vakratunda",
      title: {
        en: "The meaning of Vakratunda Mahakaya",
        hi: "वक्रतुण्ड महाकाय का अर्थ",
      },
      body: {
        en: "This beloved verse greets Ganesha as the curved-trunked, mighty one, luminous as countless suns, and asks a single thing: that all our works be free of obstacles, always. It is a prayer not for shortcuts but for clarity and steadiness on the path we have chosen.",
        hi: "यह प्रिय श्लोक गणेश को वक्रतुण्ड, महाकाय और करोड़ों सूर्यों के समान तेजस्वी कहकर अभिवादन करता है, और केवल एक ही प्रार्थना करता है: हमारे सभी कार्य सदा निर्विघ्न रहें। यह सरल मार्ग की नहीं, बल्कि चुने हुए मार्ग पर स्पष्टता और स्थिरता की प्रार्थना है।",
      },
    },
  ],
  stories: [
    {
      id: "ganesha-story-elephant-head",
      title: {
        en: "How Ganesha got his elephant head",
        hi: "गणेश को गजमुख कैसे मिला",
      },
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "Parvati shaped a boy from turmeric paste and set him to guard her door. When Shiva returned and the child barred his way, Shiva in anger severed the head. To console Parvati's grief, Shiva restored the boy to life with the head of an elephant — and named him chief of his ganas.",
        hi: "पार्वती ने हल्दी के उबटन से एक बालक बनाया और उसे द्वार की रक्षा हेतु नियुक्त किया। जब शिव लौटे और बालक ने मार्ग रोका, तो शिव ने क्रोध में उसका सिर काट दिया। पार्वती के शोक को शांत करने के लिए शिव ने बालक को हाथी के सिर के साथ पुनर्जीवित किया — और उसे अपने गणों का अधिपति बनाया।",
      },
    },
    {
      id: "ganesha-story-moon",
      title: { en: "Ganesha and the moon", hi: "गणेश और चंद्रमा" },
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "After feasting, Ganesha stumbled, and the moon laughed at his round belly. Stung by the mockery, Ganesha cursed the moon to fade from sight. The repentant moon was forgiven only in part — and so the moon waxes and wanes, a quiet lesson against pride and ridicule.",
        hi: "भोज के बाद गणेश लड़खड़ा गए, और चंद्रमा उनके गोल उदर पर हँस पड़ा। इस उपहास से आहत होकर गणेश ने चंद्रमा को लुप्त हो जाने का शाप दिया। पश्चातापी चंद्रमा को आंशिक रूप से ही क्षमा मिली — इसी से चंद्रमा घटता-बढ़ता है, जो अहंकार और उपहास के विरुद्ध एक मौन शिक्षा है।",
      },
    },
    {
      id: "ganesha-story-mahabharata",
      title: {
        en: "Ganesha writes the Mahabharata",
        hi: "गणेश ने महाभारत लिखी",
      },
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "When the sage Vyasa needed a scribe swift enough to record the Mahabharata, Ganesha agreed — on the condition that Vyasa never pause in dictation. Vyasa in turn asked that Ganesha understand each verse before writing it. So composition and comprehension moved together, and the great epic was set down.",
        hi: "जब ऋषि व्यास को महाभारत लिखने के लिए इतना तीव्र लेखक चाहिए था, तो गणेश इस शर्त पर सहमत हुए कि व्यास कथन में कभी न रुकें। बदले में व्यास ने कहा कि गणेश प्रत्येक श्लोक को लिखने से पूर्व समझ लें। इस प्रकार रचना और बोध साथ-साथ चलते रहे, और यह महाकाव्य लिपिबद्ध हुआ।",
      },
    },
  ],
  nightPrayer: {
    id: "ganesha-night-shanti",
    title: { en: "A prayer for peace at night", hi: "रात्रि की शांति-प्रार्थना" },
    devanagari: "ॐ शान्तिः शान्तिः शान्तिः। गजाननं भूतगणादिसेवितम्॥",
    transliteration: "Om śāntiḥ śāntiḥ śāntiḥ / gajānanaṃ bhūtagaṇādisevitam",
    meaning: {
      en: "Peace, peace, peace. I bow to the elephant-faced one, served by all beings — let the mind grow quiet as the day is laid to rest.",
      hi: "शांति, शांति, शांति। समस्त गणों से सेवित गजानन को नमन — दिन को विश्राम में रखते हुए मन शांत हो जाए।",
    },
    audio: "/audio/chant-placeholder.wav", // TODO: replace with produced audio.
    source: "Traditional",
  },
  nightKatha: {
    id: "ganesha-story-moon",
    title: { en: "Ganesha and the moon", hi: "गणेश और चंद्रमा" },
    audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
    summary: {
      en: "After feasting, Ganesha stumbled, and the moon laughed at his round belly. Stung by the mockery, Ganesha cursed the moon to fade from sight. The repentant moon was forgiven only in part — and so the moon waxes and wanes, a quiet lesson against pride and ridicule.",
      hi: "भोज के बाद गणेश लड़खड़ा गए, और चंद्रमा उनके गोल उदर पर हँस पड़ा। इस उपहास से आहत होकर गणेश ने चंद्रमा को लुप्त हो जाने का शाप दिया। पश्चातापी चंद्रमा को आंशिक रूप से ही क्षमा मिली — इसी से चंद्रमा घटता-बढ़ता है, जो अहंकार और उपहास के विरुद्ध एक मौन शिक्षा है।",
    },
  },
  talks: [
    {
      id: "ganesha-talk-thresholds",
      title: { en: "Standing at the threshold", hi: "दहलीज़ पर खड़े होकर" },
      speaker: { en: "Saarthi", hi: "सारथी" },
      minutes: 7,
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "Why we invoke Ganesha before any beginning, and how to meet the start of a new task with a calm, unhurried mind.",
        hi: "हर आरंभ से पहले गणेश का स्मरण क्यों, और किसी नए कार्य की शुरुआत को शांत, अविचल मन से कैसे मिलें।",
      },
    },
    {
      id: "ganesha-talk-obstacles",
      title: { en: "Obstacles as teachers", hi: "बाधाएँ, जो शिक्षक हैं" },
      speaker: { en: "Saarthi", hi: "सारथी" },
      minutes: 10,
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "A reflection on Vighnaharta — how the obstacles we resent so often carry the very lesson we needed.",
        hi: "विघ्नहर्ता पर एक चिंतन — जिन बाधाओं से हम खीझते हैं, वे प्रायः वही शिक्षा लाती हैं जिसकी हमें आवश्यकता थी।",
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// SHIVA
// ---------------------------------------------------------------------------
const shiva: Deity = {
  id: "shiva",
  name: { en: "Shiva", hi: "शिव" },
  devanagariName: "शिव",
  tagline: {
    en: "The auspicious one, the inner stillness",
    hi: "कल्याणकारी, अंतर की स्थिरता",
  },
  accent: "#5B93D6",
  available: true,
  shlokas: [
    {
      id: "shiva-panchakshara",
      title: {
        en: "Panchakshara — Om Namah Shivaya",
        hi: "पंचाक्षर — ॐ नमः शिवाय",
      },
      devanagari: "ॐ नमः शिवाय",
      transliteration: "Om Namaḥ Śivāya",
      meaning: {
        en: "I bow to Shiva.",
        hi: "मैं शिव को नमन करता हूँ।",
      },
      audio: "/audio/chant-placeholder.wav", // TODO: replace with produced audio.
      source: "Traditional",
    },
    {
      id: "shiva-mahamrityunjaya",
      title: { en: "Mahamrityunjaya Mantra", hi: "महामृत्युंजय मंत्र" },
      devanagari:
        "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥",
      transliteration:
        "Om tryambakaṃ yajāmahe sugandhiṃ puṣṭi-vardhanam / urvārukam iva bandhanān mṛtyor mukṣīya māmṛtāt",
      meaning: {
        en: "We worship the three-eyed One, fragrant, who nourishes all; may He free us from the bondage of death, like a ripe cucumber from its stem — for the sake of immortality.",
        hi: "हम त्रिनेत्रधारी, सुगंधित, सबका पोषण करने वाले शिव की उपासना करते हैं; वे हमें मृत्यु के बंधन से वैसे ही मुक्त करें जैसे पका हुआ खरबूज़ा अपनी बेल से — अमरता के लिए।",
      },
      audio: "/audio/chant-placeholder.wav", // TODO: replace with produced audio.
      source: "Rigveda / Traditional",
    },
  ],
  aarti: {
    id: "shiva-aarti",
    title: { en: "Om Jai Shiv Omkara", hi: "ॐ जय शिव ओंकारा" },
    // TODO: full aarti text.
    devanagari: "ॐ जय शिव ओंकारा",
    transliteration: "Om Jai Shiv Omkara",
    meaning: {
      en: "Victory to you, O Shiva, embodiment of the primordial Om.",
      hi: "हे शिव, ॐकार स्वरूप, आपकी जय हो।",
    },
    audio: "/audio/chant-placeholder.wav", // TODO: replace with produced audio.
    source: "Traditional aarti",
  },
  meditations: [
    {
      id: "shiva-med-mahamrityunjaya",
      title: { en: "Mahamrityunjaya dhyana", hi: "महामृत्युंजय ध्यान" },
      minutes: 12,
      audio: "/audio/meditation-placeholder.wav", // TODO: replace with produced audio.
      description: {
        en: "A healing meditation resting in the Mahamrityunjaya mantra — for protection, renewal, and release from fear.",
        hi: "महामृत्युंजय मंत्र में स्थित एक उपचारात्मक ध्यान — रक्षा, नवीनीकरण और भय से मुक्ति हेतु।",
      },
    },
    {
      id: "shiva-med-stillness",
      title: { en: "The stillness of Shiva", hi: "शिव की स्थिरता" },
      minutes: 15,
      audio: "/audio/meditation-placeholder.wav", // TODO: replace with produced audio.
      description: {
        en: "Settle into the silent, mountain-like awareness that Shiva embodies — a deep rest beneath all movement.",
        hi: "उस मौन, पर्वत-समान चेतना में विश्राम करें जिसका शिव प्रतीक हैं — समस्त गतिविधि के नीचे गहन शांति।",
      },
    },
    {
      id: "shiva-med-namah",
      title: { en: "Om Namah Shivaya japa", hi: "ॐ नमः शिवाय जप" },
      minutes: 10,
      audio: "/audio/meditation-placeholder.wav", // TODO: replace with produced audio.
      description: {
        en: "A gentle repetition of the five-syllable mantra, letting each round carry the mind toward quiet surrender.",
        hi: "पंचाक्षर मंत्र का कोमल जप, जहाँ प्रत्येक आवृत्ति मन को शांत समर्पण की ओर ले जाती है।",
      },
    },
  ],
  lessons: [
    {
      id: "shiva-lesson-who",
      title: { en: "Who is Shiva?", hi: "शिव कौन हैं?" },
      body: {
        en: "Shiva is the auspicious one — at once the great ascetic seated in meditation on Mount Kailasa and the cosmic dancer whose rhythm sustains the universe. He is destroyer not of life but of illusion and ego, clearing the ground so that what is true may remain. To turn toward Shiva is to turn toward stillness.",
        hi: "शिव कल्याणकारी हैं — एक ओर कैलास पर ध्यानमग्न महायोगी, दूसरी ओर वह नटराज जिनकी लय ब्रह्मांड को धारण करती है। वे जीवन के नहीं, बल्कि माया और अहंकार के संहारक हैं, जो भूमि को इसलिए स्वच्छ करते हैं कि जो सत्य है वही शेष रहे। शिव की ओर मुड़ना स्थिरता की ओर मुड़ना है।",
      },
    },
    {
      id: "shiva-lesson-namah",
      title: {
        en: "The meaning of Om Namah Shivaya",
        hi: "ॐ नमः शिवाय का अर्थ",
      },
      body: {
        en: "These five syllables — na, mah, shi, vaa, ya — are called the Panchakshara, the five-lettered mantra. Simply, it means 'I bow to Shiva.' More inwardly, it is a bowing of the small self toward the boundless awareness that Shiva represents, dissolving pride into peace with each repetition.",
        hi: "ये पाँच अक्षर — न, मः, शि, वा, य — पंचाक्षर मंत्र कहलाते हैं। सरल अर्थ है 'मैं शिव को नमन करता हूँ।' गहरे अर्थ में यह छोटे 'मैं' का उस असीम चेतना की ओर झुकना है जिसके शिव प्रतीक हैं — प्रत्येक जप के साथ अहंकार शांति में घुलता जाता है।",
      },
    },
    {
      id: "shiva-lesson-nataraja",
      title: { en: "Shiva as Nataraja", hi: "नटराज रूप में शिव" },
      body: {
        en: "As Nataraja, the Lord of Dance, Shiva performs the tandava within a ring of fire: one foot crushing ignorance, one hand holding the drum of creation, another the flame of dissolution, another raised in reassurance. The dance teaches that creation and destruction are a single, ceaseless rhythm — and that even amid it, there is a centre at perfect rest.",
        hi: "नटराज के रूप में, नृत्य के स्वामी शिव अग्नि-वलय के भीतर तांडव करते हैं: एक चरण अज्ञान को कुचलता है, एक हाथ सृष्टि का डमरू थामे है, दूसरा प्रलय की अग्नि, और एक हाथ अभय-मुद्रा में उठा है। यह नृत्य सिखाता है कि सृष्टि और संहार एक ही अविरत लय हैं — और उसके बीच भी एक केंद्र पूर्ण विश्राम में रहता है।",
      },
    },
  ],
  stories: [
    {
      id: "shiva-story-neelkanth",
      title: {
        en: "Shiva as Neelkanth, the blue throat",
        hi: "नीलकंठ शिव",
      },
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "When gods and demons churned the cosmic ocean, a world-ending poison, halahala, rose first. To save creation, Shiva drank it. Parvati held his throat so the poison could neither pass nor harm him — and it stained his throat blue. So he became Neelkanth, the one who holds suffering for the sake of all.",
        hi: "जब देवों और असुरों ने समुद्र मंथन किया, तो सबसे पहले संसार का नाश करने वाला हलाहल विष निकला। सृष्टि की रक्षा के लिए शिव ने उसे पी लिया। पार्वती ने उनका कंठ थाम लिया ताकि विष न तो आगे जाए न उन्हें हानि पहुँचाए — और उनका कंठ नीला पड़ गया। इस प्रकार वे नीलकंठ कहलाए, जो सबके हित में पीड़ा धारण करते हैं।",
      },
    },
    {
      id: "shiva-story-ganga",
      title: { en: "The descent of the Ganga", hi: "गंगा का अवतरण" },
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "When the mighty Ganga agreed to descend from the heavens, her torrent was great enough to shatter the earth. King Bhagiratha's penance moved Shiva to receive her: she fell into his matted locks, where her force was gentled, and flowed forth in calm streams to bless the world and liberate the ancestors.",
        hi: "जब महाशक्तिशाली गंगा स्वर्ग से उतरने को राज़ी हुईं, तो उनका वेग पृथ्वी को चूर कर देने योग्य था। राजा भगीरथ की तपस्या से प्रसन्न होकर शिव ने उन्हें ग्रहण किया: गंगा उनकी जटाओं में गिरीं, जहाँ उनका वेग शांत हुआ, और फिर मंद धाराओं में बहकर संसार को धन्य किया और पूर्वजों को मुक्ति दी।",
      },
    },
    {
      id: "shiva-story-markandeya",
      title: { en: "Shiva and Markandeya", hi: "शिव और मार्कण्डेय" },
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "The boy-sage Markandeya was destined to die at sixteen. As Yama, lord of death, came with his noose, the boy clung to the Shiva-linga in devotion. Shiva burst forth to protect him, restraining Yama, and granted Markandeya life everlasting — a story of how unwavering devotion can transcend even death.",
        hi: "बालक ऋषि मार्कण्डेय की मृत्यु सोलह वर्ष की आयु में नियत थी। जब मृत्यु के देवता यम अपना पाश लेकर आए, तो बालक भक्तिपूर्वक शिवलिंग से लिपट गया। शिव उसकी रक्षा हेतु प्रकट हुए, यम को रोका, और मार्कण्डेय को चिरंजीवी होने का वरदान दिया — यह कथा बताती है कि अटल भक्ति मृत्यु से भी परे जा सकती है।",
      },
    },
  ],
  nightPrayer: {
    id: "shiva-night-karpura",
    title: { en: "Karpura Gauram", hi: "कर्पूर गौरं" },
    devanagari:
      "कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम्। सदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि॥",
    transliteration:
      "Karpūra-gauraṃ karuṇāvatāraṃ saṃsāra-sāraṃ bhujagendra-hāram / sadā vasantaṃ hṛdayāravinde bhavaṃ bhavānī-sahitaṃ namāmi",
    meaning: {
      en: "White as camphor, embodiment of compassion, the essence of all existence, serpent-king garlanded — I bow to Shiva who ever dwells, with Bhavani, in the lotus of the heart.",
      hi: "कपूर-समान गौर वर्ण, करुणा के अवतार, संसार के सार, नागराज को हार रूप में धारण किए हुए — मैं उन शिव को नमन करता हूँ जो भवानी सहित सदा हृदय-कमल में निवास करते हैं।",
    },
    audio: "/audio/chant-placeholder.wav", // TODO: replace with produced audio.
    source: "Traditional (night invocation)",
  },
  nightKatha: {
    id: "shiva-story-neelkanth",
    title: { en: "Shiva as Neelkanth, the blue throat", hi: "नीलकंठ शिव" },
    audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
    summary: {
      en: "When gods and demons churned the cosmic ocean, a world-ending poison, halahala, rose first. To save creation, Shiva drank it. Parvati held his throat so the poison could neither pass nor harm him — and it stained his throat blue. So he became Neelkanth, the one who holds suffering for the sake of all.",
      hi: "जब देवों और असुरों ने समुद्र मंथन किया, तो सबसे पहले संसार का नाश करने वाला हलाहल विष निकला। सृष्टि की रक्षा के लिए शिव ने उसे पी लिया। पार्वती ने उनका कंठ थाम लिया ताकि विष न तो आगे जाए न उन्हें हानि पहुँचाए — और उनका कंठ नीला पड़ गया। इस प्रकार वे नीलकंठ कहलाए, जो सबके हित में पीड़ा धारण करते हैं।",
    },
  },
  talks: [
    {
      id: "shiva-talk-stillness",
      title: { en: "The mountain within", hi: "भीतर का पर्वत" },
      speaker: { en: "Saarthi", hi: "सारथी" },
      minutes: 9,
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "On Shiva as the unmoving witness — finding the still centre that remains untouched beneath every passing storm.",
        hi: "अचल साक्षी रूप में शिव — हर बीतते तूफ़ान के नीचे अछूते रहने वाले स्थिर केंद्र को पाना।",
      },
    },
    {
      id: "shiva-talk-letting-go",
      title: { en: "What Shiva destroys", hi: "शिव क्या नष्ट करते हैं" },
      speaker: { en: "Saarthi", hi: "सारथी" },
      minutes: 11,
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "Destruction as release: how letting go of illusion and ego is not loss but a clearing for what is true.",
        hi: "संहार एक विमुक्ति है: माया और अहंकार को छोड़ना हानि नहीं, बल्कि सत्य के लिए भूमि का स्वच्छ होना है।",
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// RAMA
// ---------------------------------------------------------------------------
const rama: Deity = {
  id: "rama",
  name: { en: "Rama", hi: "राम" },
  devanagariName: "राम",
  tagline: {
    en: "The path of dharma, the steady heart",
    hi: "धर्म का मार्ग, स्थिर हृदय",
  },
  accent: "#3DA88E",
  available: true,
  shlokas: [
    {
      id: "rama-taraka-nama",
      title: { en: "Rama Taraka Nama", hi: "राम तारक नाम" },
      devanagari: "श्री राम जय राम जय जय राम",
      transliteration: "Śrī Rāma jaya Rāma jaya jaya Rāma",
      meaning: {
        en: "Glory to Sri Rama; victory to Rama; victory, victory to Rama.",
        hi: "श्री राम की महिमा; राम की जय; राम की जय जय हो।",
      },
      audio: "/audio/chant-placeholder.wav", // TODO: replace with produced audio.
      source: "Traditional",
    },
    {
      id: "rama-nama",
      title: { en: "Rama Nama", hi: "राम नाम" },
      devanagari:
        "श्रीराम राम रामेति रमे रामे मनोरमे। सहस्रनाम तत्तुल्यं राम नाम वरानने॥",
      transliteration:
        "Śrī-Rāma Rāma Rāmeti, rame rāme manorame / sahasra-nāma tat-tulyaṃ, Rāma-nāma varānane",
      meaning: {
        en: "Reciting 'Sri Rama, Rama, Rama,' I delight in the lovely name of Rama. O fair-faced one, this single name of Rama is equal to the thousand names of the Lord.",
        hi: "'श्रीराम, राम, राम' का जप करते हुए मैं राम के मनोहर नाम में रमण करता हूँ। हे सुमुखि, राम का यह एक नाम भगवान के सहस्रनाम के तुल्य है।",
      },
      audio: "/audio/chant-placeholder.wav", // TODO: replace with produced audio.
      source: "Vishnu Sahasranama",
    },
  ],
  aarti: {
    id: "rama-aarti",
    title: {
      en: "Shri Ramachandra Kripalu",
      hi: "श्री रामचन्द्र कृपालु",
    },
    // TODO: full aarti text.
    devanagari: "श्री रामचन्द्र कृपालु भजु मन",
    transliteration: "Shri Ramachandra kripalu bhaju mana",
    meaning: {
      en: "O mind, worship the compassionate Sri Ramachandra.",
      hi: "हे मन, कृपालु श्री रामचन्द्र का भजन कर।",
    },
    audio: "/audio/chant-placeholder.wav", // TODO: replace with produced audio.
    source: "Traditional (Tulsidas)",
  },
  meditations: [
    {
      id: "rama-med-japa",
      title: { en: "Rama-nama japa meditation", hi: "राम-नाम जप ध्यान" },
      minutes: 15,
      audio: "/audio/meditation-placeholder.wav", // TODO: replace with produced audio.
      description: {
        en: "Rest the mind on the repetition of Rama's name, letting the rhythm steady the breath and quiet every worry.",
        hi: "राम के नाम के जप पर मन को स्थिर करें, जहाँ यह लय श्वास को शांत और हर चिंता को मौन कर देती है।",
      },
    },
    {
      id: "rama-med-dharma",
      title: { en: "The steady heart of dharma", hi: "धर्म का स्थिर हृदय" },
      minutes: 12,
      audio: "/audio/meditation-placeholder.wav", // TODO: replace with produced audio.
      description: {
        en: "A reflective sitting on doing what is right with equanimity — drawing on Rama's calm steadiness under trial.",
        hi: "समता के साथ उचित कर्म करने पर एक चिंतनशील ध्यान — संकट में राम की शांत स्थिरता से प्रेरणा लेते हुए।",
      },
    },
    {
      id: "rama-med-refuge",
      title: { en: "Taking refuge", hi: "शरणागति" },
      minutes: 10,
      audio: "/audio/meditation-placeholder.wav", // TODO: replace with produced audio.
      description: {
        en: "A short surrender practice, setting down burdens at Rama's feet and resting in trust and protection.",
        hi: "एक संक्षिप्त समर्पण अभ्यास, जिसमें भार राम के चरणों में रखकर विश्वास और रक्षा में विश्राम किया जाता है।",
      },
    },
  ],
  lessons: [
    {
      id: "rama-lesson-who",
      title: { en: "Who is Rama?", hi: "राम कौन हैं?" },
      body: {
        en: "Rama, the prince of Ayodhya and the seventh avatar of Vishnu, is revered as Maryada Purushottama — the ideal man who upholds righteousness in every role. Son, husband, friend, and king, he embodies dharma not as rigid law but as steadfast integrity, even when it costs him dearly.",
        hi: "अयोध्या के राजकुमार और विष्णु के सातवें अवतार राम मर्यादा पुरुषोत्तम के रूप में पूजित हैं — वह आदर्श पुरुष जो हर भूमिका में धर्म का पालन करते हैं। पुत्र, पति, मित्र और राजा के रूप में, वे धर्म को कठोर नियम के रूप में नहीं, बल्कि अटल सत्यनिष्ठा के रूप में जीते हैं, चाहे उन्हें इसका भारी मूल्य ही क्यों न चुकाना पड़े।",
      },
    },
    {
      id: "rama-lesson-dharma",
      title: { en: "Rama and dharma", hi: "राम और धर्म" },
      body: {
        en: "Rama's life is a study in dharma under pressure. Asked to leave his kingdom on the eve of his coronation, he obeyed his father's word without bitterness. Time and again he chose duty over comfort, his given word over his own ease. His example asks not for perfection but for an unwavering commitment to what is right.",
        hi: "राम का जीवन कठिनाई में धर्म का अध्ययन है। राज्याभिषेक की पूर्व संध्या पर राज्य छोड़ने को कहे जाने पर, उन्होंने बिना किसी कटुता के पिता के वचन का पालन किया। बार-बार उन्होंने सुख के ऊपर कर्तव्य को, अपने आराम के ऊपर अपने वचन को चुना। उनका उदाहरण पूर्णता नहीं, बल्कि सत्य के प्रति अडिग निष्ठा की प्रेरणा देता है।",
      },
    },
    {
      id: "rama-lesson-nama",
      title: { en: "The power of Rama-nama", hi: "राम-नाम की शक्ति" },
      body: {
        en: "Saints across the ages have held that the name of Rama is itself a refuge — simple enough for anyone to repeat, yet vast enough to carry the heart across difficulty. To chant 'Rama, Rama' is to keep returning the mind to steadiness, trust, and remembrance, until the name becomes a quiet companion to the breath.",
        hi: "युगों-युगों से संतों ने माना है कि राम का नाम स्वयं एक शरण है — इतना सरल कि कोई भी जप सके, फिर भी इतना विशाल कि हृदय को कठिनाई के पार ले जाए। 'राम, राम' का जप करना मन को बार-बार स्थिरता, विश्वास और स्मरण की ओर लौटाना है, जब तक कि यह नाम श्वास का मौन साथी न बन जाए।",
      },
    },
  ],
  stories: [
    {
      id: "rama-story-squirrel",
      title: { en: "Rama and the squirrel", hi: "राम और गिलहरी" },
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "As the great bridge to Lanka was being built, a tiny squirrel rolled in the sand and shook it into the sea, carrying grains in its small body. The mighty vanaras laughed, but Rama gently lifted the squirrel and stroked its back — and the marks of his fingers, it is said, remain as the stripes squirrels carry to this day. No service offered with love is ever small.",
        hi: "जब लंका तक का विशाल सेतु बन रहा था, तो एक नन्ही गिलहरी रेत में लोटकर उसे समुद्र में मिला रही थी, अपने छोटे से शरीर में कण ढोकर। बलशाली वानर हँसे, पर राम ने धीरे से गिलहरी को उठाया और उसकी पीठ सहलाई — कहते हैं उनकी अंगुलियों के निशान आज भी गिलहरियों की धारियों के रूप में रह गए। प्रेम से किया गया कोई भी सेवा-कार्य छोटा नहीं होता।",
      },
    },
    {
      id: "rama-story-sanjivani",
      title: {
        en: "Hanuman and the Sanjivani",
        hi: "हनुमान और संजीवनी",
      },
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "When Lakshmana fell gravely wounded in battle, only the Sanjivani herb from a distant mountain could save him. Hanuman flew through the night to find it; unable to identify the single herb, he lifted the whole mountain and carried it back in time. His boundless devotion turned the impossible into the done.",
        hi: "जब युद्ध में लक्ष्मण गंभीर रूप से घायल होकर गिरे, तो उन्हें केवल एक दूर पर्वत की संजीवनी बूटी ही बचा सकती थी। हनुमान रातभर उड़कर उसे खोजने गए; एक बूटी पहचान न पाने पर उन्होंने पूरा पर्वत ही उठा लिया और समय रहते लौट आए। उनकी असीम भक्ति ने असंभव को संभव कर दिखाया।",
      },
    },
    {
      id: "rama-story-shabari",
      title: { en: "Shabari's berries", hi: "शबरी के बेर" },
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "Shabari, an aged forest devotee, waited a lifetime for Rama. When at last he came, she offered him berries she had first tasted herself, to be sure only the sweet ones reached him. Rama ate them with joy, seeing not the broken custom but the pure love behind the gift — for devotion is measured by the heart, never by ritual.",
        hi: "वृद्धा वनवासी भक्त शबरी ने राम की प्रतीक्षा में जीवन बिता दिया। जब अंततः वे आए, तो उसने उन्हें वे बेर अर्पित किए जिन्हें उसने पहले स्वयं चखा था, ताकि केवल मीठे बेर ही उन तक पहुँचें। राम ने उन्हें प्रेमपूर्वक खाया, उस टूटी परंपरा को नहीं बल्कि भेंट के पीछे के शुद्ध प्रेम को देखते हुए — क्योंकि भक्ति हृदय से मापी जाती है, कर्मकांड से कभी नहीं।",
      },
    },
  ],
  nightPrayer: {
    id: "rama-night-shyama",
    title: { en: "Rama for a peaceful night", hi: "राम — शांत रात्रि हेतु" },
    devanagari: "रामं स्कन्दं हनूमन्तं वैनतेयं वृकोदरम्। शयने यः स्मरेन्नित्यं दुःस्वप्नस्तस्य नश्यति॥",
    transliteration:
      "Rāmaṃ skandaṃ hanūmantaṃ vainateyaṃ vṛkodaram / śayane yaḥ smaren nityaṃ duḥsvapnas tasya naśyati",
    meaning: {
      en: "Whoever, lying down to sleep, ever remembers Rama, Skanda, Hanuman, Garuda, and Bhima — their troubled dreams are dissolved.",
      hi: "जो शयन के समय राम, स्कन्द, हनुमान, गरुड़ और भीम का सदा स्मरण करता है, उसके दुःस्वप्न नष्ट हो जाते हैं।",
    },
    audio: "/audio/chant-placeholder.wav", // TODO: replace with produced audio.
    source: "Traditional (night invocation)",
  },
  nightKatha: {
    id: "rama-story-shabari",
    title: { en: "Shabari's berries", hi: "शबरी के बेर" },
    audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
    summary: {
      en: "Shabari, an aged forest devotee, waited a lifetime for Rama. When at last he came, she offered him berries she had first tasted herself, to be sure only the sweet ones reached him. Rama ate them with joy, seeing not the broken custom but the pure love behind the gift — for devotion is measured by the heart, never by ritual.",
      hi: "वृद्धा वनवासी भक्त शबरी ने राम की प्रतीक्षा में जीवन बिता दिया। जब अंततः वे आए, तो उसने उन्हें वे बेर अर्पित किए जिन्हें उसने पहले स्वयं चखा था, ताकि केवल मीठे बेर ही उन तक पहुँचें। राम ने उन्हें प्रेमपूर्वक खाया, उस टूटी परंपरा को नहीं बल्कि भेंट के पीछे के शुद्ध प्रेम को देखते हुए — क्योंकि भक्ति हृदय से मापी जाती है, कर्मकांड से कभी नहीं।",
    },
  },
  talks: [
    {
      id: "rama-talk-given-word",
      title: { en: "The weight of a given word", hi: "दिए हुए वचन का भार" },
      speaker: { en: "Saarthi", hi: "सारथी" },
      minutes: 8,
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "How Rama held to his word even at great cost, and what his example asks of us in ordinary promises.",
        hi: "राम ने भारी मूल्य चुकाकर भी अपने वचन को कैसे निभाया, और साधारण वचनों में उनका उदाहरण हमसे क्या माँगता है।",
      },
    },
    {
      id: "rama-talk-refuge",
      title: { en: "Taking refuge in the name", hi: "नाम की शरण में" },
      speaker: { en: "Saarthi", hi: "सारथी" },
      minutes: 7,
      audio: "/audio/katha-placeholder.wav", // TODO: replace with produced audio.
      summary: {
        en: "On Rama-nama as a steadying companion — a name simple enough to repeat through any difficulty.",
        hi: "राम-नाम एक स्थिरकारी साथी — हर कठिनाई में दोहराने योग्य इतना सरल नाम।",
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// COMING SOON — placeholders demonstrating the corpus scales to many deities.
// available:false, empty content arrays, no aarti. Name / tagline / accent only.
// TODO: ingest full verified corpus; scale deities via lib/content.ts.
// ---------------------------------------------------------------------------
const comingSoon: Deity[] = [
  {
    id: "krishna",
    name: { en: "Krishna", hi: "कृष्ण" },
    devanagariName: "कृष्ण",
    tagline: {
      en: "The flute of joy, the song of the Gita",
      hi: "आनंद की बंसी, गीता का संगीत",
    },
    accent: "#1E6FB0",
    available: false,
    shlokas: [],
    meditations: [],
    lessons: [],
    stories: [],
  },
  {
    id: "durga",
    name: { en: "Durga", hi: "दुर्गा" },
    devanagariName: "दुर्गा",
    tagline: {
      en: "The fierce mother, protector of all",
      hi: "उग्र माता, सबकी रक्षक",
    },
    accent: "#9B2D5E",
    available: false,
    shlokas: [],
    meditations: [],
    lessons: [],
    stories: [],
  },
  {
    id: "hanuman",
    name: { en: "Hanuman", hi: "हनुमान" },
    devanagariName: "हनुमान",
    tagline: {
      en: "Devotion, courage, boundless service",
      hi: "भक्ति, साहस, असीम सेवा",
    },
    accent: "#D2691E",
    available: false,
    shlokas: [],
    meditations: [],
    lessons: [],
    stories: [],
  },
  {
    id: "lakshmi",
    name: { en: "Lakshmi", hi: "लक्ष्मी" },
    devanagariName: "लक्ष्मी",
    tagline: {
      en: "Abundance, grace, and light",
      hi: "समृद्धि, कृपा और प्रकाश",
    },
    accent: "#C99A2E",
    available: false,
    shlokas: [],
    meditations: [],
    lessons: [],
    stories: [],
  },
  {
    id: "vishnu",
    name: { en: "Vishnu", hi: "विष्णु" },
    devanagariName: "विष्णु",
    tagline: {
      en: "The preserver, the cosmic order",
      hi: "पालनकर्ता, ब्रह्मांडीय व्यवस्था",
    },
    accent: "#2E5FA3",
    available: false,
    shlokas: [],
    meditations: [],
    lessons: [],
    stories: [],
  },
  {
    id: "saraswati",
    name: { en: "Saraswati", hi: "सरस्वती" },
    devanagariName: "सरस्वती",
    tagline: {
      en: "Wisdom, learning, and the arts",
      hi: "ज्ञान, विद्या और कलाएँ",
    },
    accent: "#5B7FB0",
    available: false,
    shlokas: [],
    meditations: [],
    lessons: [],
    stories: [],
  },
];

/** The full deity corpus: three fully seeded deities followed by coming-soon placeholders. */
export const deities: Deity[] = [ganesha, shiva, rama, ...comingSoon];

/** Look up a deity by id. Returns undefined for null/undefined/unknown ids. */
export function getDeity(id: string | null | undefined): Deity | undefined {
  if (!id) return undefined;
  return deities.find((d) => d.id === id);
}

/** Deities that are fully available for practice. */
export function getAvailableDeities(): Deity[] {
  return deities.filter((d) => d.available);
}

/** Deities shown as "coming soon" in the onboarding grid. */
export function getComingSoonDeities(): Deity[] {
  return deities.filter((d) => !d.available);
}

// ---------------------------------------------------------------------------
// VOICES — guide voice options. "default" plus placeholders for future
// produced/cloned deity voices.
// ---------------------------------------------------------------------------
export const voices: Voice[] = [
  {
    id: "default",
    name: { en: "Default voice", hi: "मूल स्वर" },
    note: {
      en: "The standard Saarthi guide voice.",
      hi: "मानक सारथी मार्गदर्शक स्वर।",
    },
  },
  {
    id: "aanandi-warm",
    name: { en: "Aanandi — warm", hi: "आनंदी — स्निग्ध" },
    note: {
      en: "Placeholder for a future produced, deity voice — warm and gentle in tone.",
      hi: "भविष्य के निर्मित देव-स्वर हेतु प्लेसहोल्डर — स्निग्ध और कोमल।", // TODO: produced voice.
    },
  },
  {
    id: "devadatta-steady",
    name: { en: "Devadatta — steady", hi: "देवदत्त — स्थिर" },
    note: {
      en: "Placeholder for a future produced, deity voice — steady and grounding in tone.",
      hi: "भविष्य के निर्मित देव-स्वर हेतु प्लेसहोल्डर — स्थिर और आधार देने वाला।", // TODO: produced voice.
    },
  },
];

// ---------------------------------------------------------------------------
// BACKGROUNDS — ambient beds layered under a session. "silence" => audio null.
// ---------------------------------------------------------------------------
export const backgrounds: Background[] = [
  {
    id: "tanpura",
    name: { en: "Tanpura", hi: "तानपूरा" },
    audio: "/audio/bg-tanpura.wav", // TODO: replace with produced audio.
  },
  {
    id: "temple-bells",
    name: { en: "Temple bells", hi: "मंदिर की घंटियाँ" },
    audio: "/audio/bg-bells.wav", // TODO: replace with produced audio.
  },
  {
    id: "flowing-water",
    name: { en: "Flowing water", hi: "बहता जल" },
    audio: "/audio/bg-water.wav", // TODO: replace with produced audio.
  },
  {
    id: "silence",
    name: { en: "Silence", hi: "मौन" },
    audio: null,
  },
];

// ---------------------------------------------------------------------------
// CATEGORIES — entry points by intention.
// ---------------------------------------------------------------------------
export const categories: Category[] = [
  {
    id: "calm",
    label: { en: "Calm", hi: "शांति" },
    blurb: {
      en: "Settle a restless mind and return to ease.",
      hi: "अशांत मन को शांत कर सहजता में लौटें।",
    },
  },
  {
    id: "focus",
    label: { en: "Focus", hi: "एकाग्रता" },
    blurb: {
      en: "Steady the attention before work or study.",
      hi: "कार्य या अध्ययन से पूर्व ध्यान को स्थिर करें।",
    },
  },
  {
    id: "sleep",
    label: { en: "Sleep", hi: "निद्रा" },
    blurb: {
      en: "Lay the day to rest with a quiet night practice.",
      hi: "शांत रात्रि अभ्यास से दिन को विश्राम दें।",
    },
  },
  {
    id: "before-an-exam",
    label: { en: "Before an exam", hi: "परीक्षा से पहले" },
    blurb: {
      en: "Calm the nerves and meet the moment with a clear mind.",
      hi: "घबराहट को शांत कर स्वच्छ मन से उस क्षण का सामना करें।",
    },
  },
  {
    id: "courage",
    label: { en: "Courage", hi: "साहस" },
    blurb: {
      en: "Gather strength to face what stands before you.",
      hi: "सामने खड़ी चुनौती का सामना करने हेतु बल जुटाएँ।",
    },
  },
  {
    id: "gratitude",
    label: { en: "Gratitude", hi: "कृतज्ञता" },
    blurb: {
      en: "Rest in thankfulness for what the day has given.",
      hi: "दिन ने जो दिया, उसके प्रति कृतज्ञता में विश्राम करें।",
    },
  },
];

// ---------------------------------------------------------------------------
// COLLECTIONS — themed sets of practices pointing at real seeded content.
// ---------------------------------------------------------------------------
export const collections: Collection[] = [
  {
    id: "calm",
    title: { en: "A quiet mind", hi: "शांत मन" },
    subtitle: {
      en: "Practices to soften restlessness and return to ease.",
      hi: "बेचैनी को शांत कर सहजता में लौटने हेतु अभ्यास।",
    },
    theme: "calm",
    items: [
      { kind: "meditation", deityId: "ganesha", itemId: "ganesha-med-breath" },
      { kind: "meditation", deityId: "shiva", itemId: "shiva-med-stillness" },
      { kind: "shloka", deityId: "shiva", itemId: "shiva-panchakshara" },
      { kind: "meditation", deityId: "rama", itemId: "rama-med-refuge" },
    ],
  },
  {
    id: "courage",
    title: { en: "A steady heart", hi: "स्थिर हृदय" },
    subtitle: {
      en: "Gather strength and meet difficulty with resolve.",
      hi: "बल जुटाकर संकल्प के साथ कठिनाई का सामना करें।",
    },
    theme: "courage",
    items: [
      { kind: "shloka", deityId: "shiva", itemId: "shiva-mahamrityunjaya" },
      { kind: "meditation", deityId: "rama", itemId: "rama-med-dharma" },
      { kind: "shloka", deityId: "rama", itemId: "rama-taraka-nama" },
    ],
  },
  {
    id: "gratitude",
    title: { en: "A thankful heart", hi: "कृतज्ञ हृदय" },
    subtitle: {
      en: "Turn toward what has been given with quiet thanks.",
      hi: "जो प्राप्त हुआ है उसकी ओर मौन कृतज्ञता से मुड़ें।",
    },
    theme: "gratitude",
    items: [
      { kind: "aarti", deityId: "ganesha", itemId: "ganesha-aarti" },
      { kind: "aarti", deityId: "rama", itemId: "rama-aarti" },
      { kind: "shloka", deityId: "rama", itemId: "rama-nama" },
    ],
  },
  {
    id: "letting-go",
    title: { en: "Letting go", hi: "विसर्जन" },
    subtitle: {
      en: "Set down what weighs on you and rest in release.",
      hi: "जो भार है उसे रखकर विमुक्ति में विश्राम करें।",
    },
    theme: "letting-go",
    items: [
      { kind: "meditation", deityId: "shiva", itemId: "shiva-med-mahamrityunjaya" },
      { kind: "shloka", deityId: "shiva", itemId: "shiva-mahamrityunjaya" },
      { kind: "meditation", deityId: "rama", itemId: "rama-med-refuge" },
      { kind: "night", deityId: "shiva", itemId: "shiva-night-karpura" },
    ],
  },
  {
    id: "focus",
    title: { en: "A clear path", hi: "स्पष्ट मार्ग" },
    subtitle: {
      en: "Clear the way and steady the attention before you begin.",
      hi: "आरंभ से पूर्व मार्ग को स्वच्छ कर ध्यान को स्थिर करें।",
    },
    theme: "focus",
    items: [
      { kind: "meditation", deityId: "ganesha", itemId: "ganesha-med-clearing" },
      { kind: "shloka", deityId: "ganesha", itemId: "ganesha-vakratunda" },
      { kind: "meditation", deityId: "ganesha", itemId: "ganesha-med-beginnings" },
      { kind: "meditation", deityId: "shiva", itemId: "shiva-med-namah" },
    ],
  },
];

// ---------------------------------------------------------------------------
// SADHANAS — multi-day guided plans. Long plans are built by a local helper so
// the day arrays need not be hand-authored.
// ---------------------------------------------------------------------------

/** A rotating focus used to populate a generated sadhana's days. */
interface FocusBeat {
  title: Localized;
  focus: Localized;
  practice?: PracticeRef;
}

/**
 * Build a `days` array of the given length by rotating through a set of focus
 * beats, so each day feels distinct without hand-authoring every entry.
 */
function buildDays(length: number, beats: FocusBeat[]): SadhanaDay[] {
  const days: SadhanaDay[] = [];
  for (let i = 0; i < length; i++) {
    const beat = beats[i % beats.length];
    days.push({
      day: i + 1,
      title: beat.title,
      focus: beat.focus,
      practice: beat.practice,
    });
  }
  return days;
}

const ganeshaBeats: FocusBeat[] = [
  {
    title: { en: "Clearing the way", hi: "मार्ग साफ़ करना" },
    focus: {
      en: "Name one obstacle and set the intention to begin again.",
      hi: "एक बाधा को पहचानें और पुनः आरंभ का संकल्प लें।",
    },
    practice: { kind: "meditation", deityId: "ganesha", itemId: "ganesha-med-clearing" },
  },
  {
    title: { en: "A sacred beginning", hi: "शुभ आरंभ" },
    focus: {
      en: "Greet the day's first task as an offering.",
      hi: "दिन के पहले कार्य को एक अर्पण की तरह मिलें।",
    },
    practice: { kind: "meditation", deityId: "ganesha", itemId: "ganesha-med-beginnings" },
  },
  {
    title: { en: "Breath of stillness", hi: "स्थिरता की श्वास" },
    focus: {
      en: "Let the breath return you to a steady centre.",
      hi: "श्वास को स्थिर केंद्र में लौटने दें।",
    },
    practice: { kind: "meditation", deityId: "ganesha", itemId: "ganesha-med-breath" },
  },
  {
    title: { en: "Vakratunda", hi: "वक्रतुण्ड" },
    focus: {
      en: "Hold the verse for clarity in all you undertake.",
      hi: "हर कार्य में स्पष्टता हेतु श्लोक को धारण करें।",
    },
    practice: { kind: "shloka", deityId: "ganesha", itemId: "ganesha-vakratunda" },
  },
];

const shivaBeats: FocusBeat[] = [
  {
    title: { en: "Om Namah Shivaya", hi: "ॐ नमः शिवाय" },
    focus: {
      en: "Let the five syllables carry the mind to quiet.",
      hi: "पंचाक्षर मंत्र मन को शांति की ओर ले जाए।",
    },
    practice: { kind: "shloka", deityId: "shiva", itemId: "shiva-panchakshara" },
  },
  {
    title: { en: "The stillness within", hi: "भीतर की स्थिरता" },
    focus: {
      en: "Rest in the unmoving witness beneath all movement.",
      hi: "समस्त गतिविधि के नीचे अचल साक्षी में विश्राम करें।",
    },
    practice: { kind: "meditation", deityId: "shiva", itemId: "shiva-med-stillness" },
  },
  {
    title: { en: "Renewal", hi: "नवीनीकरण" },
    focus: {
      en: "Take refuge in the Mahamrityunjaya for healing.",
      hi: "उपचार हेतु महामृत्युंजय की शरण लें।",
    },
    practice: { kind: "meditation", deityId: "shiva", itemId: "shiva-med-mahamrityunjaya" },
  },
  {
    title: { en: "Quiet repetition", hi: "मौन जप" },
    focus: {
      en: "Soften surrender with each round of the mantra.",
      hi: "मंत्र की प्रत्येक आवृत्ति के साथ समर्पण को कोमल करें।",
    },
    practice: { kind: "meditation", deityId: "shiva", itemId: "shiva-med-namah" },
  },
  {
    title: { en: "Letting go", hi: "विसर्जन" },
    focus: {
      en: "Release one illusion you have been holding.",
      hi: "एक भ्रम को छोड़ दें जिसे आप थामे हुए थे।",
    },
    practice: { kind: "shloka", deityId: "shiva", itemId: "shiva-mahamrityunjaya" },
  },
];

const ramaBeats: FocusBeat[] = [
  {
    title: { en: "Rama-nama japa", hi: "राम-नाम जप" },
    focus: {
      en: "Rest the mind on the repetition of the name.",
      hi: "मन को नाम के जप पर स्थिर करें।",
    },
    practice: { kind: "meditation", deityId: "rama", itemId: "rama-med-japa" },
  },
  {
    title: { en: "The steady heart", hi: "स्थिर हृदय" },
    focus: {
      en: "Do what is right today with equanimity.",
      hi: "आज जो उचित है, उसे समता के साथ करें।",
    },
    practice: { kind: "meditation", deityId: "rama", itemId: "rama-med-dharma" },
  },
  {
    title: { en: "Taking refuge", hi: "शरणागति" },
    focus: {
      en: "Set down one burden and rest in trust.",
      hi: "एक भार को रखकर विश्वास में विश्राम करें।",
    },
    practice: { kind: "meditation", deityId: "rama", itemId: "rama-med-refuge" },
  },
  {
    title: { en: "The given word", hi: "दिया हुआ वचन" },
    focus: {
      en: "Keep one promise, however small, with care.",
      hi: "एक वचन को, चाहे छोटा ही, सावधानी से निभाएँ।",
    },
    practice: { kind: "shloka", deityId: "rama", itemId: "rama-taraka-nama" },
  },
  {
    title: { en: "The name as refuge", hi: "शरण रूप नाम" },
    focus: {
      en: "Let 'Rama, Rama' become a companion to the breath.",
      hi: "'राम, राम' श्वास का साथी बन जाए।",
    },
    practice: { kind: "shloka", deityId: "rama", itemId: "rama-nama" },
  },
];

export const sadhanas: Sadhana[] = [
  {
    id: "ganesha-9-day",
    title: { en: "Nine days with Ganesha", hi: "गणेश के साथ नौ दिन" },
    subtitle: {
      en: "Clear the path and begin anew.",
      hi: "मार्ग साफ़ करें और नए सिरे से आरंभ करें।",
    },
    length: 9,
    description: {
      en: "A nine-day practice to release obstacles and meet new beginnings with a calm, steady mind.",
      hi: "बाधाओं को छोड़ने और नई शुरुआतों को शांत, स्थिर मन से मिलने हेतु नौ-दिवसीय अभ्यास।",
    },
    deityId: "ganesha",
    days: buildDays(9, ganeshaBeats),
  },
  {
    id: "shiva-21-day",
    title: { en: "Twenty-one days with Shiva", hi: "शिव के साथ इक्कीस दिन" },
    subtitle: {
      en: "Settle into stillness and release.",
      hi: "स्थिरता और विमुक्ति में बसें।",
    },
    length: 21,
    description: {
      en: "A three-week immersion in the stillness of Shiva — mantra, meditation, and the steady art of letting go.",
      hi: "शिव की स्थिरता में तीन-सप्ताह की साधना — मंत्र, ध्यान और छोड़ने की स्थिर कला।",
    },
    deityId: "shiva",
    days: buildDays(21, shivaBeats),
  },
  {
    id: "rama-40-day",
    title: { en: "Forty days with Rama", hi: "राम के साथ चालीस दिन" },
    subtitle: {
      en: "Walk the path of the steady heart.",
      hi: "स्थिर हृदय के मार्ग पर चलें।",
    },
    length: 40,
    description: {
      en: "A forty-day mandala of devotion to Rama — the name as refuge, dharma as ground, and a heart that stays steady under trial.",
      hi: "राम के प्रति भक्ति का चालीस-दिवसीय मंडल — शरण रूप नाम, आधार रूप धर्म, और संकट में स्थिर रहने वाला हृदय।",
    },
    deityId: "rama",
    days: buildDays(40, ramaBeats),
  },
];

// ---------------------------------------------------------------------------
// DAILY QUESTIONS — gentle one-tap reflection prompts.
// ---------------------------------------------------------------------------
export const dailyQuestions: DailyQuestion[] = [
  {
    id: "dq-grateful",
    prompt: {
      en: "What is one thing you are grateful for today?",
      hi: "आज आप किस एक बात के लिए कृतज्ञ हैं?",
    },
  },
  {
    id: "dq-let-go",
    prompt: {
      en: "What is one thing you can let go of today?",
      hi: "आज आप किस एक बात को छोड़ सकते हैं?",
    },
  },
  {
    id: "dq-kindness",
    prompt: {
      en: "Where might you offer a little kindness today?",
      hi: "आज आप कहाँ थोड़ी करुणा अर्पित कर सकते हैं?",
    },
  },
  {
    id: "dq-intention",
    prompt: {
      en: "What is your quiet intention for the day ahead?",
      hi: "आने वाले दिन के लिए आपका मौन संकल्प क्या है?",
    },
  },
  {
    id: "dq-steady",
    prompt: {
      en: "What would help you stay steady today?",
      hi: "आज स्थिर बने रहने में आपकी क्या सहायता करेगा?",
    },
  },
  {
    id: "dq-rest",
    prompt: {
      en: "What can you set down before you sleep tonight?",
      hi: "आज रात सोने से पहले आप क्या रख सकते हैं?",
    },
  },
];

// ---------------------------------------------------------------------------
// HELPERS — lookups and reference resolution for the session player.
// ---------------------------------------------------------------------------

/** Look up a themed collection by id. */
export function getCollection(id: string): Collection | undefined {
  return collections.find((c) => c.id === id);
}

/** Look up a sadhana plan by id. */
export function getSadhana(id: string): Sadhana | undefined {
  return sadhanas.find((s) => s.id === id);
}

/** Deterministically pick the day's reflection prompt from the day of year. */
export function getDailyQuestion(dayOfYear: number): DailyQuestion {
  const count = dailyQuestions.length;
  // Guard against negatives / non-integers so the index is always in range.
  const index = ((Math.floor(dayOfYear) % count) + count) % count;
  return dailyQuestions[index];
}

/**
 * Resolve a PracticeRef into the data the session player needs. Returns
 * undefined if the deity (or a named item) cannot be found.
 *
 * When `itemId` is omitted, the deity's first sensible item for that kind is
 * chosen (first shloka, the aarti, first meditation, the nightPrayer).
 */
export function resolvePractice(ref: PracticeRef): ResolvedPractice | undefined {
  const deity = getDeity(ref.deityId);
  if (!deity) return undefined;

  const base = {
    kind: ref.kind,
    deityId: deity.id,
    deityName: deity.name,
    deityAccent: deity.accent,
  };

  switch (ref.kind) {
    case "meditation": {
      const med = ref.itemId
        ? deity.meditations.find((m) => m.id === ref.itemId)
        : deity.meditations[0];
      if (!med) return undefined;
      return {
        ...base,
        title: med.title,
        minutes: med.minutes,
        audio: med.audio,
      };
    }
    case "shloka": {
      const shloka = ref.itemId
        ? deity.shlokas.find((s) => s.id === ref.itemId)
        : deity.shlokas[0];
      if (!shloka) return undefined;
      return {
        ...base,
        title: shloka.title,
        audio: shloka.audio,
        transcript: {
          devanagari: shloka.devanagari,
          transliteration: shloka.transliteration,
          meaning: shloka.meaning,
        },
      };
    }
    case "aarti": {
      const aarti = deity.aarti;
      // aarti is a single item per deity; itemId (if given) must match.
      if (!aarti || (ref.itemId && aarti.id !== ref.itemId)) return undefined;
      return {
        ...base,
        title: aarti.title,
        audio: aarti.audio,
        transcript: {
          devanagari: aarti.devanagari,
          transliteration: aarti.transliteration,
          meaning: aarti.meaning,
        },
      };
    }
    case "night": {
      const night = deity.nightPrayer;
      if (!night || (ref.itemId && night.id !== ref.itemId)) return undefined;
      return {
        ...base,
        title: night.title,
        audio: night.audio,
        transcript: {
          devanagari: night.devanagari,
          transliteration: night.transliteration,
          meaning: night.meaning,
        },
      };
    }
    case "japa": {
      // Japa carries title only; the player supplies a loop and length.
      const title: Localized = {
        en: `Japa with ${deity.name.en}`,
        hi: `${deity.name.hi} के साथ जप`,
      };
      return { ...base, title };
    }
    default:
      return undefined;
  }
}
