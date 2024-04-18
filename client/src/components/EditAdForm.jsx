import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import useAdDetails from "./useAdDetails";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Modal from "./Modal";
import OpenAI from "openai";

/**
 * Component for editing an ad.
 * @returns JSX element
 */
function EditAdForm() {
  const navigate = useNavigate(); // Hook for navigation

  // Get ad from URL
  const { ad } = useAdDetails();

  // Set form values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { userData } = useContext(AuthContext);
  const { apiToken } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
  });

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Initialize default form values from "ad".
  useEffect(() => {
    setTitle(ad.title);
  }, [ad.title]);
  useEffect(() => {
    setDescription(ad.description);
  }, [ad.description]);
  useEffect(() => {
    setPrice(ad.price);
  }, [ad.price]);
  useEffect(() => {
    const typeMapping = {
      "Items Wanted": "IW",
      "Items for Sale": "IS",
      "Academic Services": "AS",
    };
    setType(typeMapping[ad.type]);
  }, [ad.type]);
  useEffect(() => {
    const categoryMapping = {
      Electronics: "EL",
      Clothing: "CL",
      Garden: "GA",
      "Sports & Outdoors": "SP",
      "Games & Hobbies": "GH",
      "Music & Instruments": "MU",
      "Furniture & Appliances": "FA",
      "Beauty & Personal Care": "BE",
      Textbooks: "TB",
      "Lost & Found": "LO",
      "Study Groups": "SG",
      Tutoring: "TU",
      "Research & Surveys": "RS",
      Others: "OT",
    };
    setCategory(categoryMapping[ad.category]);
  }, [ad.category]);
  useEffect(() => {
    const locationMapping = {
      "Toronto & East York": "TE",
      Etobicoke: "EB",
      "North York": "NY",
      Scarborough: "SC",
      Vaughan: "VA",
      Markham: "MK",
      "Richmond Hill": "RH",
      Mississauga: "MV",
      Brampton: "BR",
      "Ajax & Pickering": "AP",
      "Whitby & Oshawa": "OS",
      "Oakville & Milton": "OK",
      "Other Locations": "OT",
    };
    setLocation(locationMapping[ad.location]);
  }, [ad.location]);

  useEffect(() => {
    if (ad.images) {
      const initialImages = ad.images.map((image) => ({
        ...image,
        existing: true, // Mark as existing image
      }));
      // Ensure we're not adding images that are already in state
      const nonDuplicateImages = initialImages.filter(
        (newImage) =>
          !existingImages.some(
            (existingImage) => existingImage.id === newImage.id
          )
      );
      setExistingImages([...existingImages, ...nonDuplicateImages]);
      // Update image previews in a similar manner to avoid duplication
      setImagePreviews((prevPreviews) => {
        const newPreviews = nonDuplicateImages.filter(
          (newImage) =>
            !prevPreviews.some((preview) => preview.id === newImage.id)
        );
        return [...prevPreviews, ...newPreviews];
      });
    }
  }, [ad.images]);

  /**
   * Handle form submission.
   * @param {Event} event - The form submit event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const config = {
      headers: {
        Authorization: "Token " + apiToken,
        "Content-Type": "multipart/form-data",
      },
    };

    const form = new FormData();

    // Append IDs of images to keep
    existingImages.forEach((image) => {
      form.append("images_to_keep", image.id);
    });

    images.forEach((image) => {
      form.append("images", image);
    });

    form.append("pk", ad.id);
    form.append("title", title);
    form.append("description", description);
    form.append("price", price);
    form.append("type", type);
    form.append("category", category);
    form.append("location", location);
    for (let [key, value] of form.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      const response = await axios.put("/api/ads/edit/", form, config);
      console.log(response.data);
      setIsModalOpen(true);
      setModalContent({
        title: "Success!",
        message: "Ad details have been successfully changed!",
      });
    } catch (error) {
      console.error("Error:", error);
      setIsModalOpen(true);
      setModalContent({
        title: "Error!",
        message: "An error occurred while editing your ad. Please try again",
      });
    }
    setTimeout(() => {
      navigate("/profile");
    }, 3000);
  };

  // Close the modal.
  const closeModal = () => {
    setIsModalOpen(false);
  };

  /**
   * Handle image change.
   * @param {Event} e - The image change event.
   */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(images.concat(files));
    const mappedPreviews = files.map((image) => ({
      name: image.name,
      image_url: URL.createObjectURL(image),
      existing: false, // Mark as new image
    }));
    setImagePreviews(imagePreviews.concat(mappedPreviews));
  };

  /**
   * Remove an image.
   * @param {string} image_url - The URL of the image.
   * @param {boolean} isExisting - Indicates if the image is an existing image.
   */
  const removeImage = (image_url, isExisting) => {
    if (isExisting) {
      setExistingImages(
        existingImages.filter((image) => image.image_url !== image_url)
      );
    } else {
      setImages(images.filter((image) => image.image_url !== image_url));
    }
    setImagePreviews(
      imagePreviews.filter((image) => image.image_url !== image_url)
    );
  };

  /**
   * Handle ad deletion.
   * @param {Event} event - The delete button click event.
   */
  const handleDelete = async (event) => {
    const form = new FormData();
    form.append("pk", ad.id);
    form.append("status", "DE");
    const config = {
      headers: {
        Authorization: "Token " + apiToken,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post("/api/ads/delete/", form, config);
      console.log(response?.data);
      setIsModalOpen(true);
      setModalContent({
        title: "Success!",
        message: "Ad have been successfully deleted!",
      });
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fetch description using OpenAI API.
  const fetchDescription = async () => {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a bot that writes description for for items or services listed on an online marketplace. The user will give you the listing title and you will reply back with realistic listing description under 50 words that is written from the user perspective.",
          },
          { role: "user", content: title },
        ],
        model: "gpt-3.5-turbo",
      });
      console.log(completion.choices[0]);
      setDescription(completion.choices[0].message.content);
    } catch (error) {
      console.error("There was an error fetching the description:", error);
    }
  };

  // Conditional render based on if the selected ad is owned by the current logged in user
  const owner = userData.username == ad.owned_by;
  if (!owner) {
    // If the owners are not the same, return this page
    return (
      <div className="min-h-screen p-6  bg-gray-50 flex items-center justify-center lg:pb-0 pb-24">
        <div>
          <h2 className="font-semibold text-2xl text-custom-blue pb-3">
            401 - Not Authorized.
          </h2>
        </div>
      </div>
    );
  } else {
    // Else return regular edit page
    return (
      <div className="min-h-screen p-6  bg-gray-50 flex items-center justify-center lg:pb-0 pb-24">
        <div className="container max-w-screen-lg mx-auto">
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={modalContent.title}
            message={modalContent.message}
          />
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-2xl text-custom-blue pb-3">
              Edit Ad
            </h2>
            <div className="px-4 py-4 justify-end">
              <Link
                to="/profile"
                className="flex items-center text-black-600 hover:text-indigo-500"
              >
                <div className="rounded-full bg-gray-200 p-1">
                  <XMarkIcon className="h-5 w-5 " />
                </div>
              </Link>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <p className="font-medium text-lg">Ad Details</p>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-5 relative">
                      <label htmlFor="description">Description </label>
                      <textarea
                        id="description"
                        rows="7"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500   "
                        placeholder="Your description here"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <button
                        type="button"
                        className="bg-emerald-400  hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-2xl cursor-pointer absolute bottom-5 right-5 mt-2 mr-2 flex items-center"
                        onClick={fetchDescription}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 mr-1"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                          />
                        </svg>
                        Write with AI
                      </button>
                    </div>

                    <div className="md:col-span-3">
                      <label htmlFor="price">Price</label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="$99"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label htmlFor="type">Ad Type</label>
                      <select
                        id="type"
                        className="h-10 border mt-1 rounded px-2 w-full bg-gray-50"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="" disabled>
                          Select Ad Type
                        </option>
                        <option value="IW">Items Wanted</option>
                        <option value="IS">Items for Sale</option>
                        <option value="AS">Academic Services</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label htmlFor="category">Category</label>
                      <select
                        id="category"
                        className="h-10 border mt-1 rounded px-2 w-full bg-gray-50"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        <optgroup label="Items">
                          <option value="EL">Electronics</option>
                          <option value="CL">Clothing</option>
                          <option value="GA">Garden</option>
                          <option value="SP">Sports & Outdoors</option>
                          <option value="GH">Games & Hobbies</option>
                          <option value="MU">Music & Instruments</option>
                          <option value="FA">Furniture & Appliances</option>
                          <option value="BE">Beauty & Personal Care</option>
                          <option value="TB">Textbooks</option>
                          <option value="LO">Lost & Found</option>
                        </optgroup>
                        <optgroup label="Services">
                          <option value="SG">Study Groups</option>
                          <option value="TU">Tutoring</option>
                          <option value="RS">Research & Surveys</option>
                        </optgroup>
                        <optgroup label="Other">
                          <option value="OT">Others</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label htmlFor="location">Location</label>
                      <select
                        id="location"
                        className="h-10 border mt-1 rounded px-2 w-full bg-gray-50"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option value="" disabled>
                          Select Location
                        </option>

                        <option value="TE">Toronto & East York</option>
                        <option value="EB">Etobicoke</option>
                        <option value="NY">North York</option>
                        <option value="SC">Scarborough</option>
                        <option value="VA">Vaughan</option>
                        <option value="MK">Markham</option>
                        <option value="RH">Richmond Hill</option>
                        <option value="MV">Mississauga</option>
                        <option value="BR">Brampton</option>
                        <option value="AP">Ajax & Pickering</option>
                        <option value="OS">Whitby & Oshawa</option>
                        <option value="OK">Oakville & Milton</option>
                        <option value="OT">Other Locations</option>
                      </select>
                    </div>

                    <div className=" md:col-span-5 justify-center">
                      <label
                        htmlFor="upload"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Upload Photos
                      </label>
                      {/* Thumbnails of uploaded images */}
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-2">
                        {imagePreviews.map((image, index) => (
                          <div
                            key={index}
                            className="relative"
                            style={{ width: "100px", height: "100px" }}
                          >
                            <img
                              src={image.image_url}
                              alt={image.name}
                              className="w-full h-auto border rounded"
                              style={{ width: "100px", height: "100px" }}
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 m-1"
                              onClick={() =>
                                removeImage(image.image_url, image.existing)
                              }
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 "
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 ">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG
                          </p>
                        </div>
                      </label>
                      <input
                        id="dropzone-file"
                        type="file"
                        multiple // Allow multiple file selections
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>

                    <div className="md:col-span-3 pt-4">
                      <input
                        type="submit"
                        value="Save"
                        className="bg-custom-blue hover:bg-custom-yellow text-white font-bold py-2 px-4 rounded cursor-pointer"
                      />
                    </div>
                    <div className="md:col-span-2 text-right pt-4">
                      <button
                        className=" bg-red-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        type="button"
                        onClick={() => handleDelete()}
                      >
                        Delete Ad
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default EditAdForm;
