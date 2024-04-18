/**
 * EditPage component represents the page for editing an advertisement.
 * @param {function} onAdSubmit - The function to be called when the ad is submitted.
 * @returns {JSX.Element} The JSX element representing the EditPage component.
 */

// Importing necessary components
import React from "react";
import Sidebar from "components/Sidebar";
import Header from "components/Header";
import EditAdForm from "components/EditAdForm";

function EditPage({ onAdSubmit }) {
  return (
    <div className="flex ">
      <div className="fixed left-0 top-0 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto lg:ml-28 ml-0">
        <EditAdForm />
      </div>
    </div>
  );
}

export default EditPage;
