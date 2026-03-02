import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageTitle } from "@/components/layout";

export const metadata: Metadata = {
  title: "Meer over de club | KCVV Elewijt",
  description:
    "Ontdek alles over KCVV Elewijt: geschiedenis, bestuur, jeugdwerking, supporters en meer.",
  keywords: [
    "KCVV Elewijt",
    "club",
    "bestuur",
    "geschiedenis",
    "jeugd",
    "supporters",
  ],
  openGraph: {
    title: "Meer over de club - KCVV Elewijt",
    description: "Ontdek alles over KCVV Elewijt",
    type: "website",
  },
};

interface ClubSectionProps {
  title: string;
  children: React.ReactNode;
  href: string;
  linkLabel: string;
}

function ClubSection({ title, children, href, linkLabel }: ClubSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 border-l-4 border-kcvv-green-bright pl-4 text-xl font-bold">
        {title}
      </h2>
      <div className="content">{children}</div>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 font-semibold text-kcvv-green-bright transition-colors hover:text-kcvv-green-hover"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

export default function ClubPage() {
  return (
    <>
      <PageTitle title="Er is maar één plezante compagnie" />
      <main className="mx-auto max-w-inner-lg px-4 py-8">
        <ClubSection
          title="Geschiedenis"
          href="/club/history"
          linkLabel="Meer over de geschiedenis"
        >
          <blockquote className="mb-4 border-l-4 border-kcvv-gray-light pl-4 italic text-kcvv-gray">
            <strong>Koninklijk Voetbal Vereniging Crossing Elewijt</strong> is
            aangesloten bij de KBVB met stamnummer 55 en speelt vanaf het
            seizoen 2025/26 in derde afdeling Voetbal Vlaanderen. Met dit
            stamnummer speelde de Brusselse club Crossing Club de Schaerbeek in
            de jaren &apos;70 nog in de Eerste Klasse.
          </blockquote>
          <p>
            Het stamnummer 55 gaat al een hele tijd mee en verhuisde in zijn
            iets meer dan 100-jarige bestaan al enkele keren van thuishaven.
            Sinds 1983 is die thuishaven Elewijt.
          </p>
        </ClubSection>

        <ClubSection
          title="Bestuur"
          href="/club/bestuur"
          linkLabel="Maak kennis met het bestuur"
        >
          <p>
            KCVV Elewijt wordt al enkele jaren geleid door een gepassioneerde en
            trouwe kern van bestuursleden. In een toffe mix van jong en iets
            minder jong wordt enthousiast gewerkt om van KCVV een gezonde en
            aangename club te maken, waarin sportieve ambitie en plezier
            gecombineerd kunnen worden.
          </p>
        </ClubSection>

        <ClubSection
          title="Jeugdwerking"
          href="/club/jeugdbestuur"
          linkLabel="Ontmoet het jeugdbestuur"
        >
          <p>
            Na enkele jaren waarin we achter de feiten holden en veel lokale
            jeugdspelers zagen vertrekken naar buurgemeenten, heeft KCVV Elewijt
            sinds kort zijn pijlen volop op de bouw van onderuit gericht. Zo
            wordt er dit seizoen niet alleen een kunstgrasveld aangelegd, wat
            zowel de trainings- als de wedstrijdkwaliteit zal verbeteren, maar
            werd er ook een ambitieuse jeugdcoördinator aangesteld die zowel
            spelers, ouders als trainers van dichtbij zal opvolgen, gestaafd met
            leerrijke opleidingsplannen.
          </p>
        </ClubSection>

        <ClubSection
          title="KCVV Angels"
          href="/club/angels"
          linkLabel="Ontmoet onze Angels"
        >
          <p>
            Onze KCVV Angels staan altijd met open armen klaar. Sponsors in de
            watten leggen, VIP-lunches organiseren, eetfestijnen in goede banen
            leiden of gewoon samen een glaasje cava drinken, onze Angels doen
            het met hun allermooiste glimlach.
          </p>
        </ClubSection>

        <ClubSection
          title="Contact"
          href="/club/contact"
          linkLabel="Neem contact op"
        >
          <p>
            Binnen de club heeft iedereen zijn eigen &quot;domein&quot;. Wil je
            graag contact over de sponsormogelijkheden, een aansluiting, een
            vriendenwedstrijd of iets anders? Met de juiste contactpersoon als
            startpunt hebben we onmiddellijk een rechtstreekse lijn!
          </p>
        </ClubSection>

        <ClubSection
          title="KCVV Ultras"
          href="/club/ultras"
          linkLabel="Meer over de supportersclub"
        >
          <p>
            De naam KCVV Ultras werd enkele jaren geleden op facebook in het
            leven geroepen door een bende supporters die elke week trouw op post
            stonden. Het enthousiasme, gekoppeld aan de goede resultaten, werkte
            aanstekelijk en de bende groeide al snel.
          </p>
        </ClubSection>

        <ClubSection
          title="Downloads"
          href="/club/downloads"
          linkLabel="Download documenten"
        >
          <p>
            Een overzicht van alle documenten die te downloaden zijn.
            Reglementen, ongevalsaangifte enz...
          </p>
        </ClubSection>

        <ClubSection
          title="Praktische informatie"
          href="/club/register"
          linkLabel="Praktische info"
        >
          <p>
            Hoe en wanneer kan ik mijn kind inschrijven? Hoe kan ik een bijdrage
            van mijn mutualiteit aanvragen voor het lidgeld? Wat is
            ProSoccerData en hoe raak ik hier op? Kan ik KCVV steunen of volgen
            op social media? Alles gebundeld op één pagina.
          </p>
        </ClubSection>

        <ClubSection
          title="Cashless clubkaart"
          href="/club/cashless"
          linkLabel="Cashless clubkaart"
        >
          <p>
            Waar zijn de jetonnekes naartoe? Hoe kom ik aan een clubkaart?
            Waarom is er overgeschakeld? Wat kan ik met mijn kaart/app? Dit + de
            algemene voorwaarden.
          </p>
        </ClubSection>

        <ClubSection
          title="Organigram"
          href="/club/organigram"
          linkLabel="Bekijk het organigram"
        >
          <p>
            Een overzicht van de volledige clubstructuur en alle
            verantwoordelijkheden binnen KCVV Elewijt.
          </p>
        </ClubSection>
      </main>
    </>
  );
}
