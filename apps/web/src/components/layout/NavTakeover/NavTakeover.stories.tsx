import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavTakeover } from "./NavTakeover";
import { NavTakeoverItem } from "./NavTakeoverItem";
import { Button } from "@/components/design-system/Button";

const meta = {
  title: "Layout/NavTakeover",
  component: NavTakeover,
  tags: ["autodocs", "vr"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof NavTakeover>;

export default meta;
type Story = StoryObj<typeof meta>;

const wordmark = (
  <span className="font-display text-[20px] font-black italic">
    KCVV <span className="text-jersey-deep">Elewijt</span>
  </span>
);

/**
 * The production nav, flat (#2415) — no submenu rows exist any more. `Home` is
 * absent because the wordmark above is the home link.
 */
const navItems = (
  <>
    <NavTakeoverItem label="Nieuws" href="/nieuws" active />
    <NavTakeoverItem label="Wedstrijden" href="/kalender" />
    <NavTakeoverItem label="Evenementen" href="/evenementen" />
    <NavTakeoverItem label="A-ploeg" href="/ploegen/eerste-elftallen-a" />
    <NavTakeoverItem label="B-ploeg" href="/ploegen/eerste-elftallen-b" />
    <NavTakeoverItem label="Jeugd" href="/jeugd" />
    <NavTakeoverItem label="Sponsors" href="/sponsors" />
    <NavTakeoverItem label="Hulp" href="/hulp" />
    <NavTakeoverItem label="De club" href="/club" />
    <div className="mt-6">
      <Button variant="primary" size="md" fullWidth>
        Word lid
      </Button>
    </div>
  </>
);

export const Open: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    wordmark,
    children: navItems,
  },
};
