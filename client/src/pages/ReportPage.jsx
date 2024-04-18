/**
 * Renders the ReportPage component.
 * @param {Function} onAdSubmit - Callback function to handle ad submission.
 * @returns {JSX.Element} The rendered ReportPage component.
 */

// Importing necessary components and functions
import React from "react";
import Sidebar from "components/Sidebar";
import Report from "components/Report";

function ReportPage({ onAdSubmit }) {
  return (
    <div className="flex ">
      {/* Renders the Sidebar component */}
      <div className="fixed left-0 top-0 h-full">
        <Sidebar />
      </div>
      {/* Renders the Report component */}
      <div className="flex-1 overflow-y-auto lg:ml-28 ml-0">
        <Report />
      </div>
    </div>
  );
}

export default ReportPage;