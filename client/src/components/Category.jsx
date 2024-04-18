import React, { useState, useEffect, useContext } from "react";
import AdCard from "./AdCard";
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

import Header from "components/Header";
import Sidebar from "components/Sidebar";
import HeaderLoggedIn from "components/HeaderLoggedIn";
import { AuthContext } from "components/AuthProvider";

/**
 * Object that maps category codes to their corresponding names.
 * @type {Object<string, string>}
 */
const categories = {
  EL: "Electronics",
  CL: "Clothing",
  SP: "Sports & Outdoors",
  GH: "Games & Hobbies",
  MU: "Music & Instruments",
  FA: "Furniture & Appliances",
  BE: "Beauty & Personal Care",
  GA: "Garden",
  TB: "Textbooks",
  LO: "Lost & Found",
  SG: "Study Groups",
  TU: "Tutoring",
  RS: "Research & Surveys",
  OT: "Others",
};

/**
 * Component that displays ads for a specific category.
 * @returns {JSX.Element} The Category component.
 */
const Category = () => {
  // State to store the ads
  const { userData } = useContext(AuthContext);
  const { category } = useParams(); // This extracts the category from the URL

  const [ads, setAds] = useState([]);

  // State to store loading status
  const [isLoading, setIsLoading] = useState(true);

  // State to store any potential error from the fetch operation
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    /**
     * Fetches ads for the specified category.
     * @returns {Promise<void>}
     */
    const fetchAdsByCategory = async () => {
      setIsLoading(true);
      try {
        // Adjust the URL to include the category parameter for filtering
        const response = await fetch(`/api/ads/?category=${category}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAds(data); // Set the ads data to state
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false); // Set loading to false since the data is loaded or failed
      }
    };

    fetchAdsByCategory(); // Call the fetch function
  }, [category]); // Dependency array with category to refetch when category changes

  /**
   * Filters the ads based on the search query.
   * @type {Array<Object>}
   */
  const filteredAds = useMemo(
    () =>
      ads.filter((ad) => {
        const lowerSearchQuery = searchQuery ? searchQuery.toLowerCase() : "";
        return (
          (ad.title
            ? ad.title.toLowerCase().includes(lowerSearchQuery)
            : false) ||
          (ad.description
            ? ad.description.toLowerCase().includes(lowerSearchQuery)
            : false)
        );
      }),
    [ads, searchQuery]
  );

  const categoryName = categories[category] || "Category";

  /**
   * Handles the search submit event.
   * @param {string} query - The search query.
   */
  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 sm:ml-28 pb-24 lg:pb-0">
        {/* Display the appropriate header based on user authentication status */}
        {userData ? (
          <HeaderLoggedIn onSearchSubmit={handleSearchSubmit} />
        ) : (
          <Header onSearchSubmit={handleSearchSubmit} />
        )}
        <div className="bg-custom-blue pl-3 p-2 flex items-center">
          <Link to="/categories" className="text-white mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-xl text-white font-bold">{categoryName}</h1>
        </div>
        {/* Conditional rendering based on loading, error, and ads state */}
        <div
          className={`mx-auto mt-10 pt-2 ${
            isLoading || error || ads.length === 0
              ? "p-12"
              : "grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 p-8 sm:mt-5 sm:pt-5 lg:mx-0 lg:max-w-none lg:grid-cols-4"
          }`}
        >
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : ads.length > 0 ? (
            ads.map((ad) => (
              <Link key={ad.id} to={`/ad/${ad.id}`}>
                <AdCard ad={ad} />
              </Link>
            ))
          ) : (
            <div>No ads fit this category.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
