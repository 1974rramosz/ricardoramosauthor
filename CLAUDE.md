# CLAUDE.md — Project Context for Ricardo Ramos Author Site

This file gives Claude Code full context for working on this project. Read it completely before making any changes.

---

## Project overview

Two live websites for Ricardo Ramos, Venezuelan author and coach based in Madrid. He is writing a book called *God Makes No Mistakes* — a memoir and manual for conservative, faith-shaped parents of transgender children, written from the perspective of a father who was once deeply resistant. His son Valentin (mid-20s, artist in Bilbao) is the book's central figure.

**Core mission of the book:** Suffering in transgender youth is caused by parental non-acceptance, not by gender identity. Accepting parents reduced suicide attempts in their transgender children by 82% (Ryan et al. 2010). This framing is non-negotiable in all copy.

---

## Sites

### 1. ricardoramosauthor.com (primary author hub)
- **Repo:** `github.com/1974rramosz/ricardoramosauthor` (public)
- **Hosting:** Cloudflare Pages
- **Live at:** `ricardoramosauthor.com` and `ricardoramosauthor.pages.dev`
- **No build command, no framework** — pure static HTML

### 2. godmakesnomistakes-book.com (book landing site)
- **Repo:** `github.com/1974rramosz/gmnm_book_web` (private)
- **Hosting:** Cloudflare Pages
- **Project name:** `gmnm-book-web`
- **Live at:** `godmakesnomistakes-book.com` and `gmnm-book-web.pages.dev`

---

## Tech stack

- **Hosting:** Cloudflare Pages (both sites). Never reference Netlify.
- **Functions:** Cloudflare Pages Functions in `/functions/` folder using `onRequestPost(context)` pattern
- **Email marketing:** Brevo (list ID 3, sending domain `ricardo@ricardoramosauthor.com`)
- **DNS registrar:** IONOS
- **Booking:** Calendly at `calendly.com/ricardo_ramos_coach/30min`
- **Chapter 1 PDF:** Hosted at `https://ricardoramosauthor.com/GMND_Chapter1_IsThisAPhase.pdf`
- **Chapter 1 viewer:** `https://ricardoramosauthor.com/chapter-1.html` (iframe wrapper using Google Drive preview embed)

---

## File structure — ricardoramosauthor repo

```
/
├── index.html              # Homepage with lead capture form
├── book.html               # Book page
├── work-with-me.html       # Coaching / Calendly page
├── speaking.html           # Speaking page (dark hero)
├── press.html              # Press page
├── about.html              # About page
├── unsubscribe.html        # Unsubscribe page
├── privacy.html            # Privacy policy
├── chapter-1.html          # Chapter 1 PDF viewer (iframe)
├── GMND_Chapter1_IsThisAPhase.pdf  # Chapter 1 PDF (89.9KB)
├── robots.txt
├── sitemap.xml
├── llms.txt
├── _headers                # Cloudflare Pages headers file
├── css/
│   └── styles.css          # Global design system
├── js/                     # JS files
└── functions/
    ├── subscribe.js        # Lead capture + Brevo + email delivery
    ├── unsubscribe.js      # Unsubscribe flow
    └── contact.js          # Speaking enquiry form
```

---

## Design system (styles.css tokens)

```css
--bg:          #FAFAF6
--dark:        #1A1008
--terra:       #8E412E
--terra-light: #B5614A
--terra-pale:  #F2E8E3
--cream:       #F5EFE8
--ink:         #1A1008
--ink-mid:     #4A3828
--ink-soft:    #7A6555
--border:      #E4D8CE
--font-display: 'Cormorant Garamond', Georgia, serif
--font-body:    'DM Sans', system-ui, sans-serif
--radius: 2px
```

Fonts loaded from Google Fonts: Cormorant Garamond + DM Sans.

Nav uses `hero-dark` class on `index.html` and `speaking.html` for white links before scroll.

---

## Lead capture form (index.html)

The homepage form collects: name, email, country (searchable dropdown — full world country list, type-to-filter), relationship (select). On submit it:

1. Posts JSON to `/subscribe` (Cloudflare Pages Function)
2. Function creates/updates contact in Brevo list 3 with attributes: FIRSTNAME, COUNTRY, RELATIONSHIP
3. Function sends transactional email via Brevo with link to Chapter 1
4. Shows success state inline (no page reload)

**Chapter 1 delivery URL in subscribe.js:**
```js
const chapterUrl = 'https://ricardoramosauthor.com/chapter-1.html';
```

**chapter-1.html** is a full-screen iframe wrapper:
```html
<iframe src="https://drive.google.com/file/d/1q3t4Agrkcgt95qplBNNinN-LHxq9_3j3/preview"></iframe>
```
Note: the file ID contains a lowercase `l` not an uppercase `I` — `qplBNN` not `qpIBNN`. This distinction caused a bug previously.

