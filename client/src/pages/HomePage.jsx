// Importing Libraries, Frameworks and React Components
import React, { useEffect } from "react";
import { useState, useContext } from "react";
import AdsList from "components/AdsList";
import Header from "components/Header";
import Sidebar from "components/Sidebar";
import Filters from "components/Filters";
import HeaderLoggedIn from "components/HeaderLoggedIn";
import { AuthContext } from "components/AuthProvider";

/**
 * Represents the home page of the application.
 * @param {Object} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
function HomePage({}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { userData } = useContext(AuthContext);

  /**
   * Handles the search form submission.
   * @param {string} query - The search query.
   */
  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    //console.log('query: ',query);
  };

  const loggedIn = false;
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 sm:ml-28">
        {userData ? (
          <HeaderLoggedIn onSearchSubmit={handleSearchSubmit} />
        ) : (
          <Header onSearchSubmit={handleSearchSubmit} />
        )}
        <Filters />
        <AdsList searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export default HomePage;
