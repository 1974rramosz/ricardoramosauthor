/**
 * ─────────────────────────────────────────────
 *  SITE CONTENT — Edit everything here
 *  One file to control all copy and visual settings
 *  After editing: save, commit to GitHub, done.
 * ─────────────────────────────────────────────
 */

const SITE = {

  /* ─── COLORS ───────────────────────────────
   * Change these to update the whole site palette
   */
  colors: {
    terra:        '#8E412E',   // Main brand color — buttons, accents, terra-cotta
    terra_light:  '#B5614A',   // Hover states
    terra_pale:   '#F2E8E3',   // Light tint backgrounds
    dark:         '#1A1008',   // Dark hero backgrounds, footer
    bg:           '#FAFAF6',   // Main page background
    cream:        '#F5EFE8',   // Form boxes, quote sections
    ink:          '#1A1008',   // Main body text
    ink_mid:      '#4A3828',   // Secondary body text
    ink_soft:     '#7A6555',   // Captions, labels
    border:       '#E4D8CE',   // Lines, dividers
  },

  /* ─── FONTS ────────────────────────────────
   * display = headlines, quotes, chapter titles
   * body    = everything else
   */
  fonts: {
    display: "'Cormorant Garamond', Georgia, serif",
    body:    "'DM Sans', system-ui, sans-serif",
  },

  /* ─── INDEX PAGE ────────────────────────────── */
  index: {

    // Hero section
    hero_eyebrow:   'Ricardo Ramos — Author & Coach',
    hero_headline:  'For 13 years I was certain, loving and doing my best.',
    hero_headline_em: 'Certainty almost killed my son.',
    hero_sub:       'A memoir and manual for the parent who is certain they are right, terrified they might be wrong, and with no map for what comes next.',
    hero_cta_1:     'Read Chapter 1 Free',
    hero_cta_2:     'About Ricardo',

    // Why / Mission section
    why_label:      'The mission',
    why_headline:   'End suffering by making the unconscious',
    why_headline_em: 'conscious.',
    why_p1:         'By almost losing my child I learned the hard way that inherited beliefs can kill.',
    why_p2:         '45% of transgender youth seriously consider suicide. Not because of who they are. Because of how we respond to who they are.',
    why_p3:         'But parental acceptance changes that number by 82%. Not medication. Not therapy. You.',
    why_close:      "I paid a price for this knowledge. You don't have to.",

    // Stats
    stat_1_number:  '82%',
    stat_1_text:    'Reduction in serious self-harm attempts when a parent accepts their transgender child. Not medication. Not therapy. You.',
    stat_1_source:  'Ryan et al., 2010. Journal of Child and Adolescent Psychiatric Nursing.',
    stat_2_number:  '45%',
    stat_2_text:    'Of transgender youth seriously consider suicide. The cause is not who they are.',
    stat_2_source:  'The Trevor Project, 2023 National Survey on LGBTQ+ Youth Mental Health.',

    // Pull quote
    quote_text:     'I knew exactly what my child was. My child knew better.',
    quote_attr:     '— Ricardo Ramos',

    // Story section
    story_label:    'The story',
    story_headline: 'You might be where I was 13 years ago.',
    story_p1:       'My son stopped wanting to live, not because of who he was, but because of how I responded to who he was.',
    story_son_line: 'He is 23. He is a transgender man. He is an artist in Bilbao. He illustrated this book. He made the cover sculpture. He is the reason any of this exists.',
    story_p2:       'The journey between the father who was certain and the father who understood took thirteen years. This book is the map I did not have.',
    story_link:     'Read the full story',

    // Timeline
    tl_1_year:   '2011',
    tl_1_title:  'The phone call',
    tl_1_desc:   "Lorena calls. Ricardo's first reaction: this is a phase. He will be wrong about this for thirteen years.",
    tl_2_year:   '2015–2021',
    tl_2_title:  'The years of certainty',
    tl_2_desc:   'A loving, well-intentioned father doing everything wrong. The distance grows. The damage compounds.',
    tl_3_year:   '2022',
    tl_3_title:  'The Cantabrian coast',
    tl_3_desc:   'A road trip in November. Ricardo stops talking. Starts listening. The belief begins, slowly, to dissolve.',
    tl_4_year:   '2024',
    tl_4_title:  'The book',
    tl_4_desc:   'Valentin makes a clay sculpture for Ricardo\'s 50th birthday. Inscribed: "gracias por evolucionar conmigo."',

    // Three doors
    doors_headline: 'Where do you want to start?',
    doors_sub:      'Three ways to go further with this work, depending on where you are.',
    door_1_num:     '01',
    door_1_title:   'The Book',
    door_1_text:    'A memoir and manual. Thirteen years compressed into something you can read in a weekend and use for a lifetime. Coming 2026.',
    door_1_link:    'Read Chapter 1 Free',
    door_2_num:     '02',
    door_2_title:   'Work With Me',
    door_2_text:    'A private conversation. Not a sales call. Not therapy. A father who was where you are, talking to a parent who is there now.',
    door_2_link:    'Book a call',
    door_3_num:     '03',
    door_3_title:   'The Mission',
    door_3_text:    'Speaking, press, and the work beyond the book. If you are a journalist, event organiser, or someone who wants to spread this further.',
    door_3_link:    'Learn more',

    // Lead capture / form section
    invite_label:     'Start here',
    invite_headline:  'If any of this feels',
    invite_headline_em: 'uncomfortably familiar,',
    invite_headline_end: 'start here.',
    invite_p1:        'Chapter 1, free. No commitment. One click to leave at any time. Just the first chapter of an honest book, arriving in your inbox in the next few minutes.',
    invite_fine:      'No spam. Unsubscribe in one click.',
    form_btn:         'Send me Chapter 1',
  },

  /* ─── BOOK PAGE ─────────────────────────────── */
  book: {

    // Hero
    book_eyebrow:   'A Memoir and Manual',
    book_title:     'God Makes No Mistakes',
    book_subtitle:  'For the parent who is certain they are right, terrified they might be wrong, and with no map for what comes next.',
    book_badge:     'Book coming 2026',
    book_tagline_1: 'Every book written for parents of transgender children assumes the parent is already on board.',
    book_tagline_1_strong: 'This one does not.',
    book_tagline_2: 'It starts where most parents are: worried, skeptical, and certain. Certainty is where Ricardo nearly lost everything. Perhaps where you are too.',
    book_cta_1:     'Read Chapter 1 Free',
    book_cta_2:     'Talk to Ricardo',

    // What it is
    what_headline:    'Not the book you expected. The one you actually need.',
    what_p1:          'There is an entire genre of books for parents of transgender children. They are warm, affirming, and written for parents who already believe their child.',
    what_p2:          'This is not that book. This is written for the parent at the beginning, before any of the acceptance, when everything still feels wrong and uncertain and impossible.',
    what_p3:          'Ricardo was that parent for thirteen years. He knows what the inside of that certainty looks like. He knows how it protects itself from evidence. He knows what it costs.',
    what_italic:      '"Every other book says I understand you. Mine says I was you."',

    // Features
    feat_1_num:   '01',
    feat_1_title: 'Starts from resistance',
    feat_1_desc:  "Opens from the same place most parents find themselves. Not yet there. That is precisely why it works for the reader who isn't either.",
    feat_2_num:   '02',
    feat_2_title: 'The science, without the politics',
    feat_2_desc:  "The actual biology of gender development in plain language. Not ideology. The research that dissolved Ricardo's last objection.",
    feat_3_num:   '03',
    feat_3_title: 'A manual, not just a memoir',
    feat_3_desc:  'Each chapter closes with reflection questions and concrete steps. You are meant to do something with it, not just read it and feel moved.',
    feat_4_num:   '04',
    feat_4_title: 'Written by a father, not a therapist',
    feat_4_desc:  'No clinical language. No academic distance. A man telling the truth about what happened to him, in the order it happened.',

    // Chapter teaser
    teaser_label:    'From the book',
    teaser_chapter:  'Chapter 1 — Is this a phase?',
    teaser_p1:       'I was absolutely certain it was a phase.',
    teaser_p2:       'Not defensively certain. Not the kind of certainty that covers for doubt underneath. I mean the relaxed, unexamined certainty of a man who has already seen this movie. Kids go through things. I went through things. I had a ponytail down to my shoulders at seventeen, shredded jeans modeled on Axl Rose, a communist phase at university that lasted nearly two years.',
    teaser_p3:       'I thought I was doing the same thing for Valentin. Giving him space. Being modern about it. Not panicking.',
    teaser_bold:     'What I was actually doing was deciding in advance that this would pass, then watching through that lens, finding everything I looked at confirmed what I already believed.',
    teaser_accent:   'That is not observation. That is the illusion of observation.',

    // Form section
    form_label:      'Chapter 1, free',
    form_headline:   'If any of this feels',
    form_headline_em: 'uncomfortably familiar,',
    form_headline_end: 'start here.',
    form_p1:         'No commitment. One click to leave at any time. Just the first chapter of an honest book, arriving in your inbox in the next few minutes.',
    form_fine:       'No spam. Unsubscribe in one click.',
    form_btn:        'Send me Chapter 1',
  },

  /* ─── FOOTER (shared across all pages) ─────── */
  footer: {
    brand:     'Ricardo Ramos',
    copyright: '© 2026 Ricardo Ramos. Madrid, Spain.',
  },

};
