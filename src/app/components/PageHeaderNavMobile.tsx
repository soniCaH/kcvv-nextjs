export const PageHeaderNavMobile = () => {
  return (
    <div
      className="header-mobile clearfix block md:hidden bg-gray-900"
      id="header-mobile"
    >
      <div className="header-mobile__logo text-center absolute left-1/2 transform -translate-x-1/2 top-1">
        <a href="#">H</a>
      </div>
      <div className="header-mobile__inner relative z-20 h-16 bg-gray-900">
        <a
          id="header-mobile__toggle"
          className="burger-menu-icon absolute top-10 left-8 w-6 h-5 cursor-pointer"
        >
          <span className="burger-menu-icon__line block h-0.5 w-full bg-white rounded"></span>
        </a>
      </div>
    </div>
  );
};
