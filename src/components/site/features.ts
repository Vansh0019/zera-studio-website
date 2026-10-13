import { pricing } from "@/config/site";

/**
 * The feature pages (2026-10-13, his ask: rank for every feature, "AI video editor" above all). One entry per page,
 * rendered by `FeaturePage.astro` at `/<slug>/`. The home page targets "AI video editor (for Android)"; each page
 * here targets one feature's searches, picked from the keyword research of 2026-10-13: winnable long-tail queries
 * with real intent (Hinglish captions for reels, copying a reel's editing style, auto B-roll on Android).
 *
 * Every fact must be true of the app today. Sources: `functions/src/config/credits/config.ts` (prices, pro-rata by the
 * second), `brollPlan.function.ts` (3 min, Pexels, 3 a day), `videoEditReference.function.ts` (3 a day),
 * `upload_provider.dart` (1–15 clips, the reference supplies the soundtrack), `engine/export/ExportSettings.kt`
 * (480p–4K, 30/60 fps), no watermark anywhere in the export path. Change a number there, change it here.
 */

export interface Feature {
  slug: string;
  /** Label in the menu and the related-features list. */
  menu: string;
  /** `<title>`, at most 60 characters. */
  title: string;
  /** Meta description, at most ~155 characters. */
  description: string;
  kicker: string;
  /** The page's one H1: the search phrase, said the way a person would. */
  h1: string;
  lead: string;
  facts: [string, string][];
  steps: { t: string; d: string }[];
  /** "What Zera does" and "what stays yours to change". */
  does: string[];
  yours: string[];
  /** Limits and cost, as rows. */
  limits: [string, string][];
  example: string;
  who: { t: string; d: string }[];
  faqs: { q: string; a: string }[];
}

const W = pricing.welcomeCredits;

