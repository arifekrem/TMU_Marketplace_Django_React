import React, { useState, useEffect } from "react";
import LogoSmall from "../assets/LogoSmall.svg";

/**
 * Header component that displays the navigation bar.
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the header.
 * @param {Function} props.onSearchSubmit - The function to handle search submission.
 * @returns {JSX.Element} The rendered Header component.
 */
function Header({ title, onSearchSubmit }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    /**
     * Event handler for window resize event.
     * Updates the isMobile state based on the window width.
     */
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Adjust this value based on your mobile breakpoint
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Event handler for search form submission.
   * @param {Object} event - The form submission event.
   */
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const searchValue = event.target.elements.search.value;
    onSearchSubmit(searchValue);
  };

  // Toggles the menu open/close state.
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-white border-gray-300">
        <nav
          className="mx-auto flex items-center justify-between p-4"
          aria-label="Global"
        >
          {isMobile ? (
            // Mobile menu toggle button
            <>
              <div className="w-auto h-20">
                <a href="/">
                  <img
                    className="w-full h-full object-cover "
                    src={LogoSmall}
                    alt="Logo"
                  />
                </a>
              </div>

              <div className="flex-2">
                <form
                  className="pt-2 relative mx-auto text-gray-600 pr-2 pl-2"
                  onSubmit={handleSearchSubmit}
                >
                  <input
                    className="border-2 border-gray-300 bg-white h-10 px-3 pr-16 rounded-lg text-sm focus:outline-none"
                    type="search"
                    name="search"
                    placeholder="Search"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 mt-5 mr-4"
                  >
                    <svg
                      className="text-gray-600 h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      id="Capa_1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 56.966 56.966"
                      xmlSpace="preserve"
                    >
                      <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                    </svg>
                  </button>
                </form>
              </div>

              <button onClick={toggleMenu} className="lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </>
          ) : (
            // Non-mobile elements
            <>
              <div className="flex-grow">
                <form
                  className="pt-2 relative mx-auto text-gray-600 w-full"
                  onSubmit={handleSearchSubmit}
                >
                  <input
                    className="border-2 border-gray-300 bg-white h-10 px-5  rounded-lg text-sm focus:outline-none w-full"
                    type="search"
                    name="search"
                    placeholder="Search"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 mt-5 mr-4"
                  >
                    <svg
                      className="text-gray-600 h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      id="Capa_1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 56.966 56.966"
                      xmlSpace="preserve"
                    >
                      <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                    </svg>
                  </button>
                </form>
              </div>

              <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
                <button
                  type="button"
                  className="px-2 py-2 bg-custom-blue text-white rounded-md"
                  onClick={() => window.location.replace("/buy-and-sell")}
                >
                  Buy & Sell
                </button>
                <button
                  type="button"
                  className="px-2 py-2 bg-custom-blue text-white rounded-md"
                  onClick={() => window.location.replace("/academic-services")}
                >
                  Academic Services
                </button>
                <a
                  href="/login"
                  className="block px-2 py-2 text-sm text-custom-blue hover:bg-custom-blue hover:rounded-md hover:text-white"
                  role="menuitem"
                >
                  Log In
                </a>
                <p>or</p>
                <a
                  href="/signup"
                  className="block px-4 py-2 text-sm text-custom-blue hover:bg-custom-blue hover:rounded-md hover:text-white"
                  role="menuitem"
                >
                  Sign Up
                </a>
              </div>
            </>
          )}
          {isMenuOpen && isMobile && (
            // Mobile Menu
            <div className="absolute top-16 right-4 w-64 bg-white shadow-md rounded-lg py-2 z-50">
              {/* Mobile navigation items */}
              <a
                href="/signup"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </a>
              <a
                href="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </a>
              <a
                href="/buy-and-sell"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Buy & Sell
              </a>
              <a
                href="/academic-services"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Academic Services
              </a>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}

export default Header;
