export const PageHeaderNavDesktop = () => {
  return (
    <header className="w-full relative">
      {/* Header Secondary */}
      <div className="header__secondary header__secondary--split-bg hidden lg:block relative">
        {/* Header Secondary Background */}
        <div className="header__secondary-bg-layer effect-duotone effect-duotone--primary absolute left-0 w-1/2 h-full bg-cover bg-no-repeat bg-center">
          <div className="effect-duotone__layer">
            <div className="effect-duotone__layer-inner"></div>
          </div>
        </div>
        {/* Header Secondary Background / End */}

        <div className="container mx-auto flex justify-between items-center relative z-10">
          {/* Social Icons */}
          <ul className="info-block info-block--header info-block--social flex space-x-8">
            <li className="info-block__item info-block__item--sm flex items-center space-x-2">
              <div className="df-icon df-icon--custom text-xl text-blue-600">
                <i className="fab fa-facebook"></i>
              </div>
              <h6 className="info-block__heading text-xs font-bold uppercase">
                Facebook
              </h6>
              <a
                className="info-block__link text-xs text-blue-400 hover:underline"
                href="https://facebook.com/danfisher.dev/"
              >
                /alchemistsHOCKEY
              </a>
            </li>
            <li className="info-block__item info-block__item--sm flex items-center space-x-2">
              <div className="df-icon df-icon--custom text-xl text-blue-400">
                <i className="fab fa-twitter"></i>
              </div>
              <h6 className="info-block__heading text-xs font-bold uppercase">
                Twitter
              </h6>
              <a
                className="info-block__link text-xs text-blue-400 hover:underline"
                href="https://twitter.com/danfisher_dev"
              >
                /@alchemistsHOCKEY
              </a>
            </li>
            <li className="info-block__item info-block__item--sm flex items-center space-x-2">
              <div className="df-icon df-icon--custom text-xl text-pink-500">
                <i className="fab fa-instagram"></i>
              </div>
              <h6 className="info-block__heading text-xs font-bold uppercase">
                Instagram
              </h6>
              <a
                className="info-block__link text-xs text-pink-400 hover:underline"
                href="https://www.instagram.com/dan.fisher.dev/"
              >
                @alcstHOCKEY
              </a>
            </li>
          </ul>
          {/* Social Icons / End */}

          {/* Info Block */}
          <ul className="info-block info-block--header flex space-x-8">
            <li className="info-block__item info-block__item--contact-primary flex items-center space-x-2">
              <svg
                role="img"
                className="df-icon df-icon--tshirt w-6 h-6 text-yellow-400"
              >
                <use xlinkHref="/assets/images/hockey/icons-hockey.svg#tshirt" />
              </svg>
              <h6 className="info-block__heading text-xs font-bold uppercase">
                Join Our Team!
              </h6>
              <a
                className="info-block__link text-xs text-yellow-400 hover:underline"
                href="mailto:info@kcvv.be"
              >
                info@kcvv.be
              </a>
            </li>
            <li className="info-block__item info-block__item--contact-secondary flex items-center space-x-2">
              <svg
                role="img"
                className="df-icon df-icon--puck w-6 h-6 text-gray-400"
              >
                <use xlinkHref="/assets/images/hockey/icons-hockey.svg#puck" />
              </svg>
              <h6 className="info-block__heading text-xs font-bold uppercase">
                Contact Us
              </h6>
              <a
                className="info-block__link text-xs text-gray-400 hover:underline"
                href="mailto:contact@kcvv.be"
              >
                contact@kcvv.be
              </a>
            </li>
          </ul>
          {/* Info Block / End */}
        </div>
      </div>
      {/* Header Secondary / End */}

      {/* Header Primary */}
      <div className="bg-white relative">
        <div className="container mx-auto">
          <div className="items-center">
            {/* Header Logo */}
            <div className="header-logo absolute left-0 bottom-2 z-50 hidden md:block">
              <a href="#">
                <img
                  src="/assets/images/hockey/logo.png"
                  srcSet="/assets/images/hockey/logo@2x.png 2x"
                  alt="Alchemists"
                  className="header-logo__img w-40 h-auto"
                />
              </a>
            </div>
            {/* Header Logo / End */}

            {/* Main Navigation */}
            <nav className="main-nav flex-1 flex items-center">
              <ul className="main-nav__list flex space-x-6">
                <li>
                  <a href="/">Home</a>
                  <ul className="main-nav__sub">
                    <li>
                      <a href="/">Home - version 1</a>
                    </li>
                    <li>
                      <a href="/home-v2">Home - version 2</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Features</a>
                  <div className="main-nav__megamenu clearfix">
                    <ul className="col-lg-4 col-md-3 col-12 main-nav__ul main-nav__ul-2cols">
                      <li className="main-nav__title">Features</li>
                      <li>
                        <a href="/">Homepage v1</a>
                      </li>
                      <li>
                        <a href="/shortcodes">Shortcodes</a>
                      </li>
                      <li>
                        <a href="/home-v2">Homepage v2</a>
                      </li>
                      <li>
                        <a href="/typography">Typography</a>
                      </li>
                      <li>
                        <a href="/news-v1">News Page v1</a>
                      </li>
                      <li>
                        <a href="/scores-calendar">Scores Calendar</a>
                      </li>
                      <li>
                        <a href="/news-v2">News Page v2</a>
                      </li>
                      <li>
                        <a href="/buy-tickets">Buy Tickets</a>
                      </li>
                      <li>
                        <a href="/news-v3">News Page v3</a>
                      </li>
                      <li>
                        <a href="/video-player">Video Player</a>
                      </li>
                      <li>
                        <a href="/staff-member">Staff Member</a>
                      </li>
                      <li>
                        <a href="/event-page">Event Page</a>
                      </li>
                      <li>
                        <a href="/sponsors">Sponsors</a>
                      </li>
                      <li>
                        <a href="/contact">Contact Page</a>
                      </li>
                      <li>
                        <a href="/faqs">FAQs</a>
                      </li>
                      <li>
                        <a href="/search-results">Search Results</a>
                      </li>
                    </ul>
                    <ul className="col-lg-2 col-md-3 col-12 main-nav__ul">
                      <li className="main-nav__title">Team Pages</li>
                      <li>
                        <a href="/team-overview">Team Overview</a>
                      </li>
                      <li>
                        <a href="/team-roster-1">Roster 1</a>
                      </li>
                      <li>
                        <a href="/team-roster-2">Roster 2</a>
                      </li>
                      <li>
                        <a href="/team-standings">Standings</a>
                      </li>
                      <li>
                        <a href="/team-last-results">Last Results</a>
                      </li>
                      <li>
                        <a href="/team-schedule">Schedule</a>
                      </li>
                      <li>
                        <a href="/team-gallery">Gallery</a>
                      </li>
                    </ul>
                    <ul className="col-lg-2 col-md-3 col-12 main-nav__ul">
                      <li className="main-nav__title">Player Pages</li>
                      <li>
                        <a href="/player-overview">Player Overview</a>
                      </li>
                      <li>
                        <a href="/player-stats">Player Stats</a>
                      </li>
                      <li>
                        <a href="/player-bio">Player Bio</a>
                      </li>
                      <li>
                        <a href="/player-news">Player News</a>
                      </li>
                      <li>
                        <a href="/player-gallery">Player Gallery</a>
                      </li>
                    </ul>
                    <ul className="col-lg-2 col-md-3 col-12 main-nav__ul">
                      <li className="main-nav__title">Match Pages</li>
                      <li>
                        <a href="/event-overview">Event Overview</a>
                      </li>
                      <li>
                        <a href="/event-tournament">Tournament</a>
                      </li>
                      <li>
                        <a href="/game-overview">Game Overview</a>
                      </li>
                    </ul>
                    <ul className="col-lg-2 col-md-3 col-12 main-nav__ul">
                      <li className="main-nav__title">Shop</li>
                      <li>
                        <a href="/shop">Main Shop</a>
                      </li>
                      <li>
                        <a href="/shop-sidebar-grid">Shop + Sidebar Grid</a>
                      </li>
                      <li>
                        <a href="/shop-sidebar-list">Shop + Sidebar List</a>
                      </li>
                      <li>
                        <a href="/shop-product">Product Page</a>
                      </li>
                      <li>
                        <a href="/shop-cart">Shopping Cart</a>
                      </li>
                      <li>
                        <a href="/shop-checkout">Checkout</a>
                      </li>
                      <li>
                        <a href="/shop-wishlist">Wishlist</a>
                      </li>
                      <li>
                        <a href="/shop-account">Your Account</a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <a href="/team-overview">Team</a>
                  <ul className="main-nav__sub">
                    <li>
                      <a href="/team-overview">Team</a>
                      <ul className="main-nav__sub-2">
                        <li>
                          <a href="/team-gallery">Gallery</a>
                          <ul className="main-nav__sub-2">
                            <li>
                              <a href="/team-gallery-album">Single Album</a>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href="/team-roster-1">Roster 1</a>
                        </li>
                        <li>
                          <a href="/team-roster-2">Roster 2</a>
                        </li>
                        <li>
                          <a href="/team-standings">Standings</a>
                        </li>
                        <li>
                          <a href="/team-last-results">Last Results</a>
                        </li>
                        <li>
                          <a href="/team-schedule">Schedule</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="/player-overview">Player</a>
                      <ul className="main-nav__sub-2">
                        <li>
                          <a href="/player-stats">Player Stats</a>
                        </li>
                        <li>
                          <a href="/player-bio">Player Bio</a>
                        </li>
                        <li>
                          <a href="/player-news">Player News</a>
                        </li>
                        <li>
                          <a href="/player-gallery">Player Gallery</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="/staff-member">Staff Member</a>
                    </li>
                    <li>
                      <a href="/event-overview">Event</a>
                      <ul className="main-nav__sub-2">
                        <li>
                          <a href="/event-tournament">Tournament</a>
                        </li>
                        <li>
                          <a href="/game-overview">Game Overview</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="/game-overview">Game Overview</a>
                    </li>
                    <li>
                      <a href="/event-tournament">Tournament</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">News</a>
                  <ul className="main-nav__sub">
                    <li>
                      <a href="/news-v1">News - version 1</a>
                    </li>
                    <li>
                      <a href="/news-v2">News - version 2</a>
                    </li>
                    <li>
                      <a href="/news-v3">News - version 3</a>
                    </li>
                    <li>
                      <a href="#">Post</a>
                      <ul className="main-nav__sub-2">
                        <li>
                          <a href="/blog-post-1">Single Post - version 1</a>
                        </li>
                        <li>
                          <a href="/blog-post-2">Single Post - version 2</a>
                        </li>
                        <li>
                          <a href="/blog-post-3">Single Post - version 3</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="/forum-main">Forum</a>
                  <ul className="main-nav__sub">
                    <li>
                      <a href="/forum-main">Forum - Main</a>
                    </li>
                    <li>
                      <a href="/forum-topics">Forum - Topics</a>
                    </li>
                    <li>
                      <a href="/forum-topic">Forum - Topic</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="/shop-grid-fullwidth">Shop</a>
                  <ul className="main-nav__sub">
                    <li>
                      <a href="/shop-grid-sidebar">Shop - Grid + Sidebar</a>
                    </li>
                    <li>
                      <a href="/shop-grid-fullwidth">Shop - Grid Fullwidth</a>
                    </li>
                    <li>
                      <a href="/shop-list-sidebar">Shop - List + Sidebar</a>
                    </li>
                    <li>
                      <a href="/shop-product">Single Product</a>
                    </li>
                    <li>
                      <a href="/shop-cart">Shopping Cart</a>
                    </li>
                    <li>
                      <a href="/shop-checkout">Checkout</a>
                    </li>
                    <li>
                      <a href="/shop-wishlist">Wishlist</a>
                    </li>
                    <li>
                      <a href="/shop-login">Login</a>
                    </li>
                    <li>
                      <a href="/shop-account">Account</a>
                    </li>
                  </ul>
                </li>
              </ul>

              {/* Search Toggle */}
              <a
                href="#"
                className="search__toggle search__toggle--skewed ml-4"
              >
                H
              </a>
              {/* Search Toggle / End */}
            </nav>
            {/* Main Navigation / End */}
          </div>
        </div>
      </div>
      {/* Header Primary / End */}
    </header>
  );
};
