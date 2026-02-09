/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPage from "./page";

describe("PrivacyPage", () => {
  it("renders the privacy policy page", () => {
    render(<PrivacyPage />);

    // Check main heading
    expect(
      screen.getByRole("heading", { name: /privacyverklaring/i, level: 1 }),
    ).toBeInTheDocument();
  });

  it("displays all required sections", () => {
    render(<PrivacyPage />);

    // Key sections that must be present
    expect(
      screen.getByRole("heading", { name: /contactgegevens/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /welke gegevens verzamelen we/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /waarvoor gebruiken we je gegevens/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /jouw rechten/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /cookiebeleid/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /beveiliging/i }),
    ).toBeInTheDocument();
  });

  it("displays contact information", () => {
    render(<PrivacyPage />);

    // Check for club name
    expect(screen.getByText(/KCVV Elewijt vzw/i)).toBeInTheDocument();

    // Check for address (appears multiple times, so use getAllByText)
    const addressElements = screen.getAllByText(
      /Driesstraat 30, 1982 Elewijt/i,
    );
    expect(addressElements.length).toBeGreaterThan(0);

    // Check for email links (appear multiple times)
    const infoEmails = screen.getAllByText("info@kcvvelewijt.be");
    expect(infoEmails.length).toBeGreaterThan(0);

    const kevinEmails = screen.getAllByText("kevin@kcvvelewijt.be");
    expect(kevinEmails.length).toBeGreaterThan(0);
  });

  it("includes GDPR rights information", () => {
    render(<PrivacyPage />);

    // Check for GDPR rights
    expect(screen.getByText(/recht op inzage/i)).toBeInTheDocument();
    expect(screen.getByText(/recht op correctie/i)).toBeInTheDocument();
    expect(screen.getByText(/recht op verwijdering/i)).toBeInTheDocument();
    expect(screen.getByText(/recht op bezwaar/i)).toBeInTheDocument();
  });

  it("has working email links", () => {
    render(<PrivacyPage />);

    // Find all mailto links
    const emailLinks = screen.getAllByRole("link", {
      name: /info@kcvvelewijt\.be/i,
    });

    // Check at least one email link exists and has correct href
    expect(emailLinks.length).toBeGreaterThan(0);
    expect(emailLinks[0]).toHaveAttribute("href", "mailto:info@kcvvelewijt.be");
  });

  it("has link to help page", () => {
    render(<PrivacyPage />);

    const helpLink = screen.getByRole("link", {
      name: /contact via hulppagina/i,
    });

    expect(helpLink).toHaveAttribute("href", "/hulp");
  });

  it("mentions cookie types", () => {
    render(<PrivacyPage />);

    expect(screen.getByText(/noodzakelijke cookies/i)).toBeInTheDocument();
    expect(screen.getByText(/analytische cookies/i)).toBeInTheDocument();
  });

  it("includes data retention information", () => {
    render(<PrivacyPage />);

    expect(
      screen.getByRole("heading", { name: /hoe lang bewaren we je gegevens/i }),
    ).toBeInTheDocument();
  });

  it("mentions GDPR/AVG compliance", () => {
    render(<PrivacyPage />);

    expect(screen.getByText(/GDPR\/AVG/i)).toBeInTheDocument();
  });

  it("displays last updated date", () => {
    render(<PrivacyPage />);

    expect(screen.getByText(/laatst bijgewerkt/i)).toBeInTheDocument();
  });

  it("has a call-to-action section for questions", () => {
    render(<PrivacyPage />);

    expect(
      screen.getByRole("heading", { name: /vragen over privacy/i }),
    ).toBeInTheDocument();

    // Check for both CTA buttons
    expect(
      screen.getByRole("link", { name: /contact via hulppagina/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /e-mail ons direct/i }),
    ).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    const { container } = render(<PrivacyPage />);

    // Check for gradient background
    const mainContainer = container.querySelector(
      ".bg-gradient-to-br.from-gray-50",
    );
    expect(mainContainer).toBeInTheDocument();
  });
});
