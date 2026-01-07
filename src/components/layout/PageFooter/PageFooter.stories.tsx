/**
 * PageFooter Component Stories
 * Showcases the site footer with black background and wavy SVG top
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Link from "next/link";
import Image from "next/image";
import { SocialLinks } from "@/components/design-system";
import { Sponsors, mockSponsors } from "@/components/sponsors";
import { cn } from "@/lib/utils/cn";

// Contact rows configuration (same as PageFooter)
const contactRows = [
  { label: "KCVV Elewijt", value: "Driesstraat 30, 1982 Elewijt" },
  { label: "Voorzitter", value: "Rudy Bautmans" },
  {
    label: "GC",
    value: (
      <a
        href="mailto:gc@kcvvelewijt.be"
        className="text-kcvv-green-bright hover:underline"
      >
        John De Ron
      </a>
    ),
  },
  {
    label: "Algemeen contact",
    value: (
      <a
        href="mailto:info@kcvvelewijt.be"
        className="text-kcvv-green-bright hover:underline"
      >
        info@kcvvelewijt.be
      </a>
    ),
  },
  {
    label: "Jeugdwerking",
    value: (
      <a
        href="mailto:jeugd@kcvvelewijt.be"
        className="text-kcvv-green-bright hover:underline"
      >
        jeugd@kcvvelewijt.be
      </a>
    ),
  },
  {
    label: "Verhuur kantine",
    value: (
      <a
        href="mailto:verhuur@kcvvelewijt.be"
        className="text-kcvv-green-bright hover:underline"
      >
        Ann Walgraef
      </a>
    ),
  },
  {
    label: "Website",
    value: (
      <a
        href="mailto:kevin@kcvvelewijt.be"
        className="text-kcvv-green-bright hover:underline"
      >
        Kevin Van Ransbeeck
      </a>
    ),
  },
  {
    label: "Privacy & cookies",
    value: (
      <a href="/privacy" className="text-kcvv-green-bright hover:underline">
        Privacyverklaring
      </a>
    ),
  },
];

// PageFooter component for Storybook (with inline sponsors instead of server component)
const PageFooterStorybook = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn("relative z-10 mt-[50px] text-white", className)}
      style={{
        background:
          "linear-gradient(to bottom, transparent 0%, transparent 50px, #1E2024 50px 100%), url(/images/footer-top.svg) top center no-repeat",
        backgroundSize: "100%",
        padding: "75px 2rem 2rem",
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Section - 5 columns */}
          <div className="lg:col-span-5">
            <div className="flex flex-row items-center mb-8">
              <div className="mr-6">
                <Link href="/">
                  <Image
                    src="/images/logo-flat.png"
                    alt="KCVV ELEWIJT"
                    width={150}
                    height={60}
                    className="h-auto w-auto"
                  />
                </Link>
              </div>
              <SocialLinks variant="circle" />
            </div>

            <table className="w-full text-[0.875rem]">
              <tbody>
                {contactRows.map((row, index) => (
                  <tr
                    key={index}
                    className="lg:table-row flex flex-col lg:flex-row mb-2 lg:mb-0"
                  >
                    <th className="text-left font-normal uppercase p-0 lg:pr-4 lg:pb-1 lg:align-top lg:w-[180px] underline lg:no-underline">
                      {row.label}
                    </th>
                    <td className="p-0 lg:pb-1 lg:align-top text-white">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vertical Divider - 1 column */}
          <div className="hidden lg:block lg:col-span-1 relative">
            <div
              className="absolute h-full w-px top-0 left-1/2"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 100%)",
              }}
            />
          </div>

          {/* Sponsors Section - 6 columns */}
          <div className="lg:col-span-6">
            <Sponsors
              sponsors={mockSponsors}
              title="Onze sponsors"
              description="KCVV Elewijt wordt mede mogelijk gemaakt door onze trouwe sponsors."
              columns={4}
              variant="dark"
              showViewAll={true}
              viewAllHref="/sponsors"
              className="py-0"
            />
          </div>
        </div>
      </div>

      {/* Bottom Motto - Desktop only */}
      <div
        className="hidden lg:block relative pt-12 -mb-8 -mx-8"
        style={{
          width: "100vw",
          marginLeft: "-2rem",
        }}
      >
        <div
          className="absolute top-4 left-0 w-full h-px"
          style={{
            background:
              "linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 33%, rgba(255, 255, 255, 0.2) 66%, rgba(255, 255, 255, 0) 100%)",
          }}
        />

        <p className="text-center text-white/60 text-sm italic py-4">
          Er is maar één plezante compagnie
        </p>
      </div>
    </footer>
  );
};

const meta = {
  title: "Layout/PageFooter",
  component: PageFooterStorybook,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Site footer with contact info, social links, and sponsors. Black background (#1E2024) with wavy SVG top edge. Note: This Storybook version uses mock data instead of fetching from Drupal CMS.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PageFooterStorybook>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default footer with all sections
 * Shows black background with SVG wavy top, contact table, social links, and sponsors grid
 */
export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[400px] flex items-center justify-center bg-white">
        <p className="text-gray-600">Page content above footer</p>
      </div>
      <PageFooterStorybook />
    </div>
  ),
};

/**
 * Footer with full page context
 */
export const WithPageContent: Story = {
  render: () => (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-kcvv-gray-blue mb-4">
            Page Content
          </h1>
          <p className="text-gray-600 mb-6">
            This shows how the footer looks at the bottom of a page with the
            wavy SVG transition.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded p-6"
              >
                <h3 className="font-bold text-lg mb-2">
                  Content Block {i + 1}
                </h3>
                <p className="text-gray-600 text-sm">
                  Sample content above the footer.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <PageFooterStorybook />
    </div>
  ),
};

/**
 * Mobile view
 */
export const MobileView: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[300px] flex items-center justify-center bg-white">
        <p className="text-gray-600 text-sm">Page content</p>
      </div>
      <PageFooterStorybook />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
