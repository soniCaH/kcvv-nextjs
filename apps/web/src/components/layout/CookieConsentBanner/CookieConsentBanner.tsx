"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
// Import the library CSS statically — do NOT switch to a dynamic `import()` inside the effect.
// CookieConsent.run() injects the modal and focuses its accept button synchronously; if the CSS
// has not yet resolved, the modal has no `position: fixed` and lives inline at the bottom of the
// <body>, which causes the browser to scroll-into-view to the footer on first load (issue #1313).
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { bracketAffordanceHtml } from "@/components/design-system/BracketAffordance";
import { updateConsentState } from "@/lib/analytics/gtm-consent";

// Tracks whether CookieConsent.run() has resolved; used by CookiePreferencesButton
// to guard showPreferences() calls before initialization completes.
export let cookieConsentReady = false;

function syncConsentState() {
  const analyticsAccepted = CookieConsent.acceptedCategory("analytics");
  updateConsentState(analyticsAccepted);
}

export function CookieConsentBanner() {
  useEffect(() => {
    let isMounted = true;

    CookieConsent.run({
      // Retro reskin (#2125): corner-box banner, bottom-left. Skin only — the
      // category/consent behaviour is unchanged.
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom left",
        },
        preferencesModal: {
          layout: "box",
        },
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          readOnly: false,
        },
      },

      onConsent: syncConsentState,
      onChange: syncConsentState,

      language: {
        default: "nl",
        translations: {
          nl: {
            consentModal: {
              title: "Koekjes?",
              description:
                'Wij gebruiken cookies om de website correct te laten werken en om anonieme bezoekersstatistieken bij te houden. Lees onze <a href="/privacy">privacyverklaring</a>.',
              acceptAllBtn: "Alles accepteren",
              // D4 bracket affordance (#2620). The library assigns these
              // strings with `innerHTML`, so the mono `[×]` can ride along;
              // `aria-hidden` keeps it out of the button's accessible name,
              // which stays the Dutch label alone. Only the dismissal takes
              // it: "Alleen noodzakelijk" is the action the library's own
              // close button fires. Accept-all and manage-preferences are
              // neither dismissals nor requests for help, and a bracket on
              // every control is how a punctuation mark turns into a second
              // icon language.
              acceptNecessaryBtn: `${bracketAffordanceHtml("close")} Alleen noodzakelijk`,
              showPreferencesBtn: "Beheer voorkeuren",
            },
            preferencesModal: {
              title: "Cookie-voorkeuren",
              acceptAllBtn: "Alles accepteren",
              // Same dismissal, one step deeper — same bracket, so the label
              // does not change chrome between the two modals.
              acceptNecessaryBtn: `${bracketAffordanceHtml("close")} Alleen noodzakelijk`,
              savePreferencesBtn: "Sla op",
              closeIconLabel: "Sluiten",
              sections: [
                {
                  title: "Noodzakelijke cookies",
                  description:
                    "Deze cookies zijn vereist voor de basisfunctionaliteit van de website en kunnen niet worden uitgeschakeld.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analytische cookies",
                  description:
                    "Anonieme statistieken over hoe bezoekers de website gebruiken. Helpt ons de site te verbeteren.",
                  linkedCategory: "analytics",
                },
              ],
            },
          },
        },
      },
    })
      .then(() => {
        if (isMounted) {
          cookieConsentReady = true;
        }
      })
      .catch((error: unknown) => {
        console.error("CookieConsent initialization failed:", error);
      });

    return () => {
      isMounted = false;
      cookieConsentReady = false;
      CookieConsent.reset(false);
    };
  }, []);

  return null;
}
