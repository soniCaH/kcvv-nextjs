import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MembershipForm } from "./MembershipForm";

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText(/Voornaam/), {
    target: { value: "Jan" },
  });
  fireEvent.change(screen.getByLabelText(/Achternaam/), {
    target: { value: "Peeters" },
  });
  fireEvent.change(screen.getByLabelText(/Geboortedatum/), {
    target: { value: "1990-06-15" },
  });
  fireEvent.change(screen.getByLabelText(/Geslacht/), {
    target: { value: "m" },
  });
  fireEvent.change(screen.getByLabelText(/Gemeente/), {
    target: { value: "Elewijt" },
  });
  fireEvent.change(screen.getByLabelText(/^E-mail/), {
    target: { value: "jan@example.com" },
  });
  fireEvent.click(screen.getByLabelText(/privacyverklaring/i));
}

describe("MembershipForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the base fields", () => {
    render(<MembershipForm />);
    expect(screen.getByLabelText(/Voornaam/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Achternaam/)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/)).toBeInTheDocument();
  });

  // #2547 rule 5 — an internal link never opens a new tab, so the external
  // mark can go on meaning exactly one thing.
  it("never opens the internal /privacy link in a new tab", () => {
    render(<MembershipForm />);
    const privacyLink = screen.getByRole("link", {
      name: /privacyverklaring/i,
    });
    expect(privacyLink).toHaveAttribute("href", "/privacy");
    expect(privacyLink).not.toHaveAttribute("target");
    expect(privacyLink).not.toHaveAttribute("rel");
  });

  it("reveals the medical-certificate checkbox only for player roles", () => {
    render(<MembershipForm />);
    expect(screen.queryByText(/medisch attest/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/interesse als/i), {
      target: { value: "speler" },
    });
    expect(screen.getByText(/medisch attest/i)).toBeInTheDocument();
  });

  it("reveals the parent-consent block for a minor birth date", () => {
    render(<MembershipForm />);
    expect(screen.queryByText(/Minderjarig/i)).not.toBeInTheDocument();

    // Born ~10 years ago — always a minor regardless of when the test runs.
    const minorYear = new Date().getFullYear() - 10;
    fireEvent.change(screen.getByLabelText(/Geboortedatum/), {
      target: { value: `${minorYear}-05-01` },
    });
    expect(screen.getByLabelText(/E-mail ouder\/voogd/i)).toBeInTheDocument();
    expect(screen.getByText(/geef toestemming/i)).toBeInTheDocument();
  });

  it("posts to /api/membership and shows a success message", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ ok: true }),
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<MembershipForm defaultRole="vrijwilliger" />);
    fillRequiredFields();
    fireEvent.submit(screen.getByText(/Verstuur aanvraag/).closest("form")!);

    await waitFor(() =>
      expect(
        screen.getByText(/Bedankt voor je interesse/i),
      ).toBeInTheDocument(),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/membership",
      expect.objectContaining({ method: "POST" }),
    );
  });

  describe("transport failure (#2580)", () => {
    it("shows the locked notice and logs the caught error to the console only", async () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const networkError = new Error("Failed to fetch");
      vi.stubGlobal(
        "fetch",
        vi.fn(() => Promise.reject(networkError)),
      );

      render(<MembershipForm defaultRole="vrijwilliger" />);
      fillRequiredFields();
      fireEvent.submit(screen.getByText(/Verstuur aanvraag/).closest("form")!);

      const notice = await screen.findByRole("alert");
      expect(notice).toHaveTextContent(
        "Verzenden mislukt. Controleer je internetverbinding en probeer opnieuw.",
      );
      // The visitor never sees the caught error's own text.
      expect(screen.queryByText(/Failed to fetch/)).not.toBeInTheDocument();
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining("submit"),
        networkError,
      );
    });
  });

  describe("server rejection", () => {
    it("shows the server's own error, which is authored Dutch copy, not a raw caught error", async () => {
      // e.g. apps/api/src/handlers/forms.ts's stale-Turnstile message — this
      // instruction ("refresh the page") is the one that actually resolves
      // the failure, so it must survive.
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: false,
            status: 400,
            json: () =>
              Promise.resolve({
                error:
                  "Verificatie mislukt. Vernieuw de pagina en probeer opnieuw.",
              }),
          }),
        ),
      );

      render(<MembershipForm defaultRole="vrijwilliger" />);
      fillRequiredFields();
      fireEvent.submit(screen.getByText(/Verstuur aanvraag/).closest("form")!);

      expect(
        await screen.findByText(
          "Verificatie mislukt. Vernieuw de pagina en probeer opnieuw.",
        ),
      ).toBeInTheDocument();
    });

    it("falls back to the locked generic message when the response carries no error field", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({}),
          }),
        ),
      );

      render(<MembershipForm defaultRole="vrijwilliger" />);
      fillRequiredFields();
      fireEvent.submit(screen.getByText(/Verstuur aanvraag/).closest("form")!);

      expect(
        await screen.findByText(
          "Er ging iets mis. Controleer je gegevens en probeer opnieuw.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("stale notice cleared on resubmit", () => {
    it("clears a prior transport-failure notice when a client-validation error blocks resubmit", async () => {
      const fetchMock = vi.fn(() => Promise.reject(new Error("offline")));
      vi.stubGlobal("fetch", fetchMock);
      vi.spyOn(console, "error").mockImplementation(() => {});

      render(<MembershipForm defaultRole="vrijwilliger" />);
      fillRequiredFields();
      fireEvent.submit(screen.getByText(/Verstuur aanvraag/).closest("form")!);
      // The accented "mislukt" splits this sentence across DOM nodes, so
      // assert via the notice's own role rather than a text regex spanning it.
      const transportNotice = await screen.findByRole("alert");
      expect(transportNotice).toHaveTextContent(/Verzenden mislukt/);

      // Clear a required field so the next submit is blocked client-side.
      fireEvent.change(screen.getByLabelText(/Voornaam/), {
        target: { value: "" },
      });
      fireEvent.submit(screen.getByText(/Verstuur aanvraag/).closest("form")!);

      await screen.findByText("Controleer de gemarkeerde velden.");
      // Blocking the resubmit also re-populates the field-level `<AlertBadge
      // variant="error">` under the now-empty "Voornaam" field, which is its
      // own `role="alert"` region — so assert on content, not count: no
      // surviving alert may still carry the stale transport notice's text.
      const staleNotice = screen
        .getAllByRole("alert")
        .find((el) => el.textContent?.includes("Verzenden mislukt"));
      expect(staleNotice).toBeUndefined();
    });
  });
});
