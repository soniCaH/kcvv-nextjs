import type { Metadata } from "next";
import { PageTitle } from "@/components/layout";

export const metadata: Metadata = {
  title: "Cashless Clubkaart | KCVV Elewijt",
  description:
    "Informatie over de cashless clubkaart van KCVV Elewijt — betalen, opladen en de KNIP-app.",
  keywords: ["cashless", "clubkaart", "KNIP", "betalen", "KCVV Elewijt"],
  openGraph: {
    title: "Cashless Clubkaart - KCVV Elewijt",
    description: "Informatie over de cashless clubkaart van KCVV Elewijt",
    type: "website",
  },
};

export default function CashlessPage() {
  return (
    <>
      <PageTitle title="Cashless Clubkaart" />
      <div className="mx-auto max-w-inner-lg px-4 py-8 content">
        {/* Wat */}
        <section className="mb-8">
          <h2 className="mb-4 border-l-4 border-kcvv-green-bright pl-4 text-xl font-bold">
            Wat
          </h2>
          <p>
            Sinds januari 2023 werkt KCVV Elewijt met een{" "}
            <strong>cashless clubkaart</strong> in de kantine. De kaart vervangt
            de oude jetons en maakt het mogelijk om snel en eenvoudig te
            betalen. Je krijgt een gratis kaart aan de toog en laadt ze op met
            een bedrag naar keuze.
          </p>
        </section>

        {/* Waarom */}
        <section className="mb-8">
          <h2 className="mb-4 border-l-4 border-kcvv-green-bright pl-4 text-xl font-bold">
            Waarom
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Correcte prijszetting:</strong> elke consumptie wordt
              exact afgerekend — geen gedoe meer met wisselgeld of jetons.
            </li>
            <li>
              <strong>Voorraadbeheer:</strong> de club kan de stock nauwkeurig
              opvolgen.
            </li>
            <li>
              <strong>Gemak:</strong> geen cash nodig, geen jetons kwijtraken.
              Opladen kan aan de toog of via de app.
            </li>
          </ul>
        </section>

        {/* Jetons */}
        <section className="mb-8">
          <h2 className="mb-4 border-l-4 border-kcvv-green-bright pl-4 text-xl font-bold">
            Wat met mijn jetons?
          </h2>
          <p>
            Supporters die nog jetons hebben, kunnen deze laten omzetten naar
            een cashless kaart. Elke jeton heeft een waarde van{" "}
            <strong>1 euro</strong> en wordt op je saldo gezet.
          </p>
        </section>

        {/* KNIP-app */}
        <section className="mb-8">
          <h2 className="mb-4 border-l-4 border-kcvv-green-bright pl-4 text-xl font-bold">
            KNIP-app
          </h2>
          <p>
            Op je clubkaart staat een QR-code waarmee je de kaart koppelt aan
            een persoonlijk account via de <strong>KNIP-app</strong>{" "}
            (beschikbaar op{" "}
            <a
              href="https://apps.apple.com/be/app/knip/id1596978498"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple iOS
            </a>{" "}
            en{" "}
            <a
              href="https://play.google.com/store/apps/details?id=be.knip.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Android
            </a>
            ).
          </p>
          <p>Via de app kan je:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Je saldo raadplegen zonder de kaart te scannen</li>
            <li>Betalen via je smartphone als je je kaart vergeten bent</li>
            <li>
              Bij verlies of diefstal je saldo laten overzetten naar een nieuwe
              kaart
            </li>
          </ul>
        </section>

        {/* Komt eraan */}
        <section className="mb-8">
          <h2 className="mb-4 border-l-4 border-kcvv-green-bright pl-4 text-xl font-bold">
            Komt eraan
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Betalen via Payconiq</li>
            <li>
              Je kaart vanop afstand opladen via de app — zonder aan te schuiven
              aan de toog
            </li>
          </ul>
        </section>

        {/* Algemene voorwaarden */}
        <section>
          <h2 className="mb-4 border-l-4 border-kcvv-green-bright pl-4 text-xl font-bold">
            Algemene voorwaarden
          </h2>
          <p>
            De volledige algemene voorwaarden van de cashless clubkaart zijn
            beschikbaar aan de toog of op aanvraag via{" "}
            <a href="mailto:info@kcvvelewijt.be">info@kcvvelewijt.be</a>.
          </p>
        </section>
      </div>
    </>
  );
}
