/**
 * Alert Component Stories
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert } from "./Alert";

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Contextual feedback messages for form validation, confirmations, and system notifications. Four variants: info (green), success, warning, error. Optionally dismissible.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
    title: { control: "text" },
    dismissible: { control: "boolean" },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: "info",
    children: "Inschrijvingen voor het nieuwe seizoen zijn open.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Je bericht is succesvol verzonden.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children:
      "De wedstrijd van zaterdag kan uitgesteld worden wegens weersomstandigheden.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "Er ging iets mis. Controleer je gegevens en probeer opnieuw.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[500px]">
      <Alert variant="info">
        Inschrijvingen voor het nieuwe seizoen zijn open.
      </Alert>
      <Alert variant="success">Je bericht is succesvol verzonden.</Alert>
      <Alert variant="warning">
        De wedstrijd kan uitgesteld worden wegens weersomstandigheden.
      </Alert>
      <Alert variant="error">
        Er ging iets mis. Controleer je gegevens en probeer opnieuw.
      </Alert>
    </div>
  ),
};

export const WithTitle: Story = {
  args: {
    variant: "success",
    title: "Verzonden!",
    children: "We nemen binnen 2 werkdagen contact met je op.",
  },
};

export const WithTitleAllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[500px]">
      <Alert variant="info" title="Info">
        Inschrijvingen voor het nieuwe seizoen zijn open.
      </Alert>
      <Alert variant="success" title="Verzonden!">
        We nemen binnen 2 werkdagen contact met je op.
      </Alert>
      <Alert variant="warning" title="Let op">
        De wedstrijd kan uitgesteld worden wegens weersomstandigheden.
      </Alert>
      <Alert variant="error" title="Fout">
        Er ging iets mis. Controleer je gegevens en probeer opnieuw.
      </Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  args: {
    variant: "info",
    title: "Nieuw seizoen",
    children: "Inschrijvingen voor het nieuwe seizoen zijn open.",
    dismissible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dismissible alert with close button. Wire onDismiss to hide the component.",
      },
    },
  },
};

/**
 * Form validation feedback — error alert below a form
 */
export const FormValidationError: Story = {
  render: () => (
    <div className="w-[500px]">
      <Alert variant="error" title="Formulier onvolledig">
        Vul alle verplichte velden in voor je het formulier verstuurt.
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Typical form-level validation error shown above or below the submit button.",
      },
    },
  },
};

/**
 * Form success feedback — after contact form submission
 */
export const FormSuccess: Story = {
  render: () => (
    <div className="w-[500px]">
      <Alert variant="success" title="Bericht verzonden" dismissible>
        Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.
      </Alert>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: "info",
    title: "Titel",
    children: "Dit is de inhoud van de melding.",
    dismissible: false,
  },
};
