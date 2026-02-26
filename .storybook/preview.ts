import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ["Foundation", "UI", "Features", "Layout", "Pages", "*"],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
        query: {},
        segments: [],
      },
      router: {
        basePath: "",
      },
    },
  },
};

export default preview;
