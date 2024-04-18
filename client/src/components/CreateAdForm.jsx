import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Modal from "./Modal";
import OpenAI from "openai";

/**
 * Component for creating an ad form.
 * @returns {JSX.Element} CreateAdForm component.
 */
function CreateAdForm() {
  // Use useState to manage multiple images
  const navigate = useNavigate(); // Hook for navigation
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const { apiToken } = useContext(AuthContext); // Token context based on logged in user
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
  });

  // Create Openai instance
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  /**
   * Handles the form submission.
   * @param {Event} event - The form submit event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Form header configuration
    const config = {
      headers: {
        Authorization: "Token " + apiToken,
        "Content-Type": "multipart/form-data",
      },
    };

    const form = new FormData();
    images.forEach((image) => {
      form.append("images", image);
    });
    form.append("title", title);
    form.append("description", description);
    form.append("price", price);
    form.append("type", type);
    form.append("category", category);
    form.append("location", location);

    //Console log form for debugging
    for (let [key, value] of form.entries()) {
      console.log(`${key}: ${value}`);
    }

    try { // Call create ad api
      const response = await axios.post("/api/ads/create/", form, config);
      console.log(response.data);
      setIsModalOpen(true);
      setModalContent({
        title: "Success!",
        message: "Your ad has been successfully posted!",
      });
    } catch (error) {
      console.error("Error:", error);
      setIsModalOpen(true);
      setModalContent({
        title: "Error!",
        message: "An error occurred while posting your ad. Please try again",
      });
    }

    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  // Closes the modal.
  const closeModal = () => {
    setIsModalOpen(false);
  };

  /**
   * Handles the image change event.
   * @param {Event} e - The image change event.
   */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const mappedPreviews = files.map((image) => ({
      name: image.name,
      image_url: URL.createObjectURL(image),
      existing: false, // Mark as new image
    }));
    setImagePreviews(imagePreviews.concat(mappedPreviews));
  };

  /**
   * Removes an image from the image previews.
   * @param {string} image_url - The URL of the image to remove.
   * @param {boolean} isExisting - Indicates if the image is an existing image.
   */
  const removeImage = (image_url, isExisting) => {
    const imageToRemove = imagePreviews.find(
      (image) => image.image_url === image_url
    );
    if (!imageToRemove) return; // If no image found, simply return

    setImages(images.filter((image) => image.name !== imageToRemove.name));
    setImagePreviews(
      imagePreviews.filter((image) => image.image_url !== image_url)
    );
  };

  // Fetches the description using the OpenAI API.
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
            Create Ad
          </h2>
          <div className="px-4 py-4 justify-end">
            <Link
              to="/"
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
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
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
                          <span className="font-semibold">Click to upload</span>{" "}
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
                    <div className="mt-2">
                      {uploadedFiles.length > 0 && (
                        <div className="text-green-600">
                          {uploadedFiles.map((fileName, index) => (
                            <div key={index}>{fileName}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-5 pt-4">
                    <input
                      type="submit"
                      value="Post Your Ad"
                      className="bg-custom-blue hover:bg-custom-yellow text-white font-bold py-2 px-4 rounded cursor-pointer"
                    />
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

export default CreateAdForm;
