import { createBoardPage } from "../createBoardPage";

const { generateMetadata, Page } = createBoardPage({
  slug: "angels",
  fallbackDescription: "De Angels van KCVV Elewijt",
  fallbackTitle: "Angels",
});

export { generateMetadata };
export default Page;
export const revalidate = 3600;
