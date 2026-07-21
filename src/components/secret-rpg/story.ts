import { Scene } from "./types";

const S = "/new_game_assets/Sanskriti_Idle.png";

export const STORY: Record<string, Scene> = {
  start: {
    id: "start",
    text: `📚 SANSKRITI'S FIRST DAY 📚

Her name is Sanskriti. She's 19, loves ML/AI, carries a silver MacBook everywhere, and drinks way too much coffee. Today is her FIRST DAY of college.

She stands in front of the mirror, adjusts her navy blazer over her white top, and gives herself a confident nod.

"You've got this. You've been preparing for this your whole life."

She's passionate, curious, and determined to make her mark in the world of technology. The campus awaits — full of knowledge, challenges, and probably some weird bugs.

But first... caffeine or knowledge?`,
    img: S,
    choices: [
      { text: "📚  Head to the library — knowledge calls!", next: "library" },
      { text: "☕  Grab coffee first — fuel the brain!", next: "cafeteria" },
    ],
    effects: "swipe",
  },

  cafeteria: {
    id: "cafeteria",
    text: `The campus cafeteria is CHAOS. Students everywhere — laptops open, notebooks scattered, someone is furiously debugging Python at a corner table.

Sanskriti spots a free table by the window. Perfect lighting, close to an outlet, great study spot.

But a ROGUE COFFEE MUG blocks her path! It's steaming angrily, hopping from foot to foot, ceramic body shaking with rage.

"Caffeine is MINE!" it seems to scream. "You shall not pass without proving yourself!"

Sanskriti sighs. "The cafeterias at this college are really something else..."

She takes a stance, ready to catch some flying cups.`,
    img: S,
    choices: [
      { text: "☕  Catch the falling coffee cups!", next: "coffeeFight" },
      { text: "🏃  Leave the mug behind, head to library", next: "library" },
    ],
    effects: "swipe",
  },

  coffeeFight: {
    id: "coffeeFight",
    text: `Coffee cups RAIN from the ceiling! Sanskriti dashes left and right, catching them mid-air. Pencils fall too — she dodges those like a total pro.

After an intense caffeine-catching session, she emerges VICTORIOUS, clutching a fresh cup of steaming coffee. The aroma alone gives her +10 CONFIDENCE.

"Best. Coffee. Ever."

She sips it triumphantly. The rogue mug slinks away, defeated.

Now — should she head straight to the library, or does she need a moment to savor this victory?`,
    img: S,
    choices: [
      { text: "☕  Sip triumphantly and head to the library", next: "libraryB" },
      { text: "🏃  Skip the victory lap, go straight", next: "library" },
    ],
    effects: "power",
  },

  library: {
    id: "library",
    text: `Sanskriti pushes open the heavy oak doors. The library smells like old books, dust, and ambition — her FAVORITE combination. She breathes it in.

"Ahhh. Knowledge."

But something blocks her path. A walking PENCIL — yellow body, angry eyes, pink eraser head twitching. It taps its wooden foot impatiently.

"SHARPEN THIS!" it squeaks, brandishing its pointy graphite tip.

Sanskriti raises an eyebrow. "You're literally made of wood and graphite. What are you gonna do, write me to death?"

The pencil trembles with rage. It does NOT appreciate being mocked.`,
    img: S,
    choices: [
      { text: "🎯  Challenge it to a PATTERN MATCHING duel!", next: "patternFight" },
      { text: "📱  Distract it with your phone (it loves Reels)", next: "phoneDistract" },
    ],
    effects: "mystery",
  },

  patternFight: {
    id: "patternFight",
    text: `Sanskriti challenges the Pencil to a PATTERN MATCHING duel!

The pencil shows arrow sequences — she has to repeat them perfectly. It starts simple, then gets harder. But Sanskriti's brain is WIRED for pattern recognition.

"Left, up, right, down... Child's play."

After three rounds, the pencil's graphite brain OVERHEATS. It snaps in half, defeated!

Sanskriti blows on her fingers like a gunslinger. "Pattern recognition. That's literally what I study. Did you think I'd lose?"

The pencil half hops away. "I'LL BE BACK IN CHAPTER 2!"`,
    img: S,
    choices: [
      { text: "📚  Enter the library, victorious!", next: "bugEntrance" },
    ],
    effects: "hit",
  },

  phoneDistract: {
    id: "phoneDistract",
    text: `Sanskriti whips out her phone and opens Instagram. The Pencil Enemy's eyes go WIDE.

"OOH, REELS!" it squeaks, completely forgetting the fight. It scurries off to watch cat compilations.

Sanskriti grins. "Works every time."

She wipes graphite fingerprints off her screen and walks into the library.

(Note to self: buy a screen protector. And maybe a thicker case.)`,
    img: S,
    choices: [
      { text: "📚  Sneak into the library", next: "bugEntrance" },
    ],
    effects: "swipe",
  },

  libraryB: {
    id: "libraryB",
    text: `CAFFEINE BUZZ ACTIVE! ☕⚡

Sanskriti strides into the library like she owns the place. The bookshelves seem taller. The silence seems quieter. She feels... POWERFUL.

She pulls out her silver MacBook and opens a terminal. Green code cascades down the screen like digital rain.

A Pencil Enemy near the coding section sees her and starts TREMBBLING.

"You want some of this?" she asks, fingers hovering over the keyboard.

The pencil shakes its eraser head frantically. "N-no thanks... I-I'll just be over here..."

Too late. She's already in the zone.`,
    img: S,
    choices: [
      { text: "💻  Code it away with TYPING SKILLS!", next: "codeType" },
      { text: "⚔  Strike first with a NOTEBOOK!", next: "pencilFightWin" },
    ],
    effects: "hit",
  },

  codeType: {
    id: "codeType",
    text: `Sanskriti FLIPS open her laptop and starts TYPING. Her fingers fly across the keyboard — she's in the ZONE.

Green code cascades like digital rain. PYTHON. ALGORITHM. NEURAL. TENSOR. DEBUG. She types each word with precision.

The Pencil Enemy stares, mesmerized... then SHORT-CIRCUITS! Sparks fly from its graphite tip as it collapses into a pile of sawdust.

Sanskriti closes her laptop with a SNAP.

"That's what happens when you bring a pencil to a coding fight."

+100 CODING CONFIDENCE. She feels unstoppable.`,
    img: S,
    choices: [
      { text: "💪  Walk confidently deeper into the library", next: "bugEntrance" },
    ],
    effects: "power",
  },

  pencilFightWin: {
    id: "pencilFightWin",
    text: `Sanskriti YEETS a heavy textbook at the Pencil Enemy. It doesn't see it coming — THWACK! The pencil shatters into splinters of wood and graphite.

"NOTE TO SELF: don't mess with a caffeinated CS student armed with 'Introduction to Algorithms.'"

She dusts off her hands, picks up her notebook (a bit battered, but intact), and continues deeper into the library.

Nothing can stop her now. Not pencils, not coffee mugs, not even her own imposter syndrome.`,
    img: S,
    choices: [
      { text: "📚  Storm deeper into the library!", next: "bugEntrance" },
    ],
    effects: "hit",
  },

  bugEntrance: {
    id: "bugEntrance",
    text: `Deep in the library, Sanskriti finds the PERFECT spot. A quiet corner, a window overlooking the campus, an empty desk with just enough space for her laptop and coffee.

She's about to sit down when...

SPLAT.

A Bug Enemy drops from the ceiling! It's a nasty CODE BUG — angry red eyes, six creepy legs, antennae twitching wildly. It's feeding on a pile of corrupted Python scripts.

Sanskriti sighs. "Of course. Right when I found the good seat."

The bug hisses menacingly. "YOUR CODE HAS ERRORS. LET ME FIX THEM... PERMANENTLY."

She cracks her knuckles and puts down her coffee. "You're about to be debugged."`,
    img: S,
    choices: [
      { text: "⚔  Smash it with a textbook! (FIGHT!)", next: "bugFight" },
      { text: "🧠  Outsmart it with LOGIC (QUIZ!)", next: "logicPuzzle" },
    ],
    effects: "mystery",
  },

  bugFight: {
    id: "bugFight",
    text: `Sanskriti grabs 'Introduction to Algorithms' (1200 pages of pure academic warfare) and enters the arena!

The Bug Enemy scurries around the dark room, leaving a trail of corrupted code behind it. She moves, dodges, throws items, and punches when it gets close.

After an intense battle, she brings the book down with a satisfying THWACK! The bug scatters into binary confetti!

Sanskriti wipes her brow. "Debugged."

She turns around — and the bookshelf behind her glows warm gold. Something's calling to her...

But first, she needs a moment. The fight took a lot out of her.`,
    img: S,
    choices: [
      { text: "💪  Type a motivational quote to restore energy!", next: "quoteFight" },
      { text: "✨  Investigate the glowing shelf now", next: "victory" },
    ],
    effects: "hit",
  },

  logicPuzzle: {
    id: "logicPuzzle",
    text: `The Bug Enemy tries to compute her next move. But Sanskriti's LOGIC is QUICKER!

It throws AI trivia at her — she catches every question and fires back the correct answer before it can blink.

"WHAT IS THE MEANING OF LIFE?" it screeches.

"42. NEXT QUESTION."

Its tiny bug brain overheats! 💥 It explodes into confetti of ones and zeroes.

Sanskriti smiles. "I've been studying for this my whole life."

+999 IQ! The study spot is almost hers. She feels a surge of energy but also a bit drained...

Just a little more motivation and she'll be ready for that glowing shelf.`,
    img: S,
    choices: [
      { text: "💪  Type a motivational quote to recharge!", next: "quoteFight" },
      { text: "✨  Head straight to the glowing shelf", next: "victory" },
    ],
    effects: "power",
  },

  quoteFight: {
    id: "quoteFight",
    text: `Sanskriti sits down, closes her eyes, and takes a deep breath. The bug fight drained her, but she knows exactly what she needs to hear.

Green text appears on her laptop screen — a quote, glowing in the dark. She needs to type it, word by word, to absorb its power.

"Come on, Sanskriti. You've survived every hard day so far. This is just another one."

She cracks her fingers and starts typing. Each word is a step forward. Each correct word fills her with more energy.

She's not just coding — she's RECLAIMING her confidence.`,
    img: S,
    choices: [
      { text: "💪  Type the quote and feel the power!", next: "quoteType" },
    ],
    effects: "power",
  },

  quoteType: {
    id: "quoteType",
    text: `The motivational quote flows through her fingers. Each word she types correctly lights up her heart. Mistakes just make her more determined.

After completing the quote, Sanskriti feels a warmth spread through her chest. She's ready. NO — she's MORE than ready.

The glowing bookshelf calls to her. Whatever's behind it... she can face it.

+1000 CONFIDENCE RESTORED! ✨`,
    img: S,
    choices: [
      { text: "✨  Investigate the glowing shelf!", next: "professorEncounter" },
    ],
    effects: "power",
  },

  professorEncounter: {
    id: "professorEncounter",
    text: `Sanskriti steps behind the glowing bookshelf. The world shifts — warm candlelight, old books, the smell of coffee and ink.

A man sits behind a mahogany desk. Grey-streaked beard, kind eyes behind round glasses, a worn tweed blazer. This is PROFESSOR SHARMA, the legendary CS professor.

He looks up and smiles. "Ah. The one who defeated the Bug Enemy. I've been expecting you."

Sanskriti blinks. "You... have?"

"Of course. Every semester, a student finds this place. It's a rite of passage. But to earn the SEAT — that perfect study spot by the window — you must pass one final test."

He stands up, cracks his knuckles, and pulls a CRUMPLED research paper from his drawer.

"Defend your thesis. Against ME."

The room darkens. Papers swirl. Professor Sharma teleports to the other side of the room, striking a fighting pose.

This is the FINAL BOSS. He has 5 HP — more than any enemy you've faced. But he's slower, giving you time to think.

Use your items wisely. Throw your phone, your laptop, your coffee. Punch when he gets close. The BRAIN power-up awaits the victor!`,
    img: S,
    choices: [
      { text: "⚔  Challenge Professor Sharma! (BOSS FIGHT)", next: "professorFight" },
    ],
    effects: "mystery",
  },

  professorFight: {
    id: "professorFight",
    text: `The final battle was LEGENDARY.

Sanskriti dodged flying research papers, threw her coffee mug at the professor's head, and landed a textbook-perfect punch right as he was explaining a bug in her code.

Professor Sharma staggers back, laughing. "WELL PLAYED!"

With a final THWACK of 'Introduction to Algorithms,' he goes down — but he's smiling.

"You've earned it," he says, pulling a glowing BRAIN keychain from his pocket. It pulses with warm pink light — the legendary BRAIN POWER-UP, representing her AI/ML knowledge.

Sanskriti catches it. A surge of energy flows through her. She feels invincible.

"Now go," the Professor says, vanishing into the shadows. "That study spot isn't going to claim itself."

+🧠 BRAIN POWER-UP ACQUIRED! +999 CONFIDENCE!`,
    img: S,
    choices: [
      { text: "✨  Claim your study spot!", next: "victory" },
    ],
    effects: "win",
  },

  victory: {
    id: "victory",
    text: `The glowing shelf reveals a quiet corner by the window — THE perfect study spot. Sunlight spills across an empty wooden desk.

Sanskriti sits down, places her coffee to the right, opens her MacBook, and pulls out a fresh notebook. On the first page, a line is already written:

"The journey of a thousand lines of code begins with a single 'Hello, World.'"

📖✨ She made it. Day 1: Complete!

The semester awaits. Bugs will come and go. Pencils will sharpen and break. Coffee will be spilled and drunk.

She looks down at the BRAIN keychain on her bag. It glows softly.

(P.S. The pencil enemies? They were just undergrads in disguise. The bugs? Real bugs. And Professor Sharma? He'll be back for the final exam.)`,
    img: S,
    choices: [
      { text: "🎉  Finish (Play Again?)", next: "start", sound: "win" },
    ],
    effects: "win",
  },


};
