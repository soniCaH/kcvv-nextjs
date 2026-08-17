export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: ReadonlyArray<FooterLink>;
}

/**
 * The footer directory.
 *
 * Its columns are intent-based (Ontdek / Aansluiten / Bij de club) while the
 * nav is concept-based, and that asymmetry is deliberate — the two are a
 * legitimate second organisation of the same site, not a mirror. The rule that
 * binds them (#2409, enforced by `footerLinks.test.ts`): **every top-level nav
 * concept appears somewhere in the footer; the footer may hold more.**
 * `Galerij` and `Onze ploegen` are the "more" — the footer is the directory,
 * and being a superset is its job.
 */
export const FOOTER_COLUMNS: ReadonlyArray<FooterColumn> = [
  {
    heading: "Ontdek",
    links: [
      { label: "Nieuws", href: "/nieuws" },
      // "Wedstrijden", not "Kalender" — matches the nav label and the page's
      // own H1 ("Wedstrijdkalender").
      { label: "Wedstrijden", href: "/kalender" },
      { label: "Evenementen", href: "/evenementen" },
      { label: "Galerij", href: "/galerij" },
      { label: "Onze ploegen", href: "/ploegen" },
      { label: "Jeugdwerking", href: "/jeugd" },
      // Reading about the club's sponsors is a different intent from offering
      // to become one, so `/sponsors` is reachable from both columns.
      { label: "Onze sponsors", href: "/sponsors" },
      // `/inhoud` is reachable from here and nowhere else on purpose (#2622):
      // it is the whole site listed on one page, which is a directory entry,
      // not a nav concept. The nav is flat and stays flat (#2409 / #2415).
      { label: "Alle inhoud", href: "/inhoud" },
    ],
  },
  {
    heading: "Aansluiten",
    links: [
      { label: "Als speler", href: "/club/word-lid" },
      { label: "Als vrijwilliger", href: "/club/vrijwilliger" },
      { label: "Als sponsor", href: "/sponsors" },
    ],
  },
  {
    heading: "Bij de club",
    links: [
      // The hub itself, not just the pages under it. "Bij de club" is a bare
      // heading, so without this the footer indexes the club section without
      // ever linking to it — and the nav→footer guard could only confirm the
      // concept via some unrelated `/club/*` link in another column.
      { label: "Over de club", href: "/club" },
      { label: "Geschiedenis", href: "/club/geschiedenis" },
      { label: "Bestuur", href: "/club/bestuur" },
      { label: "Contact", href: "/club/contact" },
      { label: "Praktische info", href: "/club/praktische-informatie" },
      { label: "Hulp & wie-is-wie", href: "/hulp" },
    ],
  },
];

export const FOOTER_ADDRESS_LINE = "Driesstraat 32 · 1982 Elewijt";
