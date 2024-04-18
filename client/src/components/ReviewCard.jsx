import React from "react";

/**
 * A component that represents a review card.
 * @component
 * @param {Object} props - The properties of the review card.
 * @param {string} props.name - The name of the reviewer.
 * @param {string} props.description - The description of the review.
 * @param {string} props.imageUrl - The URL of the reviewer's image.
 * @param {number} props.rating - The rating given by the reviewer.
 * @param {string} props.date - The date of the review.
 * @returns {JSX.Element} The rendered review card component.
 */
function ReviewCard({ name, description, imageUrl, rating, date }) {
  const stars = Array.from({ length: rating }, (_, index) => (
    // Renders a star icon for each rating.
    <svg
      key={index}
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-custom-yellow fill-current"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 0L12.245 6.40164H19.1615L13.7762 10.4262L16.0204 16.8279L10 12.9778L3.97959 16.8279L6.2238 10.4262L0.838481 6.40164H7.75497L10 0Z"
        clipRule="evenodd"
      />
    </svg>
  ));
  {/* Renders the review card component. */}
  return (
    <div className="flex flex-col lg:ml-14 lg:flex-row items-start lg:items-center justify-start gap-6 py-8 px-4 lg:px-0">
      <img
        src={imageUrl}
        alt={name}
        className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover"
      />
      <div className="flex flex-col lg:flex-row items-start  justify-start max-w-3xl">
        <div className="lg:ml-6">
          <div className="flex items-center mb-2">
            <h3 className="font-bold text-lg lg:text-xl">{name}</h3>
            <div className="flex items-center ml-2">{stars}</div>
          </div>
          <p className="text-gray-600">{description}</p>
          <p className="text-gray-400 text-sm mt-2">{date}</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
