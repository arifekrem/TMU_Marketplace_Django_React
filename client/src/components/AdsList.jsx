import React, { useState, useEffect, useMemo } from "react";
import AdCard from "./AdCard";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

/**
 * Component to display a list of ads.
 * @param {Object} props - The component props.
 * @param {string} props.searchQuery - The search query for filtering ads.
 * @returns {JSX.Element} The AdsList component.
 */
function AdsList({ searchQuery }) {
  // State to store the ads
  const [ads, setAds] = useState([]);

  // State to store loading status
  const [isLoading, setIsLoading] = useState(true);

  // State to store any potential error from the fetch operation
  const [error, setError] = useState(null);

  const location = useLocation();

  /**
   * Get the query string from the current search parameters.
   * @returns {string} The query string.
   */
  const getQueryStringFromSearchParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.toString();
  };
  let categoryQuery = getQueryStringFromSearchParams();

  /**
   * Filter the ads based on the search query.
   * @type {Array} The filtered ads.
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
            : false) ||
          (ad.category
            ? ad.category.toLowerCase().includes(lowerSearchQuery)
            : false)
        );
      }),
    [ads, searchQuery]
  );

  useEffect(() => {
    // Function to fetch ads data
    const fetchAds = async () => {
      try {
        const queryString = getQueryStringFromSearchParams();
        console.log(`/api/ads/?${queryString}`);
        const response = await fetch(`/api/ads/?${queryString}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAds(data); // Set the ads data to state
        setIsLoading(false); // Set loading to false since the data is loaded
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchAds(); // Call the fetch function
  }, [location]); // Empty dependency array means this effect runs once on mount

  /**
   * Get the recently viewed ad IDs from local storage.
   * @returns {Array} The recently viewed ad IDs.
   */
  const getRecentlyViewedAdIds = () => {
    return JSON.parse(localStorage.getItem("recentlyViewedAdIds")) || [];
  };

  // Separate ads into recently viewed and others
  const { recentlyViewedAds, otherAds } = useMemo(() => {
    const recentlyViewedIds = getRecentlyViewedAdIds();
    const recentlyViewed = filteredAds.filter((ad) =>
      recentlyViewedIds.includes(ad.id)
    );
    const others = filteredAds.filter(
      (ad) => !recentlyViewedIds.includes(ad.id)
    );
    return { recentlyViewedAds: recentlyViewed, otherAds: others };
  }, [filteredAds]);

  /**
   * Get the recommended ads based on category visits.
   * @returns {Array} The recommended ads.
   */
  const getRecommendedAds = useMemo(() => {
    // Assuming categoryVisits is an object with categories as keys and visit counts as values
    const categoryVisits =
      JSON.parse(localStorage.getItem("categoryVisits")) || {};
    const totalVisits = Object.values(categoryVisits).reduce(
      (acc, curr) => acc + curr,
      0
    );

    // Calculate how many ads to select for each category based on its percentage of total visits
    const adsPerCategory = Object.keys(categoryVisits).reduce(
      (acc, category) => {
        const countForCategory = Math.round(
          (categoryVisits[category] / totalVisits) * 8
        ); // Calculate proportion out of 12
        acc[category] = countForCategory;
        return acc;
      },
      {}
    );

    let recommendedAds = [];

    // Iterate over each category and select the corresponding number of ads
    Object.keys(adsPerCategory).forEach((category) => {
      const adsForCategory = ads
        .filter((ad) => ad.category === category)
        .slice(0, adsPerCategory[category]);
      recommendedAds = [...recommendedAds, ...adsForCategory];
    });

    // If the total recommended ads are less than 12, fill the remaining slots with random ads from other categories
    // Note: This step ensures that there are always 12 recommended ads, even if the selected categories don't have enough listings
    if (recommendedAds.length < 8) {
      const additionalAdsNeeded = 8 - recommendedAds.length;
      const additionalAds = ads
        .filter((ad) => !recommendedAds.includes(ad))
        .slice(0, additionalAdsNeeded);
      recommendedAds = [...recommendedAds, ...additionalAds];
    }

    return recommendedAds.slice(0, 8); // Ensure that no more than 12 ads are recommended
  }, [ads]);

  // Conditional rendering based on the state
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="bg-white py-6 sm:py-6 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Recently Visited Section */}
          {!categoryQuery && searchQuery && recentlyViewedAds.length > 0 && (
            <div>
              <h2 className="font-semibold text-2xl mb-1 mt-5">
                Recently Visited
              </h2>
              <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 pt-1 sm:mt-3 sm:pt-3 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                {recentlyViewedAds.map((ad) => (
                  <Link to={`/ad/${ad.id}`} key={ad.id}>
                    <AdCard ad={ad} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recently Visited Section when we search */}
          {!searchQuery && recentlyViewedAds.length > 0 && (
            <div>
              <h2 className="font-semibold text-2xl mb-1 mt-5">
                Recently Visited
              </h2>
              <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 pt-1 sm:mt-3 sm:pt-3 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                {recentlyViewedAds.map((ad) => (
                  <Link to={`/ad/${ad.id}`} key={ad.id}>
                    <AdCard ad={ad} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Section */}
          {!categoryQuery && !searchQuery && (
            <>
              <h2 className="font-semibold text-2xl mb-1 mt-5">Recommended</h2>
              <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 pt-2 sm:mt-5 sm:pt-5 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                {getRecommendedAds.map((ad) => (
                  <Link to={`/ad/${ad.id}`} key={ad.id}>
                    <AdCard ad={ad} />
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Browse Section */}
          <div>
            <h2 className="font-semibold text-2xl mt-14">Browse</h2>
            <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 pt-2 sm:mt-3 sm:pt-3 lg:mx-0 lg:max-w-none lg:grid-cols-4">
              {otherAds.length > 0 ? (
                otherAds.map((ad) => (
                  <Link to={`/ad/${ad.id}`} key={ad.id}>
                    <AdCard ad={ad} />
                  </Link>
                ))
              ) : (
                <p>No ads found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdsList;
