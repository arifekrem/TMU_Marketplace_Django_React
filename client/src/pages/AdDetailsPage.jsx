/**
 * Renders the Ad Details page.
 * @returns {JSX.Element} The rendered Ad Details page.
 */

// Import necessary components and hooks
import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DetailedAd from "../components/DetailedAd";

function AdDetailsPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-y-auto lg:ml-28">
        <DetailedAd> </DetailedAd>
      </div>
    </div>
  );
}

export default AdDetailsPage;