export const features: Feature[] = [
  {
    slug: "auto-b-roll",
    menu: "AI B-roll",
    title: "Auto B-Roll App for Android: AI Adds B-Roll | Zera",
    description:
      "Upload a talking video up to 3 minutes. Zera transcribes it and adds stock B-roll, motion graphics, zooms and captions you can edit on your phone.",
    kicker: "AI B-roll",
    h1: "Add B-roll to talking videos, automatically",
    lead:
      "Record yourself talking and drop the clip into Zera. The AI does the part that usually takes hours: it listens to every line, finds the moments that need something to look at, and cuts in B-roll, motion graphics, punch-in zooms and word-by-word captions. The edit opens on a real timeline, so every choice it made is yours to change.",
    facts: [["Up to 3 min", "per video"], ["30 credits", "a minute"], ["English, Hindi", "and Hinglish speech"], ["No watermark", "on export"]],
    steps: [
      { t: "Pick a talking video", d: "Any clip up to three minutes from your gallery: a tip, a review, a story, a vlog. One take is enough." },
      { t: "Zera listens and plans", d: "It transcribes what you say, works out what each line is about, and plans where B-roll, graphics, zooms and captions go." },
      { t: "Finish it in the editor", d: "The edit opens on the timeline. Swap a clip, move a zoom, restyle the captions, then export in up to 4K." },
    ],
    does: [
      "Stock B-roll matched to what you are saying, searched from Pexels' library of free-to-use footage",
      "Animated motion graphics for your words: titles, lists, numbers and callouts",
      "Punch-in zooms on the lines that land",
      "Word-by-word captions, in English, Hindi or Hinglish",
    ],
    yours: [
      "Every B-roll clip, graphic, zoom and caption is its own item on the timeline: trim it, replace it, move it or delete it",
      "Restyle the captions: 28 animations, font, colour, glow and outline",
      "Add music, filters, transitions and text like any other project",
      "Export at 480p, 720p, 1080p, 2K or 4K, at 30 or 60 fps",
    ],
    limits: [
      ["Your video", "A talking video up to 3 minutes"],
      ["Cost", "30 credits a minute, charged by the second"],
      ["Daily limit", "3 AI B-roll runs a day"],
      ["If it fails", "The credits come back"],
      ["Result", "Opens in the editor; export from 480p to 4K"],
    ],
    example: `A 90-second video costs 45 credits. The ${W} free credits every new phone gets cover a little over three minutes of AI B-roll.`,
    who: [
      { t: "Talking-head creators", d: "Tips, explainers and opinions that need visuals between the words." },
      { t: "Coaches and teachers", d: "Lessons that land better when the screen shows what you describe." },
      { t: "Small businesses", d: "Product and shop videos without hiring an editor." },
      { t: "Podcasters", d: "Short clips from an episode that hold attention on Reels and Shorts." },
    ],
    faqs: [
      { q: "What is B-roll?", a: "B-roll is the footage that plays over your talking shot to show what you are describing: the city you mention, the gym, the laptop, the money. It keeps a viewer watching through the parts where the speaker alone would not." },
      { q: "Where does the B-roll come from?", a: "From Pexels, a library of stock footage that is free to use. Zera searches it for each moment it picks, so the clips follow what you say." },
      { q: "Can I replace a clip I don't like?", a: "Yes. Every piece of the edit is a separate item on the timeline, so you can swap a B-roll clip for your own footage, trim it, move it, or delete it." },
      { q: "Does it work for Hindi or Hinglish videos?", a: "Yes. Zera transcribes English, Hindi and Hinglish speech and plans the edit from it. Captions can be written in English, in Hindi (Devanagari) or in Hinglish (Roman letters)." },
      { q: "How long can my video be?", a: "Up to three minutes for AI B-roll. For longer recordings, cut the part you want first in the editor, then run AI B-roll on it." },
      { q: "Is there a watermark?", a: "No. Exports have no watermark, on the free plan too." },
      { q: "Is it available on iPhone?", a: "Not yet. Zera Studio is on Android, through Google Play." },
    ],
  },
  {
    slug: "hinglish-captions",
    menu: "Hinglish captions",
    title: "Hinglish Captions for Reels: Roman Hindi Subtitles | Zera",
    description:
      "Auto captions for Hindi-English speech: Hinglish in Roman letters or Hindi in Devanagari, word by word, with 28 animations. Android app.",
    kicker: "Hinglish captions",
    h1: "Hinglish captions for Reels, word by word",
    lead:
      "Most caption apps hear Hinglish and either write it in Devanagari or translate it into stiff English. Zera writes it the way you would type it to a friend: Roman letters, your own words, each one timed to the moment you say it. Want Devanagari instead? Pick Hindi. Speaking English? Pick English.",
    facts: [["Roman letters", "the way people type"], ["Word by word", "on the beat you said it"], ["28 animations", "to style them"], ["3 credits", "a minute"]],
    steps: [
      { t: "Open your video", d: "A Reel, a Short, a vlog: any video where you talk in Hindi, English or a mix of both." },
      { t: "Choose Hinglish", d: "Zera listens and writes every word in Roman letters, timed to your voice." },
      { t: "Style it and export", d: "Fix any word, pick one of 28 animations, set the font and colour, then export and post." },
    ],
    does: [
      "Writes Hindi and Hindi-English speech in Roman letters, the way it is typed on Instagram and WhatsApp",
      "Times every word to the moment you say it",
      "Keeps English words in English, as you said them",
      "Lays the captions out ready for vertical video",
    ],
    yours: [
      "Edit any word, or the spelling of a name, before you export",
      "28 caption animations: Pop, Wave, Type, Bounce, Glow and more",
      "Font, colour, glow and outline",
      "Switch to Hindi (Devanagari) or English captions for the same video",
    ],
    limits: [
      ["Hinglish (Roman)", "3 credits a minute"],
      ["Hindi, English or Auto", "1 credit a minute"],
      ["Charged", "By the second, shown before it starts"],
      ["Editing captions", "Free"],
    ],
    example: `A one-minute Reel with Hinglish captions costs 3 credits, so the ${W} free credits on a new phone cover more than half an hour of Hinglish captioning.`,
    who: [
      { t: "Indian creators", d: "Reels and Shorts in the language your audience actually speaks." },
      { t: "Educators", d: "Hindi-English explainers that viewers can follow with the sound off." },
      { t: "Brands and sellers", d: "Product videos for Indian buyers, captioned the way they read." },
    ],
    faqs: [
      { q: "What are Hinglish captions?", a: "Captions that write Hindi or mixed Hindi-English speech in Roman letters, like \"ye trick try karo\", instead of Devanagari (\"ये ट्रिक ट्राई करो\") or a translation. It is how most people type Hindi on their phones, so it is how most viewers read fastest." },
      { q: "Why not just use Hindi captions?", a: "You can: choose Hindi and Zera writes in Devanagari. Many viewers, especially on Instagram, read Roman Hinglish faster, and English words in your speech stay readable in it." },
      { q: "Can I fix a word the AI got wrong?", a: "Yes. Every caption is editable before you export: correct a word, change a spelling, or delete a line." },
      { q: "How much does it cost?", a: `Hinglish captions cost 3 credits a minute; Hindi, English and Auto cost 1 credit a minute. Every new phone gets ${W} free credits once, and the price is shown before the captions start.` },
      { q: "Does it work for YouTube Shorts and Instagram Reels?", a: "Yes. The captions are part of the exported video, so you can post it anywhere." },
      { q: "Is it available on iPhone?", a: "Not yet. Zera Studio is on Android, through Google Play." },
    ],
  },
  {
    slug: "auto-captions",
    menu: "Auto captions",
    title: "Auto Captions App: Word-by-Word Animated Captions | Zera",
    description:
      "Auto captions in English, Hindi and Hinglish, word by word, with 28 animations. Edit font, colour, glow and outline. Android app, 1 credit a minute.",
    kicker: "Auto captions",
    h1: "Auto captions, word by word, in 28 animations",
    lead:
      "Most people watch with the sound off, so a video without captions loses them in the first second. Zera listens to your video and writes captions that appear word by word, on the beat you said them, in the style you pick: 28 animations, any font and colour, with glow and outline.",
    facts: [["28 animations", "from Pop to Scramble"], ["English, Hindi", "and Hinglish"], ["1 credit", "a minute"], ["Every word", "editable"]],
    steps: [
      { t: "Open your video", d: "Any video where someone talks, from your gallery." },
      { t: "Pick the language", d: "Auto, English, Hindi (Devanagari) or Hinglish (Roman letters). Zera writes and times every word." },
      { t: "Pick a style and export", d: "Choose an animation, set the font, colour, glow and outline, fix any word, and export." },
    ],
    does: [
      "Transcribes speech and times each word to the audio",
      "Shows the words as they are spoken, a few at a time, so they are easy to follow",
      "Handles English, Hindi and Hinglish",
      "Animates them in the style you choose",
    ],
    yours: [
      "28 animations, including Pop, Wave, Type, Reveal, Letter Drop, Glow, Slide, Scramble, Bounce and Jitter",
      "Font, colour, glow and outline",
      "Edit, fix or delete any word",
      "Combine with AI B-roll, music, text and everything else in the editor",
    ],
    limits: [
      ["Auto, English or Hindi", "1 credit a minute"],
      ["Hinglish (Roman)", "3 credits a minute"],
      ["Charged", "By the second, shown before it starts"],
      ["Restyling and editing", "Free"],
    ],
    example: `A 45-second Reel with English captions costs 1 credit. The ${W} free credits on a new phone caption more than an hour and a half of video.`,
    who: [
      { t: "Reels and Shorts creators", d: "Captions that keep viewers watching with the sound off." },
      { t: "Podcast and interview clips", d: "Readable, timed text for every speaker line." },
      { t: "Teachers and explainers", d: "Accessible videos that are easier to follow." },
    ],
    faqs: [
      { q: "Which languages does it support?", a: "English, Hindi (written in Devanagari) and Hinglish (Hindi and English written in Roman letters). Auto lets Zera pick from the speech." },
      { q: "What do the 28 animations look like?", a: "They range from simple to loud: Pop, Wave, Type, Reveal, Letter Drop, Glow, Slide, Scramble, Bounce, Jitter and more. You can see ten of them running on the home page." },
      { q: "Can I edit the captions?", a: "Yes. Every word can be corrected, and the style can be changed as often as you like without paying again." },
      { q: "How much do auto captions cost?", a: `1 credit a minute for Auto, English and Hindi, 3 credits a minute for Hinglish, charged by the second. New phones get ${W} free credits once.` },
      { q: "Are the captions burned into the video?", a: "Yes. They are part of the exported video, so they show up on every platform you post to." },
      { q: "Is there a watermark?", a: "No. Exports have no watermark." },
    ],
  },
  {
    slug: "copy-reel-editing-style",
    menu: "Reference edit",
    title: "Copy a Reel's Editing Style Onto Your Clips | Zera",
    description:
      "Give Zera a reel you like and your own clips. It copies the cuts, pacing, transitions and effects onto your footage, on the beat. 5 credits an edit.",
    kicker: "Reference to edit",
    h1: "Copy any reel's edit onto your own clips",
    lead:
      "Found a reel whose editing you love? Give Zera that reel and your own clips. It reads where the reference cuts, how long each shot holds, which transitions and effects it uses and where the beat lands, then builds the same edit from your footage, cut to the reference's music. The result opens in the editor, so you can change anything.",
    facts: [["Cuts, pacing", "transitions and effects"], ["On the beat", "of the reference's music"], ["1–15 clips", "or photos"], ["5 credits", "an edit"]],
    steps: [
      { t: "Pick the reference", d: "Any reel or short video whose editing you want, up to 6 minutes long." },
      { t: "Add your clips", d: "1 to 15 of your own videos or photos, up to 30 minutes together. Add a note if you like: keep it fast and punchy, start with my best clip, slow and cinematic." },
      { t: "Get the edit", d: "Zera matches each shot of the reference with a moment from your clips and cuts them on the beat. Fine-tune it in the editor and export." },
    ],
    does: [
      "Finds every cut in the reference and how long each shot holds",
      "Uses the reference's music as the soundtrack and lands your cuts on its beat",
      "Copies the transitions and effects the reference uses",
      "Picks the moment from your clips that plays the same role as each reference shot",
    ],
    yours: [
      "Every clip and transition is on the timeline: reorder, trim or swap any of it",
      "Replace or remove the music",
      "Add captions, text, filters and overlays",
      "Export from 480p to 4K, at 30 or 60 fps",
    ],
    limits: [
      ["Reference", "Up to 6 minutes"],
      ["Your clips", "1–15 videos or photos, up to 30 minutes together"],
      ["Cost", "5 credits an edit"],
      ["Daily limit", "3 reference edits a day"],
      ["If it fails", "The credits come back"],
    ],
    example: `Each reference edit costs 5 credits, so the ${W} free credits on a new phone are enough for 20 edits.`,
    who: [
      { t: "Travel and event creators", d: "Turn a day of clips into the edit you saw on someone else's reel." },
      { t: "Car, sport and dance edits", d: "Beat-cut montages without placing a single cut by hand." },
      { t: "Brands following trends", d: "Ride a trending edit style with your own product footage." },
    ],
    faqs: [
      { q: "What exactly does it copy?", a: "The editing: where the cuts are, how long each shot lasts, the transitions and effects, and the timing against the music. It does not copy the reference's footage; every shot in your edit comes from your own clips." },
      { q: "Does the edit use the reference's music?", a: "Yes, the reference's audio becomes the soundtrack and your cuts land on its beat. You can replace it with other music in the editor. Make sure you have the right to use a track where you post." },
      { q: "How many clips can I use?", a: "From 1 to 15 videos or photos, up to 30 minutes of footage together. More clips give Zera more moments to choose from." },
      { q: "How long can the reference be?", a: "Up to 6 minutes. Most references are Reels or Shorts under a minute." },
      { q: "How much does it cost?", a: `5 credits an edit, shown before it starts, and given back if the edit fails. New phones get ${W} free credits once.` },
      { q: "Is this the same as a template?", a: "No. A template fixes the slots and you fill them. Here any video can be the reference, and Zera chooses which part of your footage goes where." },
    ],
  },
  {
    slug: "video-editor",
    menu: "Video editor",
    title: "Free Multi-Track Video Editor for Android | Zera",
    description:
      "Keyframes, masking, filters, 0.25–4x speed, PiP overlays, transitions, animated text and music. The full editor and 4K export are free, no watermark.",
    kicker: "The editor",
    h1: "A free multi-track video editor for Android",
    lead:
      "Every AI edit in Zera opens on a real multi-track timeline, and the same editor is there when you want to edit by hand. Keyframes, masks, filters, speed, overlays, transitions, animated text and music, built for the phone you film on. Editing and export never cost credits, and exports carry no watermark.",
    facts: [["Free", "editing and export"], ["4K", "at 30 or 60 fps"], ["No watermark", "ever"], ["Multi-track", "timeline"]],
    steps: [
      { t: "Bring your footage", d: "Videos and photos from your gallery, or an AI edit to finish." },
      { t: "Edit on the timeline", d: "Separate tracks for video, text, effects, overlays and music, with a playhead you scrub by hand." },
      { t: "Export", d: "480p to 4K, at 30 or 60 fps, with no watermark." },
    ],
    does: [
      "Keyframes: animate position, scale and more over time",
      "Masking, filters and colour adjustments",
      "Speed from 0.25× to 4×",
      "Overlays and picture-in-picture",
    ],
    yours: [
      "Transitions between clips",
      "Text with 28 animations",
      "Music with a visible waveform to cut on",
      "Crop and frame for any platform",
    ],
    limits: [
      ["Editing", "Free"],
      ["Export", "Free; 480p, 720p, 1080p, 2K or 4K; 30 or 60 fps"],
      ["Watermark", "None"],
      ["Ads", "On the free plan; none on paid plans"],
    ],
    example: "Edit and export as much as you like without spending a credit. Credits are only for the AI features: B-roll, reference edits and captions.",
    who: [
      { t: "Creators who edit on the go", d: "A full timeline on your phone, no laptop needed." },
      { t: "AI-edit finishers", d: "Take an AI B-roll or reference edit and make it yours." },
      { t: "Beginners", d: "Start simple, grow into keyframes and masks." },
    ],
    faqs: [
      { q: "Is the editor really free?", a: "Yes. Editing and export are free forever, with ads. Paid plans add AI credits and remove the ads." },
      { q: "Is there a watermark?", a: "No. Exports never carry a watermark." },
      { q: "Can I export in 4K?", a: "Yes: 480p, 720p, 1080p, 2K and 4K, at 30 or 60 fps." },
      { q: "Does it have keyframes and masking?", a: "Yes, along with filters and adjustments, speed from 0.25× to 4×, overlays and picture-in-picture, transitions, animated text and music with a waveform." },
      { q: "Is it available on iPhone?", a: "Not yet. Zera Studio is on Android, through Google Play." },
    ],
  },
];

export const featureBySlug = (slug: string) => features.find((f) => f.slug === slug)!;
