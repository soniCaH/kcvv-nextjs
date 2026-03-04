import { createBoardPage } from "../createBoardPage";

const { generateMetadata, Page } = createBoardPage({
  slug: "jeugdbestuur",
  fallbackDescription: "Het jeugdbestuur van KCVV Elewijt",
  fallbackTitle: "Jeugdbestuur",
});

export { generateMetadata };
export default Page;
export const revalidate = 3600;
