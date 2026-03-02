import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { PageTitle } from "@/components/layout";

export const metadata: Metadata = {
  title: "Downloads | KCVV Elewijt",
  description:
    "Download digitale documenten van KCVV Elewijt — ongevalsaangifte, reglementen en meer.",
  keywords: [
    "downloads",
    "documenten",
    "KCVV Elewijt",
    "ongevalsaangifte",
    "reglement",
  ],
  openGraph: {
    title: "Downloads - KCVV Elewijt",
    description: "Download digitale documenten van KCVV Elewijt",
    type: "website",
  },
};

interface DownloadCardProps {
  title: string;
  description: string;
  href: string;
}

function DownloadCard({ title, description, href }: DownloadCardProps) {
  return (
    <Link
      href={href}
      download
      className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-kcvv-green-bright/10">
        <FileText className="h-6 w-6 text-kcvv-green-bright" />
      </div>
      <div>
        <h3 className="font-bold text-lg text-kcvv-black">{title}</h3>
        <p className="mt-1 text-sm text-kcvv-gray">{description}</p>
        <span className="mt-2 inline-block rounded bg-kcvv-green-bright px-3 py-1 text-xs font-semibold uppercase text-white">
          Download
        </span>
      </div>
    </Link>
  );
}

export default function DownloadsPage() {
  return (
    <>
      <PageTitle title="Digitale documenten - downloads" />
      <div className="mx-auto max-w-inner-lg px-4 py-8">
        <h2 className="mb-4 border-l-4 border-kcvv-green-bright pl-4 text-xl font-bold">
          Aangiftes
        </h2>
        <div className="mb-8 space-y-4">
          <DownloadCard
            title="Ongevalsaangifte"
            description="Vanaf 1 september 2023 worden enkel nog digitale ongevalsaangiftes aanvaard. Gelieve bijgevoegd document ingevuld — digitaal — aan de GC te bezorgen."
            href="/downloads/insurance_medical_attest_template_nl.pdf"
          />
        </div>

        <h2 className="mb-4 border-l-4 border-kcvv-green-bright pl-4 text-xl font-bold">
          Reglementen
        </h2>
        <div className="space-y-4">
          <DownloadCard
            title="Reglement van Inwendige Orde"
            description="Elke persoon die het complex betreedt, wordt verwacht kennis te nemen van (de bepalingen van) dit reglement, deze te aanvaarden en vooral na te leven."
            href="/downloads/reglement_inwendige_orde_2022.pdf"
          />
          <DownloadCard
            title="De 'ideale' voetbal(groot)ouders"
            description="Het is fantastisch om te zien hoe trots u op uw (klein)kind bent en hoe u hen wilt aanmoedigen om het beste uit zichzelf te halen. In deze boodschap willen we u echter ook waarschuwen voor overmatig druk zetten op uw, maar ook andere, kinderen."
            href="/downloads/2022-2023_-_De_ideale_voetbalgrootouder.pdf"
          />
        </div>
      </div>
    </>
  );
}
