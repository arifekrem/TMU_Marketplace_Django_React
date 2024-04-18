// Importing necessary components and libraries
import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "pages/HomePage";
import ProfilePage from "pages/ProfilePage";
import EditProfile from "pages/EditProfile";
import CategoriesPage from "pages/CategoriesPage";
import InboxPage from "pages/InboxPage";
import LogInPage from "pages/LogInPage";
import SignUp from "pages/SignUp";
import Filters from "components/Filters";
import Logout from "components/Logout";
import ForgotPasswordPage from "pages/ForgotPassword";
import AdDetailsPage from "pages/AdDetailsPage";
import CreatePage from "pages/CreatePage";
import EditPage from "pages/EditPage";
import { AuthProvider } from "components/AuthProvider";
import { PrivateRoute } from "components/PrivateRoute";
import GuestRoute from "components/GuestRoute";
import AdsList from "components/AdsList";
import Header from "./components/Header";
import Category from "components/Category";
import AcademicServices from "pages/AcademicServicesPage";
import BuyAndSell from "pages/BuyAndSellPage";
import ChangePassword from "pages/ChangePassword";
import ReportPage from "pages/ReportPage";

/**
 * The main App component.
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Handles the search form submission.
   * @param {string} query - The search query.
   */
  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    //console.log('query: ',query);
  };

  /**
   * Handles the ad submission.
   * @param {object} ad - The ad object.
   */
  const handleAdSubmit = (ad) => {
    setAds([...ads, ad]);
  };

  const [user, setUser] = React.useState({
    name: "",
    email: "",
    image: null,
  });

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="inbox/" element={<InboxPage />} />
        <Route path="inbox/:conversantId" element={<InboxPage />} />
        <Route path="filters" element={<Filters />} />

        <Route path="ad/:id" element={<AdDetailsPage />} />
        <Route
          path="ads"
          element={<AdsList ads={ads} searchQuery={searchQuery} />}
        />
        <Route path="category/:category" element={<Category />} />
        <Route path="academic-services" element={<AcademicServices />} />
        <Route path="buy-and-sell" element={<BuyAndSell />} />
        <Route path="report/:id" element={<ReportPage />} />

        {/* Private Routes */}
        <Route path="profile" element={<PrivateRoute />}>
          <Route index element={<ProfilePage />} />
        </Route>
        <Route path="edit-profile" element={<PrivateRoute />}>
          <Route index element={<EditProfile />} />
        </Route>
        <Route path="change-password" element={<PrivateRoute />}>
          <Route index element={<ChangePassword />} />
        </Route>
        <Route path="create" element={<PrivateRoute />}>
          <Route index element={<CreatePage />} />
        </Route>

        <Route path="edit/ad/:id" element={<PrivateRoute />}>
          <Route index element={<EditPage />} />
        </Route>

        <Route path="logout" element={<PrivateRoute />}>
          <Route index element={<Logout />} />
        </Route>

        {/* Guest Routes */}
        <Route path="login" element={<GuestRoute />}>
          <Route index element={<LogInPage />} />
        </Route>
        <Route path="signup" element={<GuestRoute />}>
          <Route index element={<SignUp />} />
        </Route>
        <Route path="forgotPassword" element={<GuestRoute />}>
          <Route index element={<ForgotPasswordPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
