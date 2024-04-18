import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import Link

import StudyGroups from "../assets/study_groups.svg";
import Textbooks from "../assets/textbooks.svg";
import Tutoring from "../assets/tutoring.svg";
import LostAndFound from "../assets/lost_and_found.svg";
import Research from "../assets/research.svg";
import Others from "../assets/other.svg";
import Beauty from "../assets/beauty.svg";
import Clothing from "../assets/clothes.svg";
import Electronics from "../assets/electronics.svg";
import Gaming from "../assets/gaming.svg";
import Garden from "../assets/garden.svg";
import Home from "../assets/home.svg";
import Music from "../assets/music.svg";
import Sports from "../assets/sports.svg";

/**
 * Array of callouts representing different categories.
 * Each callout contains the name, image source, image alt text, and short code of the category.
 * @type {Array}
 */
const callouts = [
  {
    name: "Beauty & Personal Care",
    imageSrc: Beauty, // Direct assignment of the imported image variable
    imageAlt: "Beauty & Personal Care",
    short: "BE",
  },
  {
    name: "Clothing",
    imageSrc: Clothing,
    imageAlt: "Clothing",
    short: "CL",
  },
  {
    name: "Electronics",
    imageSrc: Electronics,
    imageAlt: "Electronics",
    short: "EL",
  },
  {
    name: "Games & Hobbies",
    imageSrc: Gaming,
    imageAlt: "Games & Hobbies",
    short: "GH",
  },
  {
    name: "Garden",
    imageSrc: Garden,
    imageAlt: "Garden",
    short: "GA",
  },
  {
    name: "Furniture & Appliances",
    imageSrc: Home,
    imageAlt: "Furniture & Appliances",
    short: "FA",
  },
  {
    name: "Lost and Found",
    imageSrc: LostAndFound,
    imageAlt: "Lost and Found",
    short: "LO",
  },
  {
    name: "Music & Instruments",
    imageSrc: Music,
    imageAlt: "Music Instruments and Gear",
    short: "MU",
  },
  {
    name: "Sports & Outdoors",
    imageSrc: Sports,
    imageAlt: "Sports Equipment",
    short: "SP",
  },
  {
    name: "Research & Surveys",
    imageSrc: Research,
    imageAlt: "Research & Surveys",
    short: "RS",
  },

  {
    name: "Study Groups",
    imageSrc: StudyGroups,
    imageAlt: "Study Groups",
    short: "SG",
  },
  {
    name: "Textbooks",
    imageSrc: Textbooks,
    imageAlt: "Academic Textbooks",
    short: "TB",
  },
  {
    name: "Tutoring",
    imageSrc: Tutoring,
    imageAlt: "Tutoring Services",
    short: "TU",
  },
  {
    name: "Others",
    imageSrc: Others,
    imageAlt: "Other Items",
    short: "OT",
  },
];

/**
 * Component representing the category grid.
 * Renders a grid of categories with their respective images and names.
 * @returns {JSX.Element} The rendered component.
 */
const CategoryGrid = () => {
  const navigate = useNavigate();

  /**
   * Handles the click event on a category.
   * Navigates to the category page based on the category's short code.
   * @param {string} categoryShortCode - The short code of the clicked category.
   */
  const handleCategoryClick = (categoryShortCode) => {
    navigate(`/category/${categoryShortCode}`); 
  };


  return (
    <div className="bg-white-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 lg:pb-0 lg:px-8 ">
        <div className="mx-auto max-w-2xl py-10 sm:py-24 lg:max-w-none lg:py-12 ">
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>


          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0 lg:grid-rows-2 lg:gap-y-6 sm:pb-30">
            {callouts.map((callout) => (
              <div key={callout.name} onClick={() => handleCategoryClick(callout.short)}>
                <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-w-1 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <img
                    src={callout.imageSrc}
                    alt={callout.imageAlt}
                    className="h-full w-full object-cover object-center"
                    onClick={() => handleCategoryClick(callout.short)}

                  />
                </div>
                <h2 className=" text-lg leading-6 font-medium">
                  <span className="inline-block bg-white text-black rounded-lg px-2 py-1">
                    {callout.name}
                  </span>
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export default CategoryGrid;
