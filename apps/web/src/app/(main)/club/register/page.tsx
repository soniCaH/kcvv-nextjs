import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/layout";

export const metadata: Metadata = {
  title: "Praktische Info | KCVV Elewijt",
  description:
    "Praktische informatie rond inschrijvingen, lidgeld, ProSoccerData en meer bij KCVV Elewijt.",
  keywords: [
    "inschrijving",
    "praktische info",
    "lidgeld",
    "ProSoccerData",
    "KCVV Elewijt",
  ],
  openGraph: {
    title: "Praktische Info - KCVV Elewijt",
    description: "Praktische informatie rond inschrijvingen bij KCVV Elewijt",
    type: "website",
  },
};

export default function RegisterPage() {
  return (
    <>
      <PageTitle title="Praktische Informatie" />
      <div className="mx-auto max-w-inner-lg px-4 py-8 content">
        {/* Inschrijvingen */}
        <h2 className="mb-4 border-l-4 border-kcvv-green-bright pl-4 text-xl font-bold">
          Inschrijvingen
        </h2>
        <section className="mb-8">
          <p>
            Alle spelers en speelsters vanaf 4-5 jaar zijn welkom om een/enkele
            proeftrainingen af te werken voor definitief in te schrijven.
            Hiervoor kan je contact opnemen met de trainer (
            <Link href="/jeugd">overzicht</Link>) of de jeugdverantwoordelijken.
          </p>
          <p>
            Overtuigd en wil je graag lid worden van KCVV Elewijt? Inschrijven
            kan wekelijks in onze kantine na afspraak met de GC via{" "}
            <a href="mailto:jeugd@kcvvelewijt.be">jeugd@kcvvelewijt.be</a>.
          </p>

          <h3 className="mt-6 font-bold">Bijdrage lidgeld</h3>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>
              CM:{" "}
              <a
                href="https://www.cm.be/media/Aanvraag-terugbetaling-inschrijving-sportvereniging_tcm47-24959.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aanvraag terugbetaling
              </a>
            </li>
            <li>
              De Voorzorg/FSMB/Solidaris:{" "}
              <a
                href="https://www.solidaris-vlaanderen.be/terugbetaling-sport"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terugbetaling sport
              </a>
            </li>
            <li>
              Liberale mutualiteit:{" "}
              <a
                href="https://www.lm-ml.be/nl/documenten/formulier-terugbetaling-sport"
                target="_blank"
                rel="noopener noreferrer"
              >
                Formulier terugbetaling sport
              </a>
            </li>
            <li>
              VNZ:{" "}
              <a
                href="https://www.vnz.be/voordelen-terugbetalingen/sport-fitnessclub/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sport &amp; fitnessclub
              </a>
            </li>
            <li>
              OZ/Partena/Helan:{" "}
              <a
                href="https://www.helan.be/nl/ons-aanbod/ziekenfonds/voordelen-en-terugbetalingen/sportclub-lidgeld/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sportclub lidgeld
              </a>
            </li>
          </ul>
        </section>

        {/* ProSoccerData */}
        <h2 className="mb-4 border-l-4 border-kcvv-green-bright pl-4 text-xl font-bold">
          ProSoccerData
        </h2>
        <section className="mb-8">
          <p>
            KCVV Elewijt gebruikt de tool &quot;ProSoccerData&quot; als primair
            en centraal communicatiemiddel tussen trainers, spelers, ouders...
            Via deze weg worden trainingen ingepland, wedstrijdselecties
            ingevuld, communicatie verzorgd, spelers en ouders op te hoogte
            gehouden van wijzigingen of evenementen enz...
          </p>
          <p>
            Elke speler of ouder krijgt toegang tot deze tool via een
            persoonlijke login.
          </p>
          <p>
            Website:{" "}
            <a
              href="https://kcvv.prosoccerdata.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://kcvv.prosoccerdata.com/
            </a>
          </p>
        </section>

        {/* Trooper & Makro */}
        <h2 className="mb-4 border-l-4 border-kcvv-green-bright pl-4 text-xl font-bold">
          Steuntje via Trooper of Makro
        </h2>
        <section className="mb-8">
          <h3 className="mt-2 font-bold">Trooper</h3>
          <p>
            Trooper werkt samen met een groot aantal webshops die zich in de
            kijker willen zetten. In ruil voor een extra klik via Trooper
            krijgen wij een percentje op jouw volgende bestelling.
          </p>
          <p>
            Surf voor je een bestelling plaatst even via{" "}
            <a
              href="https://trooper.be/kcvvelewijt"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://trooper.be/kcvvelewijt
            </a>
            .
          </p>
          <p>
            <Link href="/news/2020-04-12-steun-kcvv-elewijt-trooper-mymakro">
              Lees er hier meer over!
            </Link>
          </p>

          <h3 className="mt-6 font-bold">MyMakro</h3>
          <p>
            Link nu jouw Makro voordeelkaart aan onze vereniging. Bij elke
            aankoop bij Makro en partners steun je KCVV Elewijt!
          </p>
          <p>
            Surf naar{" "}
            <a
              href="https://my.makro.be/nl/link-vereniging/02277464"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://my.makro.be/nl/link-vereniging/02277464
            </a>{" "}
            om je kaart te koppelen.
          </p>
          <p>Onze vereniging dankt jullie van harte!</p>
        </section>

        {/* Social media */}
        <div className="flex flex-wrap gap-3">
          <a
            href="https://facebook.com/KCVVElewijt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#3b5998] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com/kcvve"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1da1f2] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            X / Twitter
          </a>
          <a
            href="https://www.instagram.com/kcvve"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#e1306c] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Instagram
          </a>
        </div>
      </div>
    </>
  );
}
