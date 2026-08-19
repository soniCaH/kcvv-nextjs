"use client";

import { useEffect } from "react";

/** CSS px per millimetre — print CSS resolves `px` at a fixed 96 dpi. */
const PX_PER_MM = 96 / 25.4;

/**
 * The poster block between the InDesign sponsor blocks
 * (`docs/design/mockups/phase-10-scheurkalender/sk2-poster-layout-locked.md`).
 * The print stylesheet reserves exactly this box inside the A2 page.
 */
const BLOCK_WIDTH_PX = 340 * PX_PER_MM;
const BLOCK_HEIGHT_PX = 567 * PX_PER_MM;

/**
 * Width the sheet is laid out at in print — the width it has at the 860 px
 * viewport the layout was locked against, minus `<PageContainer>`'s `md:px-8`.
 * Kept in step with `POSTER_PRINT_CSS`.
 */
const SHEET_WIDTH_PX = 796;

/**
 * Scales the poster sheet to fit the printed block (#2702).
 *
 * A fixed scale factor cannot do this. The sheet's width is known, but its
 * *height* is the season: 56 fixtures across nine months in 26/27, and a
 * different number every year. Scaling on width alone overflowed the block by
 * ~44 mm on the first real export and `overflow: hidden` silently ate the back
 * half of December — the failure mode a poster cannot have.
 *
 * So the factor is measured, the same way `<VolledigOrganigram>` measures its
 * chart before printing. Two differences, both because this sheet is artwork
 * rather than a paper copy: the fit is against the poster block instead of the
 * paper, and it runs on `beforeprint` rather than a button click, so `Cmd+P`
 * gets it too — the club exports through the browser's PDF writer, not through
 * the button.
 *
 * Measuring cannot wait for the print layout (`beforeprint` fires before it),
 * and the on-screen sheet is a different width at every viewport, so the height
 * is read with the print width forced on. One synchronous reflow, once, at
 * print time.
 */
export function PosterPrintScale() {
  useEffect(() => {
    const applyScale = () => {
      const sheet = document.querySelector<HTMLElement>(".sk-poster-sheet");
      if (!sheet) return;

      // The dateline is `hidden print:block`, so on screen it contributes no
      // height. Left out of the measurement it is left out of the fit, and the
      // sheet prints that much too tall — the last fixtures fall off the
      // bottom. Force it in for the reading, exactly like the width.
      const footer = sheet.querySelector<HTMLElement>(".sk-poster-footer");
      const previousWidth = sheet.style.width;
      const previousFooterDisplay = footer?.style.display ?? "";
      sheet.style.width = `${SHEET_WIDTH_PX}px`;
      if (footer) footer.style.display = "block";
      const sheetHeight = sheet.scrollHeight;
      sheet.style.width = previousWidth;
      if (footer) footer.style.display = previousFooterDisplay;

      // Never scale up past the block: a short season should print at the
      // locked type size, not stretch to fill the sheet.
      const scale = Math.min(
        BLOCK_WIDTH_PX / SHEET_WIDTH_PX,
        BLOCK_HEIGHT_PX / sheetHeight,
      );
      document.documentElement.style.setProperty(
        "--sk-poster-scale",
        String(scale),
      );
    };

    window.addEventListener("beforeprint", applyScale);
    return () => window.removeEventListener("beforeprint", applyScale);
  }, []);

  return null;
}
