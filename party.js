/* =====================================================================
   THE LAST TOAST — PUBLIC PARTY INFO
   Everything here is public: the invitation, the rules, and the text on
   the projector screen. Edit it right on GitHub (pencil icon) and commit.
   Nothing secret goes in this file. Secrets live in private/story.js.
   Text goes between backticks ` `. Every entry ends with a comma.
   ===================================================================== */
window.PARTY = {

  /* ---------- the invitation (index.html) ---------- */
  title: `The Last Toast`,
  subtitle: `A Murder Mystery Evening`,
  host: `RA Jacob & Alex`,
  date: `Saturday, [Month Day, Year]`,
  time: `[7:00 PM] until late`,
  venue: `[Venue name]`,
  address: `[Street address, City]`,
  dress: `Black tie optional. Dress for a corporate gala.`,
  rsvpBy: `[RSVP-by date]`,
  rsvpOpen: true,            // false closes the RSVP form
  showDatabaseLink: true,    // false hides the "Database" buttons on the invitation
  notice: ``,                // optional gold announcement banner at the top of the invitation
  // Tip: you can also change the date, venue, banner and these switches live from the
  // host dashboard (System tab → Live Page Editor), with no GitHub upload needed.

  // The in-world invitation, as if it came from Kane Oil itself
  inWorld: `Kane Oil & Energy requests the pleasure of your company at its Annual Gala, hosted by Chief Executive Officer Alexandra Kane.`,

  // The story teaser. Each paragraph is its own entry.
  premise: [
    `For fifty years Kane Oil has run on money, favors, and silence. Tonight its young CEO, Alexandra Kane, has gathered the company's closest friends, rivals, lawyers, and loyal staff for a toast, and she promises an announcement that will "change everything."`,
    `Not everyone in the room wants to hear it.`,
    `Before the night is over, someone at this party will be dead, and every guest will be a suspect. You included.`
  ],

  // "What to expect" bullet points
  expect: [
    `You'll be assigned a character with a full secret dossier about a week before the party.`,
    `Read it, dress the part, and arrive in character.`,
    `Mingle, interrogate, bargain, and bluff. Everyone has something to hide.`,
    `Evidence arrives live on your phone throughout the night.`,
    `At the end, you'll make an official accusation. Will the killer walk free?`
  ],

  // How the Kane Oil Database works (shown on the invite)
  howItWorks: [
    { title: `Your code word`, text: `Once roles are assigned, you'll receive a private code word. It unlocks your character's dossier in the Kane Oil Database. Tell no one.` },
    { title: `Before the party`, text: `Log in, read your dossier closely, and plan your costume and your secrets.` },
    { title: `On the night`, text: `Bring a charged phone. Evidence, alerts, and the final vote all arrive through the database in real time.` }
  ],

  // Rules of the night. Set showRules to false to hide them until you're ready.
  showRules: true,
  rules: [
    { title: `Stay in character`, text: `From the moment you arrive until the final reveal, you're your character. Accents, grudges, and dramatic exits are encouraged.` },
    { title: `Guard your code word`, text: `Never share your code word or show your dossier screen to anyone. What's on it is yours to reveal, trade, or hide.` },
    { title: `Only the killer may lie about the murder`, text: `Everyone else can dodge, deflect, and keep their personal secrets, but can't tell an outright lie about the crime itself.` },
    { title: `Watch your phone`, text: `When new evidence is released, it appears in your Evidence Locker. Read it, share it, or use it as leverage.` },
    { title: `Lockdown means eyes up`, text: `If your screen goes red with LOCKDOWN, put your phone down and look to the front of the room. Something is about to happen.` },
    { title: `If you die`, text: `Your screen will tell you. Play it out dramatically, then stay in character as the body. The dead can listen, but they can't share clues.` },
    { title: `The accusation`, text: `Near the end of the night, voting opens on your phone. Name one suspect and make your case for the record. You can change your vote until voting closes.` },
    { title: `No hacking the database`, text: `Peeking at someone else's screen or tampering with the Kane Oil Database is a firing offense.` }
  ],

  /* ---------- the projector screen (display.html) ---------- */
  display: {
    company: `KANE OIL & ENERGY`,
    welcome: `Welcome to the Annual Gala`,
    welcomeSub: `Honoring fifty years of Kane Oil · Hosted by CEO Alexandra Kane`,
    memoriamFor: `alex`,                       // when this character dies, the welcome screen becomes a memorial
    memoriamText: `In Memoriam · Alexandra Kane`,
    memoriamSub: `Chief Executive Officer · Kane Oil & Energy`,
    slides: [
      `Record output across Gulf operations this quarter`,
      `412 days without a safety incident`,
      `Tonight: a special announcement from our CEO`,
      `Powering tomorrow since 1974`,
      `Please enjoy the champagne. The toast begins at 9:30`
    ],
    tickers: [
      ['KOE', 142.18], ['VLZ', 88.40], ['BRENT', 81.22], ['WTI', 77.90], ['NATGAS', 2.84], ['DJIA', 39112], ['S&P', 5231]
    ]
  }
};
