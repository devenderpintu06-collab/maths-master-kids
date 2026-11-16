export interface BlogSectionBlock {
  headingEn: string;
  headingHi: string;
  bodyEn: string;
  bodyHi: string;
}

export interface BlogArticle {
  id: string;
  categoryEn: string;
  categoryHi: string;
  readTimeEn: string;
  readTimeHi: string;
  accentHex: string;
  badgeBgClass: string;
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  introEn: string;
  introHi: string;
  sections: BlogSectionBlock[];
  conclusionEn: string;
  conclusionHi: string;
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'remove-fear-of-maths',
    categoryEn: 'Parenting Guide',
    categoryHi: 'माता-पिता गाइड',
    readTimeEn: '3 min read',
    readTimeHi: '3 मिनट पढ़ें',
    accentHex: '#059669',
    badgeBgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    titleEn: "How to Remove the Fear of Maths in Kids: A Parent's Guide",
    titleHi: 'बच्चों के मन से गणित (Maths) का डर कैसे खत्म करें? (माता-पिता के लिए आसान गाइड)',
    summaryEn:
      'Six practical, stress-free habits parents can start today to replace maths anxiety with curiosity and confidence for Class 1 to 5 children.',
    summaryHi:
      'Class 1 से 5 के बच्चों में गणित का डर दूर कर आत्मविश्वास जगाने के 6 सरल और असरदार तरीके जो हर माता-पिता घर पर अपना सकते हैं।',
    introEn:
      'Many primary school children quietly begin fearing mathematics between Class 1 and Class 5—not because they lack ability, but because numbers start feeling like a test instead of a puzzle. The good news is that maths confidence is built mostly at home through calm encouragement and everyday experiences. Here are six practical steps every parent can use.',
    introHi:
      'Class 1 से 5 के बीच कई बच्चों के मन में गणित (Maths) को लेकर झिझक या डर बैठने लगता है। इसका कारण यह नहीं होता कि बच्चा कमजोर है, बल्कि अक्सर गणित को नंबरों के खेल की जगह एक कठिन परीक्षा की तरह पेश किया जाता है। घर के शांत माहौल और रोज़मर्रा के छोटे बदलावों से यह डर पूरी तरह दूर किया जा सकता है।',
    sections: [
      {
        headingEn: '1. Connect Maths to Daily Shopping and Home Life',
        headingHi: '1. गणित को रोज़मर्रा की खरीदारी और घर के कामों से जोड़ें',
        bodyEn:
          'When children see that maths belongs to real life, fear disappears. Ask your child to count fruits at the market, calculate total change from ₹50, read pizza slices as fractions, or measure cups while cooking. Small everyday conversations make addition and subtraction feel natural and useful.',
        bodyHi:
          'जब बच्चे देखते हैं कि गणित असली ज़िंदगी में काम आता है, तो उनका डर कम होने लगता है। सब्ज़ी या किराने की दुकान पर ₹50 या ₹100 के छुट्टे गिनवाना, घर में रोटियों या फल के बराबर हिस्से बांटना, और घड़ी देखकर समय पूछना जोड़-घटाव सिखाने के सबसे आसान तरीके हैं।',
      },
      {
        headingEn: '2. Never Scold Mistakes—Treat Errors as Clues',
        headingHi: '2. गलतियों पर डाँटें नहीं, उन्हें सीखने का हिस्सा मानें',
        bodyEn:
          'Scolding a child over a wrong sum creates lasting anxiety and makes them afraid to try. Instead, respond calmly: "Nice effort! Let us check why this happened." When mistakes feel safe, children ask more questions and stay curious rather than shutting down.',
        bodyHi:
          'गलत जवाब पर डाँटने या गुस्सा करने से बच्चा अगली बार कोशिश करने से घबराता है। इसके बजाय प्यार से कहें—"अच्छा प्रयास किया, चलो साथ में देखते हैं कहाँ चूक हुई।" जब बच्चों को गलती करने का डर नहीं रहता, तो वे खुलकर सवाल पूछते हैं और तेज़ी से सीखते हैं।',
      },
      {
        headingEn: '3. Teach Concepts Instead of Blind Memorization',
        headingHi: '3. रटने के बजाय अवधारणा (Concept) समझाएँ',
        bodyEn:
          'Rote memorization breaks down as soon as numbers get bigger. Help your child understand why 4 × 3 means four groups of three, or how borrowing works in subtraction using tens and ones blocks. Once the "why" is clear, speed follows naturally.',
        bodyHi:
          'सिर्फ रट लेने से बड़े सवाल आने पर बच्चा अटक जाता है। बच्चे को समझाएँ कि 4 × 3 का मतलब 3-3 के 4 समूह हैं, या घटाव में उधार (Borrow) लेने का असल अर्थ क्या है। जब "क्यों" समझ आ जाता है, तो कठिन सवाल भी आसान लगने लगते हैं।',
      },
      {
        headingEn: '4. Use Visual Digital Learning with Maths Master Kids',
        headingHi: '4. Maths Master Kids जैसे विज़ुअल डिजिटल गेम्स का उपयोग करें',
        bodyEn:
          'Interactive visuals turn abstract numbers into something children can actually see. Using Maths Master Kids visual block hints, the Number Line Hopper, and instant step-by-step explanations turns screen time into active, playful learning with star rewards.',
        bodyHi:
          'चित्रों और खेल के माध्यम से कठिन विषय भी मज़ेदार बन जाते हैं। Maths Master Kids में मिलने वाले Visual Hints, Number Line, Array Grid और सही जवाब पर मिलने वाले Stars बच्चों के लिए पढ़ाई को एक रोमांचक गेम बना देते हैं।',
      },
      {
        headingEn: '5. Keep Practice Short: 10–15 Minutes Every Day',
        headingHi: '5. रोज़ सिर्फ 10–15 मिनट का छोटा और नियमित अभ्यास कराएँ',
        bodyEn:
          'One focused 10-question quiz daily beats a tiring two-hour weekend cram session. Short daily sessions keep concentration sharp, build steady neural pathways, and leave kids feeling proud rather than exhausted.',
        bodyHi:
          'हफ़्ते के अंत में दो घंटे लगातार पढ़ाने से बेहतर है कि रोज़ सिर्फ 10 से 15 मिनट का एक 10-सवाल वाला क्विज़ करवाया जाए। छोटा अभ्यास बच्चे की एकाग्रता बनाए रखता है और थकान भी नहीं होने देता।',
      },
      {
        headingEn: '6. Avoid Comparing Your Child with Others',
        headingHi: '6. अपने बच्चे की तुलना दूसरे बच्चों से न करें',
        bodyEn:
          'Every child learns at a unique pace. Comparing marks with classmates or siblings lowers self-esteem and builds resentment toward the subject. Celebrate your own child’s personal improvement—going from 5/10 to 7/10 is a real victory worth praising.',
        bodyHi:
          'हर बच्चे की सीखने की गति अलग होती है। भाई-बहन या कक्षा के दूसरे बच्चों से तुलना करने पर आत्मविश्वास टूटता है। अपने बच्चे की अपनी प्रगति की सराहना करें—अगर वह पहले 5/10 लाता था और आज 7/10 लाया है, तो यही उसकी असली जीत है।',
      },
    ],
    conclusionEn:
      'With patience, encouragement, and 10 playful minutes a day, any child in Classes 1 to 5 can grow from fearing maths to genuinely enjoying it.',
    conclusionHi:
      'धैर्य, प्रोत्साहन और रोज़ के 10 मिनट के मज़ेदार अभ्यास से Class 1 से 5 का हर बच्चा गणित से डरने के बजाय उसे पसंद करने लगेगा।',
  },
  {
    id: 'master-tables-and-mental-math',
    categoryEn: 'Study Tricks',
    categoryHi: 'आसान ट्रिक्स',
    readTimeEn: '3 min read',
    readTimeHi: '3 मिनट पढ़ें',
    accentHex: '#2563EB',
    badgeBgClass: 'bg-blue-50 text-blue-700 border-blue-200',
    titleEn: '5 Easy Tricks to Help Class 1–5 Kids Master Multiplication Tables & Mental Math',
    titleHi: 'Class 1 से 5 के बच्चों को पहाड़े (Tables) और जोड़-घटाव जल्दी याद कराने के 5 आसान तरीके',
    summaryEn:
      'Discover skip counting, doubling tricks, the 9-times finger method, and tens-ones splitting so primary students calculate swiftly without stress.',
    summaryHi:
      'पहाड़े और जोड़-घटाव को रटने के बजाय पैटर्न, दोगुना करने की तकनीक और 9 के पहाड़े की मज़ेदार ट्रिक से तेज़ कैलकुलेशन सीखें।',
    introEn:
      'Multiplication tables and quick addition or subtraction are the foundation of all primary school maths. Yet forcing children to chant tables mechanically often leads to confusion under exam pressure. These five simple, kid-friendly tricks make tables and mental calculations easy to remember for Classes 1 to 5.',
    introHi:
      'Class 1 से 5 तक के बच्चों के लिए पहाड़े (Tables) और तेज़ जोड़-घटाव गणित की नींव होते हैं। लेकिन बिना समझे लगातार रटाने से बच्चे परीक्षा में भूल जाते हैं। नीचे दिए गए 5 आसान तरीके बच्चों को पहाड़े और मानसिक गणना खेल-खेल में पक्का करा देते हैं।',
    sections: [
      {
        headingEn: '1. Start with Skip Counting & Rhythm (Class 1–2)',
        headingHi: '1. गिनती छोड़कर (Skip Counting) और लय के साथ शुरुआत करें',
        bodyEn:
          'Before introducing full tables, practice skip counting aloud while clapping or hopping: 2, 4, 6, 8, 10 or 5, 10, 15, 20. Music and movement help Class 1 and 2 students remember number patterns effortlessly, making the 2, 5, and 10 tables stick in days.',
        bodyHi:
          'पूरा पहाड़ा शुरू करने से पहले ताली या कदमताल के साथ गिनती छोड़-छोड़कर बोलने का अभ्यास कराएँ—जैसे 2, 4, 6, 8, 10 या 5, 10, 15, 20। लय और खेल से 2, 5 और 10 के पहाड़े कुछ ही दिनों में याद हो जाते हैं।',
      },
      {
        headingEn: '2. Use the Doubling Trick for 4 and 8 Tables',
        headingHi: '2. दोगुना (Doubling) करने की ट्रिक से 4 और 8 का पहाड़ा सीखें',
        bodyEn:
          'Kids do not need to memorize every table from scratch. Teach them that the 4 times table is simply double the 2 times table, and the 8 times table is double the 4 times table! For instance, if 2 × 6 = 12, then 4 × 6 = 24, and 8 × 6 = 48.',
        bodyHi:
          'हर पहाड़ा बिल्कुल नए सिरे से याद करने की ज़रूरत नहीं है। बच्चों को बताएँ कि 4 का पहाड़ा 2 के पहाड़े का दोगुना होता है, और 8 का पहाड़ा 4 के पहाड़े का दोगुना! जैसे 2 × 6 = 12, तो 4 × 6 = 24 और 8 × 6 = 48 होगा।',
      },
      {
        headingEn: '3. Play the Magical 9-Times Finger Trick',
        headingHi: '3. उँगलियों का जादू: 9 के पहाड़े की सबसे आसान ट्रिक',
        bodyEn:
          'Hold all ten fingers up. To find 9 × 4, fold down the 4th finger from the left. Count the fingers to the left of the folded finger (3) and to the right (6)—the answer is 36! Notice also that every two-digit answer in the 9 table adds up to 9 (1+8, 2+7, 3+6).',
        bodyHi:
          'दोनों हाथों की दस उँगलियाँ सामने रखें। 9 × 4 जानने के लिए बाएँ से चौथी उँगली मोड़ लें। मुड़ी उँगली के बाईं ओर 3 उँगलियाँ और दाईं ओर 6 उँगलियाँ दिखेंगी—यानी जवाब 36! साथ ही 9 के पहाड़े के हर जवाब के अंकों का जोड़ हमेशा 9 होता है।',
      },
      {
        headingEn: '4. Split Tens and Ones for Fast Addition & Subtraction',
        headingHi: '4. जोड़-घटाव के लिए दहाई (Tens) और इकाई (Ones) को अलग करें',
        bodyEn:
          'For Class 2–4 students, adding 38 + 25 in the head becomes effortless by splitting: 30 + 20 = 50, then 8 + 5 = 13, so 50 + 13 = 63. For subtraction like 62 − 19, teach the friendly jump trick: subtract 20 to get 42, then add 1 back to get 43.',
        bodyHi:
          'मानसिक जोड़ के लिए संख्याओं को तोड़ें: 38 + 25 करने के लिए पहले 30 + 20 = 50 और फिर 8 + 5 = 13 जोड़कर 63 बनाएँ। इसी तरह 62 − 19 जैसे घटाव में पहले 20 घटाकर 42 लाएँ और फिर 1 वापस जोड़कर 43 पाएँ।',
      },
      {
        headingEn: '5. Practice Commutative Pairs & Fact Families',
        headingHi: '5. उल्टे-सीधे जोड़े (Commutative Pairs) और Fact Families अपनाएँ',
        bodyEn:
          'Show children that 3 × 7 and 7 × 3 always give 21—which immediately cuts table memorization in half! Connect multiplication directly to division: knowing 6 × 8 = 48 automatically solves 48 ÷ 6 = 8 and 48 ÷ 8 = 6.',
        bodyHi:
          'बच्चों को समझाएँ कि 3 × 7 और 7 × 3 का जवाब हमेशा 21 ही होता है—इससे आधे पहाड़े अपने आप याद हो जाते हैं। साथ ही 6 × 8 = 48 याद होने पर 48 ÷ 6 = 8 और 48 ÷ 8 = 6 भी तुरंत हल हो जाता है।',
      },
    ],
    conclusionEn:
      'Combine these five playful tricks with our Visual Lab Array Builder and Daily Mixed Quizzes, and watch your child master tables faster than ever.',
    conclusionHi:
      'इन 5 ट्रिक्स को Visual Lab के Array Grid और Daily Quiz के साथ आज़माएँ—बच्चे बिना दबाव के तेज़ी से पहाड़े और जोड़-घटाव सीख जाएँगे।',
  },
  {
    id: 'ten-minutes-daily-mental-math',
    categoryEn: 'Brain Science',
    categoryHi: 'ब्रेन डेवलपमेंट',
    readTimeEn: '4 min read',
    readTimeHi: '4 मिनट पढ़ें',
    accentHex: '#7C3AED',
    badgeBgClass: 'bg-purple-50 text-purple-700 border-purple-200',
    titleEn: "How Just 10 Minutes of Daily Mental Math Practice Sharpens a Child's Brain",
    titleHi: 'रोज़ सिर्फ 10 मिनट की Mental Math प्रैक्टिस बच्चों का दिमाग कैसे तेज़ करती है?',
    summaryEn:
      'Discover how just 10 minutes of daily mental calculation acts like a brain gym—boosting working memory, focus, speed, confidence, and everyday decision-making.',
    summaryHi:
      'जानें कि बिना कैलकुलेटर के रोज़ सिर्फ 10 मिनट की Mental Math प्रैक्टिस कैसे बच्चों के दिमाग की कसरत, याददाश्त, एकाग्रता और आत्मविश्वास को तेज़ बनाती है।',
    introEn:
      'In today’s world, mobile phones and calculators are used for even the smallest calculations. Yet when it comes to a child’s brain development, Mental Math—the art of solving calculations in the mind without paper, pen, or a calculator—is nothing short of a blessing.\n\nThe best part is that children do not need to study for hours to benefit. Just 10 minutes of regular daily practice can sharpen their brains like a supercomputer. Let us see how:',
    introHi:
      'आज के समय में हर छोटी-बड़ी गणना (Calculation) के लिए मोबाइल या कैलकुलेटर का इस्तेमाल होने लगा है। लेकिन जब बात बच्चों के दिमागी विकास की आती है, तो मेंटल मैथ (Mental Math) यानी बिना कॉपी-पेन या कैलकुलेटर के मन में ही हिसाब लगाने की कला किसी वरदान से कम नहीं है।\n\nअच्छी बात यह है कि इसके लिए बच्चों को घंटों पढ़ाई करने की ज़रूरत नहीं है। रोज़ सिर्फ 10 मिनट की नियमित प्रैक्टिस उनके दिमाग को किसी सुपरकंप्यूटर की तरह तेज़ बना सकती है। आइए जानते हैं कैसे:',
    sections: [
      {
        headingEn: '1. Works Like a Brain Gym (दिमाग की बेहतरीन कसरत)',
        headingHi: '1. दिमाग की बेहतरीन कसरत (Brain Gym)',
        bodyEn:
          'Just as physical exercise keeps our bodies fit and strong, Mental Math keeps the brain active and sharp. When a child solves 25 + 18 or 6 × 7 in their head, both the left (logical) and right (creative) sides of the brain work together, creating stronger neural connections.',
        bodyHi:
          'जिस तरह शारीरिक व्यायाम हमारे शरीर को फिट और मज़बूत रखता है, ठीक उसी तरह Mental Math दिमाग को सक्रिय और तेज़ बनाए रखता है। जब बच्चा मन में 25 + 18 या 6 × 7 जैसे सवाल हल करता है, तो दिमाग के तार्किक और रचनात्मक दोनों हिस्से एक साथ काम करते हैं, जिससे दिमाग के न्यूरल कनेक्शन और मज़बूत होते हैं।',
      },
      {
        headingEn: '2. Strengthens Working Memory',
        headingHi: '2. याददाश्त (Working Memory) को मज़बूत बनाता है',
        bodyEn:
          'While solving a question mentally, a child must hold the numbers in their mind for a few seconds and move step by step to reach the answer. This directly exercises Working Memory, which improves retention not only in maths but also in science, reading, and general knowledge.',
        bodyHi:
          'मन में सवाल हल करते समय बच्चे को कुछ सेकंड के लिए संख्याओं को दिमाग में याद रखना पड़ता है और चरण-दर-चरण आगे बढ़कर सही जवाब निकालना होता है। इससे Working Memory मज़बूत होती है, जिसका सीधा लाभ गणित के साथ-साथ विज्ञान, भाषा और अन्य विषयों को याद रखने में भी मिलता है।',
      },
      {
        headingEn: '3. Boosts Focus and Concentration',
        headingHi: '3. एकाग्रता (Focus & Concentration) में सुधार',
        bodyEn:
          'A single moment of distraction during mental calculation makes you lose track of the numbers. Therefore, spending 10 focused minutes solving mental math questions every day naturally trains children to stay attentive, calm, and less prone to careless mistakes.',
        bodyHi:
          'मानसिक गणना करते समय अगर ध्यान ज़रा भी भटके, तो संख्याएँ दिमाग से निकल जाती हैं। इसलिए रोज़ सिर्फ 10 मिनट ध्यान लगाकर Mental Math हल करने से बच्चों की एकाग्रता (Focus) अपने आप बढ़ती है और पढ़ाई में होने वाली लापरवाही की गलतियाँ कम होती हैं।',
      },
      {
        headingEn: '4. Builds Self-Confidence',
        headingHi: '4. आत्मविश्वास (Self-Confidence) बढ़ता है',
        bodyEn:
          'When children solve questions faster than their classmates or give quick answers without counting on their fingers, their self-confidence grows naturally. The fear of maths disappears and is replaced by curiosity and excitement to learn more.',
        bodyHi:
          'जब बच्चे कक्षा में बाकी साथियों से पहले सवाल हल कर लेते हैं या बिना उंगलियों पर गिने तुरंत सही जवाब देते हैं, तो उनके अंदर गजब का आत्मविश्वास पैदा होता है। गणित का डर खत्म हो जाता है और नया सीखने की उत्सुकता बढ़ती है।',
      },
      {
        headingEn: '5. Saves Valuable Time in Exams',
        headingHi: '5. परीक्षा (Exams) में समय की बचत',
        bodyEn:
          'Students who practice Mental Math regularly do not waste time writing out tiny steps for simple additions, subtractions, or multiplications on rough paper. Because they calculate basic steps in their head, they get extra time during school tests to focus calmly on tougher questions.',
        bodyHi:
          'जो बच्चे रोज़ Mental Math का अभ्यास करते हैं, उन्हें परीक्षा में छोटे-छोटे जोड़, घटाव या गुणा करने के लिए बार-बार रफ़ पेज भरने की ज़रूरत नहीं पड़ती। बुनियादी गणनाएँ मन में जल्दी हल होने से कठिन सवालों के लिए पर्याप्त समय बच जाता है।',
      },
      {
        headingEn: '6. Smarter Decision-Making in Everyday Life',
        headingHi: '6. रोज़मर्रा के जीवन में स्मार्ट फैसले',
        bodyEn:
          'Whether checking change after buying snacks at a shop, counting points in a game, or estimating time left to reach school, Mental Math teaches children to think quickly and logically in real life—making them smart, aware, and independent.',
        bodyHi:
          'दुकान से सामान खरीदने के बाद बचे हुए पैसे गिनना हो, खेल में स्कोर जोड़ना हो या स्कूल पहुँचने के समय का अंदाज़ा लगाना हो—Mental Math बच्चों को असल ज़िंदगी में तेज़ी से और समझदारी से निर्णय लेने की क्षमता देता है।',
      },
      {
        headingEn: 'How to Start 10-Minute Practice at Home?',
        headingHi: 'घर पर 10 मिनट की प्रैक्टिस कैसे शुरू करें?',
        bodyEn:
          'Turn It Into a Playful Game: Instead of making it feel like strict homework, ask fun oral puzzles during dinner, evening walks, or travel time—such as "If you have 15 chocolates and give 6 to a friend, how many are left?"\n\nUse Guided Digital Quizzes: Encourage your child to play the 10-Question Daily Practice or operation quizzes on Maths Master Kids for just 10 minutes a day. Visual hints, instant stars, and voice feedback keep practice joyful and stress-free.',
        bodyHi:
          'खेल के रूप में करें: इसे भारी होमवर्क बनाने के बजाय खाने की मेज़ पर, शाम की सैर या सफर के दौरान मज़ेदार पहेलियों की तरह पूछें—जैसे "अगर आपके पास 15 चॉकलेट हैं और 6 दोस्त को दे दीं, तो कितनी बचीं?"\n\nडिजिटल क्विज़ का सहारा लें: बच्चे को रोज़ सिर्फ 10 मिनट Maths Master Kids पर Daily Practice या 10-Question Quiz खेलने के लिए प्रेरित करें। तुरंत मिलने वाले Stars, Picture Hints और मज़ेदार इंटरफ़ेस से प्रैक्टिस बिना किसी तनाव के खेल जैसी बन जाती है।',
      },
    ],
    conclusionEn:
      'Conclusion: Just 10 minutes of daily Mental Math practice is a small habit that creates a big difference. It not only helps children score higher in Mathematics, but also builds a sharp, focused, and confident mind for life.',
    conclusionHi:
      'निष्कर्ष: रोज़ सिर्फ 10 मिनट की Mental Math प्रैक्टिस एक छोटी-सी आदत है जो बहुत बड़ा बदलाव लाती है। यह न केवल बच्चों को गणित में अच्छे अंक दिलाती है, बल्कि जीवन भर के लिए उनके दिमाग को तेज़, एकाग्र और आत्मविश्वासी बनाती है।',
  },
  {
    id: 'history-of-maths-stone-age-to-space-age',
    categoryEn: 'Maths Story',
    categoryHi: 'गणित की कहानी',
    readTimeEn: '4 min read',
    readTimeHi: '4 मिनट पढ़ें',
    accentHex: '#D97706',
    badgeBgClass: 'bg-amber-50 text-amber-800 border-amber-200',
    titleEn: 'The Fascinating History of Maths: From Stone Age to Space Age',
    titleHi: 'गणित (Maths) की रोचक कहानी: जन्म से लेकर आज तक का सफर',
    summaryEn:
      'Travel from tally marks on stones in the Stone Age to India’s invention of Zero (0), space rockets, computers, and modern science.',
    summaryHi:
      'पाषाण युग की गिनती और मिस्र के पिरामिड से लेकर भारत के शून्य (0), व्यापार, अंतरिक्ष विज्ञान और आज के कंप्यूटर युग तक की पूरी कहानी।',
    introEn:
      'Have you ever wondered what our lives would look like if the world had no numbers (1, 2, 3...)? The mathematics we read in school textbooks today has a history spanning thousands of years. It was not created by a single person’s mind, but grew as a miracle out of the everyday needs of human civilization. Let us explore the complete story of maths from its birth to the modern day.',
    introHi:
      'क्या आपने कभी सोचा है कि अगर दुनिया में नंबर (1, 2, 3...) न होते तो हमारी ज़िंदगी कैसी होती? आज हम जिस गणित (Mathematics) को स्कूल की किताबों में पढ़ते हैं, उसका इतिहास हजारों साल पुराना है। यह किसी एक इंसान के दिमाग की उपज नहीं, बल्कि पूरी मानव सभ्यता की ज़रूरतों से पैदा हुआ एक चमत्कार है। आइए जानते हैं गणित के जन्म से लेकर आज तक की पूरी कहानी।',
    sections: [
      {
        headingEn: '1. When and How Was Maths Born?',
        headingHi: '1. गणित का जन्म कब और कैसे हुआ?',
        bodyEn:
          'Mathematics began when early humans lived in caves, before paper or written language even existed. Humans first needed counting when they started farming and raising animals. To keep track of livestock and fruits, they used fingers, small pebbles, and tally marks carved onto bones.\n\nAround 5,000 years ago, mathematics took a structured form in the civilizations of Mesopotamia (modern-day Iraq) and ancient Egypt. The Egyptians invented geometry to build towering pyramids and re-measure farmland boundaries after Nile River floods.',
        bodyHi:
          'गणित की शुरुआत तब हुई जब आदिमानव (Early Humans) गुफाओं में रहते थे। उस समय न तो कागज़ था और न ही कोई भाषा। इंसान को सबसे पहले गिनती की ज़रूरत तब पड़ी जब उसने खेती और पशुपालन शुरू किया। वह अपने पालतू जानवरों और फलों का हिसाब रखने के लिए उंगलियों, छोटे पत्थरों, और हड्डियों पर लकीरें (Tally Marks) खींचता था।\n\nलगभग 5,000 साल पहले मेसोपोटामिया (आज का इराक) और प्राचीन मिस्र (Egypt) की सभ्यताओं में गणित ने व्यवस्थित रूप लिया। मिस्र के लोगों ने विशाल पिरामिड बनाने और नील नदी की बाढ़ के बाद खेतों की ज़मीन नापने के लिए ज्यामिति (Geometry) का आविष्कार किया।',
      },
      {
        headingEn: "2. India's Greatest Contribution: Zero (0) and the Decimal System",
        headingHi: '2. भारत का सबसे बड़ा योगदान: शून्य (0) और दशमलव',
        bodyEn:
          'The biggest turning point in the history of mathematics happened in ancient India. The digits 1 to 9 and the decimal system used across the entire world today are gifts from India.\n\nGreat Indian mathematicians Aryabhata and Brahmagupta gave the world the concept of Zero (0). The invention of zero sparked a revolution in mathematics, because without it, writing large numbers and performing complex calculations was impossible. Later, through Arab scholars and traders, this knowledge spread to Europe and the rest of the world.',
        bodyHi:
          "गणित के इतिहास में सबसे बड़ा मोड़ प्राचीन भारत में आया। आज पूरी दुनिया जिस 1 से 9 तक के अंकों और दशमलव प्रणाली (Decimal System) का इस्तेमाल करती है, वह भारत की ही देन है।\n\nमहान भारतीय गणितज्ञ आर्यभट्ट और ब्रह्मगुप्त ने दुनिया को 'शून्य' (Zero - 0) की अवधारणा दी। शून्य के आविष्कार ने गणित की दुनिया में क्रांति ला दी, क्योंकि इसके बिना बड़ी संख्याएं लिखना और जटिल गणनाएं करना असंभव था। बाद में अरब व्यापारियों के ज़रिए यह ज्ञान यूरोप और पूरी दुनिया में फैला।",
      },
      {
        headingEn: '3. How the Use of Maths Grew in Daily Human Life',
        headingHi: '3. इंसानी ज़िंदगी में गणित का उपयोग कैसे बढ़ा?',
        bodyEn:
          'As humanity progressed, mathematics became a natural part of everyday life:\n\nTrade and Money: Once the barter system ended and coins and currency notes arrived, maths became essential for keeping track of transactions, profit and loss, and interest.\n\nTime and Calendars: To measure days, months, years, and clock hours, people used maths to track the motion of the Sun and Moon.\n\nHomes and City Construction: Building strong houses, bridges, and roads required exact calculations of length, width, and weight.',
        bodyHi:
          'जैसे-जैसे इंसान ने तरक्की की, गणित हमारी रोज़मर्रा की ज़िंदगी का हिस्सा बनता गया:\n\nव्यापार और पैसा: जब वस्तुओं के बदले वस्तुएं देने (Barter System) का दौर खत्म हुआ और सिक्के व नोट आए, तो लेन-देन, लाभ-हानि और ब्याज का हिसाब रखने के लिए गणित ज़रूरी हो गया।\n\nसमय और कैलेंडर: दिन, महीने, साल और घड़ी का समय तय करने के लिए सूरज और चांद की चाल को गणित से ही नापा गया।\n\nघर और शहर निर्माण: मज़बूत घर, पुल और सड़कें बनाने के लिए लंबाई, चौड़ाई और वज़न का सटीक हिसाब ज़रूरी था।',
      },
      {
        headingEn: '4. The Role of Maths in Science',
        headingHi: '4. विज्ञान (Science) में गणित की भूमिका',
        bodyEn:
          'The great scientist Galileo once said, "Mathematics is the language in which God has written the universe." Science and mathematics are two sides of the same coin.\n\nSpace Science: The speed and exact angle required to launch a rocket to the Moon or Mars are all calculated using mathematical formulas.\n\nComputers and Mobiles: The smartphone or laptop you are reading this article on right now runs on binary mathematical code (0 and 1). Artificial Intelligence (AI) and the Internet are also built on mathematics.\n\nMedicine: From calculating safe medicine dosages to operating X-ray and MRI machines, maths plays a vital role in healthcare.',
        bodyHi:
          'महान वैज्ञानिक गैलीलियो ने कहा था, "गणित वह भाषा है जिसमें ईश्वर ने इस ब्रह्मांड को लिखा है।" विज्ञान और गणित एक ही सिक्के के दो पहलू हैं।\n\nअंतरिक्ष विज्ञान (Space): रॉकेट को चांद या मंगल ग्रह पर किस रफ़्तार और किस कोण (Angle) से भेजना है, यह सब गणित के फॉर्मूलों से तय होता है।\n\nकंप्यूटर और मोबाइल: आज आप जिस मोबाइल या लैपटॉप पर यह लेख पढ़ रहे हैं, वह भी गणित के बाइनरी कोड (0 और 1) पर काम करता है। आर्टिफिशियल इंटेलिजेंस (AI) और इंटरनेट की नींव भी गणित ही है।\n\nचिकित्सा (Medical): दवाइयों की सही मात्रा तय करने से लेकर एक्स-रे और MRI मशीनों तक में गणित का उपयोग होता है।',
      },
      {
        headingEn: '5. Where Would We Be Without Maths?',
        headingHi: '5. गणित के बिना हम क्या होते?',
        bodyEn:
          'If mathematics were removed from the world today, modern civilization would come to a standstill in an instant. We would not be able to tell time on a clock, banks and money would have no records, mobile networks would fail, buildings could not stand safely, and weather forecasts would vanish. Without maths, humanity might still be living in the Stone Age.',
        bodyHi:
          'अगर आज दुनिया से गणित को हटा दिया जाए, तो पूरी आधुनिक सभ्यता एक पल में रुक जाएगी। न तो घड़ी में समय पता चलेगा, न बैंक और पैसे का कोई हिसाब रहेगा, न मोबाइल नेटवर्क काम करेंगे, न कोई इमारत खड़ी हो पाएगी और न ही मौसम की भविष्यवाणी हो सकेगी। गणित के बिना इंसान आज भी शायद पाषाण युग (Stone Age) में ही जी रहा होता।',
      },
    ],
    conclusionEn:
      'Conclusion: This journey of maths, which began with counting pebbles, has reached supercomputers and space travel today. Maths is not merely a subject for solving textbook sums—it is our most powerful tool for thinking clearly and understanding the world.',
    conclusionHi:
      'निष्कर्ष: पत्थरों की गिनती से शुरू हुआ गणित का यह सफर आज सुपरकंप्यूटर और अंतरिक्ष यात्रा तक पहुँच चुका है। गणित केवल किताबों के सवाल हल करने का विषय नहीं, बल्कि हमारे सोचने और दुनिया को समझने का सबसे शक्तिशाली ज़रिया है।',
  },
];
