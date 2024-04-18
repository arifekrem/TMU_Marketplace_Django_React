import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

// Component for handling user logout
export default function Logout(){
  const navigate = useNavigate(); // Hook for navigation
  const { logout } = useContext(AuthContext); // Accessing logout function from AuthContext

  // Effect to perform logout when component mounts
  useEffect(() => {

    // Function to perform logout asynchronously
    const performLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Logout failed. Please try again later.');
      }
      navigate('/login'); // Redirecting user to login page after logout
    };
    
    performLogout(); 
  }, [logout, navigate]);

  // Displaying a message while logging out
  return <div>Logging out...</div>;
};