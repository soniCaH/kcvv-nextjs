import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fixtureImage } from "@test-fixtures/images";
import { SponsorTile } from "./SponsorTile";

const meta = {
  title: "Features/Sponsors/SponsorTile",
  component: SponsorTile,
  tags: ["autodocs", "vr"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared sponsor logo tile used by the homepage/team-page `<SponsorsBlock>` wall and the `/sponsors` page. Cream-soft cell, italic Freight Display wordmark fallback when no logo, and an optional external link with a jersey-deep focus ring. The logo is greyscale-to-colour-on-hover by default, or in colour at rest when `colorAtRest` is set — `/sponsors` is the one page where the logos are the content, not the tail (#2511/#2655).",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-cream-deep w-48 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SponsorTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLogo: Story = {
  args: {
    sponsor: {
      id: "s-1",
      name: "Bakkerij Peeters",
      logo: fixtureImage("sponsor-logo", 0),
      url: "https://example.com/peeters",
      tier: "hoofdsponsor",
    },
  },
};

export const NoLogoFallback: Story = {
  args: {
    sponsor: {
      id: "s-2",
      name: "Garage Vermeulen",
      logo: "",
      url: "https://example.com/vermeulen",
      tier: "sponsor",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "No `logo` → the italic Freight Display wordmark fills the cell instead of an image.",
      },
    },
  },
};

export const WithoutLink: Story = {
  args: {
    sponsor: {
      id: "s-3",
      name: "Tuinaanleg De Smet",
      logo: fixtureImage("sponsor-logo", 2),
      tier: "sympathisant",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "No `url` → the tile renders as a static cell with no link wrapper.",
      },
    },
  },
};

export const Framed: Story = {
  args: {
    sponsor: {
      id: "s-4",
      name: "Apotheek Dilbeek",
      logo: fixtureImage("sponsor-logo", 1),
      url: "https://example.com/apotheek",
      tier: "sponsor",
    },
    framed: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`framed` → the `/sponsors` merged-wall variant: a 1.5px ink border + light ink-muted offset shadow that presses down on hover. One step lighter than the hoofd tiles.",
      },
    },
  },
};

export const GreyscaleAtRest: Story = {
  args: {
    sponsor: {
      id: "s-5",
      name: "Bakkerij Peeters",
      logo: fixtureImage("sponsor-logo", 0),
      url: "https://example.com/peeters",
      tier: "hoofdsponsor",
    },
    colorAtRest: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`colorAtRest: false` (default) → the homepage/team-page wall treatment: the logo renders greyscale and resolves to colour on hover/focus.",
      },
    },
  },
};

export const ColorAtRest: Story = {
  args: {
    sponsor: {
      id: "s-6",
      name: "Apotheek Dilbeek",
      logo: fixtureImage("sponsor-logo", 1),
      url: "https://example.com/apotheek",
      tier: "sponsor",
    },
    framed: true,
    colorAtRest: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`colorAtRest: true` → the `/sponsors` merged-wall treatment: the logo is in colour at rest, no greyscale filter and no hover reveal. Paired with `framed` here to match production usage on `<SponsorTiers>`.",
      },
    },
  },
};
