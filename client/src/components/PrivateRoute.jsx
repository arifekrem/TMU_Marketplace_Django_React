import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

/**
 * A private route component that checks if the user is authenticated.
 * If the user is authenticated, it renders the child components.
 * If the user is not authenticated, it redirects to the login page.
 * @returns {JSX.Element} The private route component.
 */
export const PrivateRoute = () => {
    const { checkAuth } = useContext(AuthContext);
    
    return checkAuth() ? <Outlet /> : <Navigate to="/login" />;
}