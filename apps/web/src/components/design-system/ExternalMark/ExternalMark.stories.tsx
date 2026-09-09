import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExternalMark } from "./ExternalMark";

const meta = {
  title: "UI/ExternalMark",
  component: ExternalMark,
  tags: ["autodocs", "vr"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="bg-cream p-8">
        <a href="https://example.com" className="prose-link">
          Bekijk het volledige verslag
          <Story />
        </a>
      </div>
    ),
  ],
} satisfies Meta<typeof ExternalMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InSentence: Story = {
  decorators: [
    (Story) => (
      <p className="text-ink font-body max-w-prose">
        Lees het volledige artikel op{" "}
        <a href="https://example.com" className="prose-link">
          voetbalvlaanderen.be
          <Story />
        </a>
        .
      </p>
    ),
  ],
};
