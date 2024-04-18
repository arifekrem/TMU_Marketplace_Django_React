// Importing necessary components and libraries
import React, { useContext, useState } from "react";
import Header from "components/Header";
import Sidebar from "components/Sidebar";
import CategoryGrid from "components/CategoryGrid";
import { AuthContext } from "components/AuthProvider";
import HeaderLoggedIn from "components/HeaderLoggedIn";

/**
 * Represents the CategoriesPage component.
 * This component displays the categories page with a sidebar, header, and category grid.
 */
function CategoriesPage() {
  const { userData } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Handles the search submit event.
   * @param {string} query - The search query.
   */
  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    //console.log('query: ',query);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 sm:ml-28">
        <div className="bg-white-100">
          <div className="lg:fixed lg:top-0 lg:left-32 lg:w-[90vw]  lg:z-50">
            {/* Renders the header component based on user authentication */}
            {userData ? (
              <HeaderLoggedIn onSearchSubmit={handleSearchSubmit} />
            ) : (
              <Header onSearchSubmit={handleSearchSubmit} />
            )}
            {/* Page content here */}
          </div>
          <div className="lg:p-20 lg:overflow-auto lg:flex-1">
            <CategoryGrid></CategoryGrid>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
