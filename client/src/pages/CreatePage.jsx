/**
 * Represents the page for creating an ad and posting it.
 * @param {Function} onAdSubmit - The function to be called when the ad is submitted.
 * @returns {JSX.Element} The JSX element representing the CreatePage component.
 */

// Importing necessary components
import React from "react";
import Sidebar from "components/Sidebar";
import Header from "components/Header";
import CreateAdForm from "components/CreateAdForm";

function CreatePage({ onAdSubmit }) {
  return (
    <div className="flex ">
      <Sidebar />

      <div className="flex-1 overflow-y-auto lg:ml-20 ml-0">
        <CreateAdForm />
      </div>
    </div>
  );
}

export default CreatePage;
