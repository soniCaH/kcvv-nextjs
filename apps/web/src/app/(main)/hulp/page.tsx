/**
 * Help / Responsibility Finder Page
 *
 * "Ik ben ... en ik ..." question builder to find the right contact person
 */

import type { Metadata } from "next";
import { HelpPage } from "@/components/hulp/HelpPage/HelpPage";

export const metadata: Metadata = {
  title: "Hulp & Contact | KCVV Elewijt",
  description:
    "Vind snel de juiste contactpersoon voor jouw vraag. Wie ben je en wat wil je weten?",
  keywords: [
    "hulp",
    "contact",
    "vraag",
    "verantwoordelijke",
    "wie contacteren",
    "KCVV Elewijt",
  ],
  openGraph: {
    title: "Hulp & Contact - KCVV Elewijt",
    description: "Vind snel de juiste contactpersoon voor jouw vraag",
    type: "website",
  },
};

export default function HelpPageRoute() {
  return <HelpPage />;
}
