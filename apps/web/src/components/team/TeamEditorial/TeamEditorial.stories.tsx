import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { PortableTextBlock } from "@portabletext/react";
import { TeamEditorial } from "./TeamEditorial";

function block(
  ...spans: ReadonlyArray<{ text: string; marks?: string[] }>
): PortableTextBlock {
  return {
    _type: "block",
    _key: `block-${spans.map((s) => s.text.slice(0, 4)).join("-")}`,
    style: "normal",
    children: spans.map((span, i) => ({
      _type: "span",
      _key: `span-${i}`,
      text: span.text,
      marks: span.marks ?? [],
    })),
    markDefs: [],
  } as unknown as PortableTextBlock;
}

const body: PortableTextBlock[] = [
  block(
    {
      text: "Onze A-ploeg speelt al sinds de promotie in 2018 op het hoogste provinciale niveau. De kern bestaat uit een mix van eigen jeugd en ervaren spelers. ",
    },
    {
      text: "Hier wordt voetbal nog met het hart gespeeld.",
      marks: ["pullquote"],
    },
  ),
  block({
    text: "Elke week opnieuw zetten de spelers, de staf en de supporters samen de schouders eronder.",
  }),
];

const contactInfo: PortableTextBlock[] = [
  block({ text: "Ploegafgevaardigde: Jan Janssens — 0470 12 34 56" }),
  block({ text: "Secretariaat: info@kcvvelewijt.be" }),
];

const meta = {
  title: "Features/Teams/TeamEditorial",
  component: TeamEditorial,
  parameters: { layout: "padded" },
  tags: ["autodocs", "vr"],
} satisfies Meta<typeof TeamEditorial>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both blocks present, body carries a "Het verhaal" pull-quote. */
export const FullEditorial: Story = {
  args: { body, contactInfo },
};

/** Only the contact block — verhaal auto-hides. */
export const ContactOnly: Story = {
  args: { contactInfo },
};

/** Body without a pullquote — prose renders, no lifted quote card. */
export const BodyNoPullquote: Story = {
  args: {
    body: [
      block({
        text: "Een beknopte ploegbeschrijving zonder uitgelicht citaat.",
      }),
    ],
  },
};