**Brevo environment variable:** `BREVO_API_KEY` must be set in Cloudflare Pages dashboard environment variables. It is NOT in the repo.

**Brevo behaviours to remember:**
- Contacts endpoint returns 204 (not 200) on update — success check must include `res.status === 204`
- Contact attributes are case-sensitive and must be created manually in Brevo before the API stores them
- Unsubscribe uses DELETE `/v3/contacts/{email}`

---

## Cloudflare Pages deployment rules

1. No build command, no framework preset — pure static
2. Never use `_redirects` with 200 rewrites when a `functions/` folder exists — causes redirect loops
3. Cloudflare Pages strips `.html` extensions natively
4. `_headers` file controls HTTP response headers per path
5. Never deploy via Workers flow (has a mandatory Deploy command field — wrong tool)

---

## Mobile fixes applied (May 2026)

The following mobile CSS is in `index.html` `<style>` block:

```css
html, body { overflow-x: hidden; }

@media (max-width: 900px) {
  .why-grid, .story-grid, .invite-grid { grid-template-columns: 1fr; gap: 3.5rem; }
  .doors-grid { grid-template-columns: 1fr; gap: 0; }
  .door { border-bottom: 1px solid rgba(255,255,255,0.08); }
  .hero-headline { font-size: clamp(1.8rem, 8vw, 2.6rem); }
  .hero-inner { max-width: 100%; }
  .invite-section { scroll-margin-top: 24px; padding-top: 24px; }
  .invite-grid { gap: 0.5rem; }
  .invite-form-wrap { padding: 1.25rem; box-sizing: border-box; width: 100%; }
  .invite-form-wrap input,
  .invite-form-wrap select { box-sizing: border-box; width: 100%; max-width: 100%; }
  .consent-row { width: 100%; box-sizing: border-box; }
}
```

The consent row uses a CSS class `.consent-row` (not inline styles) defined as:
```css
.consent-row { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 20px; }
.consent-row input[type="checkbox"] { margin-top: 3px; flex-shrink: 0; accent-color: #8E412E; }
.consent-row p { margin: 0; font-size: 13px; color: #666; line-height: 1.6; }
```

**Known open issue (as of May 2026):** The consent text block still overflows its container on mobile. Root cause is likely `width: 100%` missing from `.form-group input` in `styles.css`. The fix is to add `width: 100%` to the input/select rule in `styles.css`.

**press.html and work-with-me.html** also have `html, body { overflow-x: hidden; }` applied and mobile stacking fixes.

**work-with-me.html Calendly mobile fix:**
```css
@media (max-width: 900px) {
  .calendly-section { padding: 60px 0; }
  .calendly-wrap {
    border-radius: 0;
    border-left: none;
    border-right: none;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .calendly-wrap .calendly-inline-widget {
    min-width: 100%;
    width: 100%;
  }
}
```

---

## Writing and copy rules (for any content work)

- No em dashes anywhere. Use commas, colons, or full stops instead.
- No concept capitalisation — only proper nouns and sentence starts.
- No AI-pattern phrasing.
- Short paragraphs, story-first, blunt and personal voice.
- James Clear–influenced structure with TLDR summaries per chapter.
- References always include citation numbers; all citations collected in Annex.
- Book style reference: Atomic Habits (Clear) — short paragraphs, direct, evidence-backed.

---

## Commercial funnel

```
Book (€7)
  → Journal / workbook (€27 order bump)
    → Masterclass (€147)
      → Group coaching (€3,500/cohort)
        → Premium 1:1 coaching (€10,000)
```

The book is the low-cost entry point. Chapter 1 PDF is the lead magnet.

---

## Key people

- **Ricardo Ramos** — author, coach, site owner
- **Valentin** — Ricardo's son, transgender man, artist in Bilbao, book illustrator and cover sculptor
- **Lorena** — Valentin's mother, co-parenting partner, Chapter 9 subject
- **Vivianne** — Ricardo's wife (confirmed spelling)

---

## Distribution

- KDP (Amazon channels only, own ISBN — never KDP-issued)
- IngramSpark at 55% wholesale, Amazon manually excluded
- Draft2Digital for all non-Amazon digital retail
- No KDP Select
- English edition first; Spanish edition 3–4 months later

---

## Future migrations

After first commercial cycle:
- `ricardoramosauthor.com` becomes primary brand hub
- `godmakesnomistakes-book.com` redirects to `/book`
- `trans-formationbook.com` redirects to `/community`

---

## Session log (last updated May 2026)

- Chapter 1 revised draft complete with all editorial corrections applied
- Chapter 1 PDF generated and hosted at `ricardoramosauthor.com/GMND_Chapter1_IsThisAPhase.pdf`
- Full lead capture flow working end to end: form → Brevo → email → Chapter 1
- Country field upgraded to searchable dropdown (full world list, type-to-filter)
- Mobile overflow issues resolved on index, press, and work-with-me pages
- Consent row overflow on mobile still pending final fix in styles.css
