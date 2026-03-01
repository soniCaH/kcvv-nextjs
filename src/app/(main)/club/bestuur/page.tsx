import { createBoardPage } from "../createBoardPage";

const { generateMetadata, Page } = createBoardPage({
  slug: "bestuur",
  fallbackDescription: "Het bestuur van KCVV Elewijt",
  fallbackTitle: "Bestuur",
});

export { generateMetadata };
export default Page;
export const revalidate = 3600;
