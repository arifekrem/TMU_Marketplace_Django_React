/**
 * Represents the profile page of the user.
 * @component
 * @example
 * return (
 *   <ProfilePage />
 * )
 */

// Importing Libraries, Frameworks and React Components
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "components/Header";
import HeaderLoggedIn from "components/HeaderLoggedIn";
import Sidebar from "components/Sidebar";
import AdCard from "components/AdCard";
import { Link } from "react-router-dom";
import { AuthContext } from "components/AuthProvider";
import { StarIcon } from "@heroicons/react/20/solid";
import ReviewCard from "components/ReviewCard";

/**
 * Helper function to join multiple CSS classes.
 * @param  {...string} classes - The CSS classes to join.
 * @returns {string} - The joined CSS classes.
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * The profile page component.
 * @returns {JSX.Element} - The profile page JSX element.
 */
function ProfilePage() {
  const { userData } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Handles the search form submission.
   * @param {string} query - The search query.
   */
  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    //console.log('query: ',query);
  };

  const Mreviews = [ //Example reviews, replace with actual reviews from the database.
    {
      name: "John Doe",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl: "https://via.placeholder.com/150", // Example image URL, replace with your actual image URL
      rating: 5,
      date: "March 25, 2024",
    },
    {
      name: "Jane Smith",
      description:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      imageUrl: "https://via.placeholder.com/150", // Example image URL, replace with your actual image URL
      rating: 4,
      date: "April 1, 2024",
    },
  ];

  useEffect(() => { //Fetches the ads owned by the user.
    const fetchAds = async () => {
      try {
        const response = await axios.get("/api/ads/", {
          params: {
            owned_by: userData.username,
          },
        });
        setAds(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAds(); //Fetches the ads owned by the user.
  }, [userData]);

  const reviews = { href: "#", average: 4, totalCount: 117 }; //Example reviews, replace with actual reviews from the database.

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 sm:ml-28 lg:pb-0 pb-24">
        {userData ? (
          <>
            <HeaderLoggedIn onSearchSubmit={handleSearchSubmit} />
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg shadow ">
              <div className="flex justify-end px-4 pt-4">
                
                {/* Blue Edit Profile Button */}
                <Link
                  to="/edit-profile"
                  className="flex items-center font-semibold text-custom-blue  hover:text-gray-700 "
                >
                  <h2 className="text-md font-medium mr-2">Edit Profile</h2>
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
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </Link>
              </div>

              {/* Profile Container containing: Picture, Name, Username, Email */}
              <div className="flex items-center flex-col pb-10">
                <img
                  className="w-40 h-40 mb-3 rounded-full shadow-lg"
                  src={userData.profile_picture}
                  alt={userData.username}
                />

                <p className="text-md  font-semibold text-gray-700">
                  {userData.first_name} {userData.last_name}
                </p>

                <p className="text-md text-gray-700"> @{userData.username}</p>
                <p className="text-sm text-gray-500 ">{userData.email}</p>
              </div>
            </div>

            {/* Listings Container containing the ads created by the user logged in */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
              <h4 className="mt-4 mb-1 text-2xl font-semibold text-gray-900 ">
                Your Listings
              </h4>
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16   lg:mx-0 lg:max-w-none lg:grid-cols-4">
                {ads.map(
                  (ad) =>
                    ad.owned_by === userData.username && (
                      <Link to={`/ad/${ad.id}`}>
                        <div className="relative">
                          <AdCard key={ad.id} ad={ad} />

                          {/* Pencil Icon to edit the ad */}
                          <Link to={`/edit/ad/${ad.id}`}>
                            <div className="absolute top-4 right-4 transform translate-x-2/3 -translate-y-2/3">
                              <button className="bg-gray-200 border border-gray-400 rounded-full p-2 hover:bg-gray-200">
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
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                  />
                                </svg>
                              </button>
                            </div>
                          </Link>
                        </div>
                      </Link>
                    )
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <Header onSearchSubmit={handleSearchSubmit} />
            <div>Please Log in to see your profile.</div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
