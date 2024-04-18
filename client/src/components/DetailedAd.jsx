import { useState, useEffect, useContext } from "react";
import {
  StarIcon,
  ArrowUturnLeftIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { FaMapMarkerAlt } from "react-icons/fa";
import ImageCarousel from "./ImageCarousel";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAdDetails from "./useAdDetails";
import { AuthContext } from "./AuthProvider";

const reviews = { href: "#", average: 4, totalCount: 117 };

// Define the classNames function
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Component for displaying detailed information about an ad.
 * @returns {JSX.Element} - The DetailedAd component.
 */
function DetailedAd() {
  const { ad } = useAdDetails();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const { apiToken, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Sends a message to the owner of the ad.
   * @returns {Promise<void>} - A promise that resolves when the message is sent.
   */
  const sendMessage = async () => {
    // Ensure ad details are available
    if (!ad) {
      console.error("Ad details are missing.");
      return;
    }

    // Ensure the user is logged in
    if (!apiToken) {
      console.error("API token is missing.");
      navigate("/login");
      return;
    }

    if (userData.id === ad.owned_by_id) {
      alert("You can't message to yourself");
      return;
    }

    try {
      const response = await fetch("/api/messages/send/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiToken}`, // Assuming the token is used as a Bearer token
        },
        body: JSON.stringify({
          sender: userData.id,
          receiver: ad.owned_by_id,
          text: `Interested in: ${ad.title} - ${ad.description}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Message sent successfully:", data);
      navigate(`/inbox/${ad.owned_by_id}`);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Effect for mobile responsiveness
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect for keeping track of recently visited listings
  useEffect(() => {
    if (ad.id) {
      updateRecentlyViewedAds(ad.id);
    }
    if (ad?.category) {
      const categoryVisits = JSON.parse(localStorage.getItem('categoryVisits')) || {};
      const currentCategoryCount = categoryVisits[ad.category] || 0;
      const updatedCategoryVisits = {
        ...categoryVisits,
        [ad.category]: currentCategoryCount + 1,
      };
      localStorage.setItem('categoryVisits', JSON.stringify(updatedCategoryVisits));
    }
  }, [ad]);

  /**
   * Updates the list of recently viewed ads.
   * @param {number} newAdId - The ID of the newly viewed ad.
   */
  const updateRecentlyViewedAds = (newAdId) => {
    const recentlyViewedAdIds =
      JSON.parse(localStorage.getItem("recentlyViewedAdIds")) || [];

    // Remove the ad ID if it already exists to prevent duplicates
    const filteredAdIds = recentlyViewedAdIds.filter(
      (adId) => adId !== newAdId
    );

    // Add the new ad ID to the front and trim the array to keep only the 4 most recent
    const updatedAdIds = [newAdId, ...filteredAdIds].slice(0, 4);

    localStorage.setItem("recentlyViewedAdIds", JSON.stringify(updatedAdIds));
  };

  /**
   * Formats a timestamp into a localized date string.
   * @param {number} timestamp - The timestamp to format.
   * @returns {string} - The formatted date string.
   */
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  return (
    <div className="bg-white">
      <div>
        <div className="px-4 py-4">
          {/* If using react-router */}
          <Link
            to="/"
            className="flex items-center text-black-600 hover:text-indigo-500"
          >
            <div className="rounded-full bg-gray-200 p-1">
              <XMarkIcon className="h-5 w-5 " />
            </div>
          </Link>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-28 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-20">
          {/* Options */}
          {isMobile && ad.images && ad.images.length > 0 && (
            <div>
              <ImageCarousel images={ad.images} />
            </div>
          )}
          <div className="mt-10 lg:row-span-3 lg:mt-0  lg:col-start-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
              {ad.title}
            </h1>
            <h2 className="sr-only">Product information</h2>
            <p className="text-lg tracking-tight text-gray-900">${ad.price}</p>
            <p className="mt-2 text-xs text-gray-500">
              Posted on {formatDate(ad.created_at)}
            </p>
            {/* Reviews */}
            <div className="mt-4">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <img
                  className=" mr-2 h-8 w-8 rounded-full"
                  src={
                    ad.owned_by_profile_picture
                      ? ad.owned_by_profile_picture
                      : `https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`
                  }
                  alt=""
                />
                <p className="text-base font-medium">{ad.owned_by}</p>
              </div>
            </div>

            <div>
              <h3 className=" sr-only">Description</h3>

              <div className="mt-6 space-y-6">
                <p className="text-base text-gray-900">{ad.description}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  <li key={ad.location} className="text-gray-400 ">
                    <span className="text-gray-600">{ad.location}</span>
                  </li>
                  <li key={ad.type} className="text-gray-400">
                    {" "}
                    <span className="text-gray-600">{ad.type}</span>
                  </li>
                  <li key={ad.category} className="text-gray-400">
                    {" "}
                    <span className="text-gray-600">{ad.category}</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={sendMessage}
              className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-custom-blue px-8 py-3 text-base font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Message
            </button>
            <div className="ml-24 flex items-center text-gray-500 mt-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              <p className="ml-2 text-xs text-gray-500">Concerns?</p>
              <Link
                to={`/report/${ad.id}`}
                className="flex items-center underline ml-1 text-xs text-gray-500 hover:text-indigo-500"
              >
                {" "}
                Report this ad!
              </Link>
            </div>
          </div>

          {!isMobile && ad.images && ad.images.length > 0 && (
            <div className="hidden lg:block lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8">
              <ImageCarousel images={ad.images} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailedAd;
