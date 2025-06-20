import { PageHeaderNavDesktop } from "./PageHeaderNavDesktop";
import { PageHeaderNavMobile } from "./PageHeaderNavMobile";

export const PageHeader = () => {
  return (
    <>
      <PageHeaderNavMobile />
      <PageHeaderNavDesktop />
    </>
  );
};
