import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";
import { MembershipForm } from "@/components/club/MembershipForm/MembershipForm";

/**
 * Membership-intake form for `/club/word-lid`, built from the locked Phase 2.A.4
 * form atoms inside a <ClippedCard> + <StampBadge> shell. Role selector reveals
 * role-specific fields; a minor birth date reveals the parent-consent block.
 *
 * `defaultRole` / `defaultBirthDate` exist only to render the conditional
 * branches statically for docs + visual regression — the live form starts empty.
 */
const meta: Meta<typeof MembershipForm> = {
  title: "Features/Forms/MembershipForm",
  component: MembershipForm,
  tags: ["autodocs", "vr"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="bg-cream w-[760px] max-w-full p-12">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty form — base fields, no role selected yet. */
export const Default: Story = {};

/** Senior player — reveals the medical-certificate acknowledgment. */
export const Speler: Story = {
  args: { defaultRole: "speler" },
};

/** Volunteer — base fields only, no medical cert. */
export const Vrijwilliger: Story = {
  args: { defaultRole: "vrijwilliger" },
};

/** Minor youth player — medical cert + parent-consent block both visible. */
export const MinderjarigeJeugdspeler: Story = {
  args: { defaultRole: "jeugdspeler", defaultBirthDate: "2014-05-01" },
};

/**
 * The transport `fetch` rejects (#2580) — a Tier 2 `<EmptyState>` notice, no
 * action (the submit button below it already survives). Forcing the
 * rejection via `beforeEach` keeps this deterministic for VR.
 */
export const TransportFailure: Story = {
  args: { defaultRole: "vrijwilliger" },
  beforeEach: () => {
    const original = globalThis.fetch;
    globalThis.fetch = () => Promise.reject(new Error("Network error"));
    return () => {
      globalThis.fetch = original;
    };
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/Voornaam/), "Jan");
    await userEvent.type(canvas.getByLabelText(/Achternaam/), "Peeters");
    await userEvent.type(canvas.getByLabelText(/Geboortedatum/), "1990-06-15");
    await userEvent.selectOptions(canvas.getByLabelText(/Geslacht/), "m");
    await userEvent.type(canvas.getByLabelText(/Gemeente/), "Elewijt");
    await userEvent.type(canvas.getByLabelText(/^E-mail/), "jan@example.com");
    await userEvent.click(canvas.getByLabelText(/privacyverklaring/i));
    await userEvent.click(canvas.getByText(/Verstuur aanvraag/));
    await canvas.findByRole("status");
  },
};
