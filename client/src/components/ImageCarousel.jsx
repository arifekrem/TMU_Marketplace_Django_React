import React, { useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

/**
 * ImageCarousel component displays a carousel of images with navigation arrows and slide indicators.
 * @param {Object[]} images - An array of image objects.
 * @param {string} images[].image_url - The URL of the image.
 * @returns {JSX.Element} - The rendered ImageCarousel component.
 */
function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to navigate to the previous slide.
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  //  Function to navigate to the next slide.
  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  /**
   * Function to navigate to a specific slide.
   * @param {number} slideIndex - The index of the slide to navigate to.
   */
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="max-w-[1400px] h-[300px] lg:h-[500px] w-full m-auto px-4 relative group">
      <div
        style={{ backgroundImage: `url(${images[currentIndex].image_url})` }}
        className="w-full h-full rounded-2xl bg-center bg-cover duration-100"
      ></div>
      {/* Left Arrow */}
      <div className=" group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactLeft onClick={prevSlide} size={20} />
      </div>
      {/* Right Arrow */}
      <div className=" group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactRight onClick={nextSlide} size={20} />
      </div>
      <div className="flex top-4 justify-center py-2">
        {images.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className="text-2xl cursor-pointer"
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;
