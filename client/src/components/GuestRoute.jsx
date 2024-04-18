import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

/**
 * A component that renders a route for guests (unauthenticated users).
 * If the user is authenticated, it redirects to the home page ("/").
 * Otherwise, it renders the child components.
 * @returns {JSX.Element} The rendered component.
 */
export default function GuestRoute(){
    const { checkAuth } = useContext(AuthContext);
    
    return checkAuth() ?  <Navigate to="/" /> : <Outlet /> ;
}