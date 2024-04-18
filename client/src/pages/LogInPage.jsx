// Importing Libraries, Frameworks and React Components
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "components/AuthProvider";
import axios from 'axios';
import Logo from "../assets/LogoBigNoBg.svg";

/**
 * Login page component.
 * Allows users to log in with their username and password.
 */
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(false); // State to track if the view is mobile
  const { login, getToken } = useContext(AuthContext);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    /**
     * Event handler for window resize event.
     * Updates the isMobile state based on the window width.
     */
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Adjust this value based on your mobile breakpoint
    };

    // Call handleResize on component mount to set initial state
    handleResize();

    // Add event listener for resize to adjust isMobile state as necessary
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Handles the login form submission.
   * Attempts to log in with the provided username and password.
   * If successful, navigates to the home page.
   * If unsuccessful, displays an error message.
   * @param {Event} event - The form submission event.
   */
  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      setPasswordError('');
      setUsernameError('');
      // After the login attempt, get the token to verify if login was successful.
      // This assumes `getToken` is a function that retrieves the stored token,
      // and it will return `undefined` or `null` if no token is stored.
      await login(username, password);
      const apiToken = getToken();
  
      // Only navigate to "/" if `apiToken` is successfully retrieved, 
      // indicating the login was successful.
      console.log('Before apiToken');
      if (apiToken) {
        navigateToHome();
      }
    } catch (error) {
      if (error.response) {
        // If a response was received with a status code
        if (error.response.status === 404) {
          // Handle 404 Not Found error - wrong password
          setPasswordError('Incorrect password. Please try again.');
        } else if (error.response.status === 401) {
          // Handle 401 Unauthorized error - wrong username
          setUsernameError('An account with that username does not exist.');
        } else {
          // Handle other status codes
          setPasswordError('Login failed: An unexpected error occurred. Please try again.');
        }
      } else {
        // No response was received
        setPasswordError('Login failed: The server is not responding. Please try again later.');
      }
    }
  };

  const navigateToHome = () => { // Navigates to the home page.
    navigate('/');
  };

  const navigateToSignUp = () => { // Navigates to the sign up page.
    navigate("/signup");
  };

  return (
    <>
      {/* Mobile-specific layout and components */}
      <div className={`flex items-center justify-center h-screen bg-gray-100 ${isMobile ? 'px-4 lg:px-20' : ''}`}>

        <div className="w-full max-w-md">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleLogin}
          >
            {/* Logo */}
            <div className="flex justify-center">
              <a href="/">
                {isMobile ? (
                  <img src={Logo} alt="Logo" className="w-auto h-32" />
                ) : (
                  <img src={Logo} alt="Logo" className="w-auto h-36" />
                )}
              </a>
            </div>

            {/* Form fields */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && <div className="text-red-500">{usernameError}</div>}

            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <div className="text-red-500">{passwordError}</div>}
            </div>
            <div className="flex flex-col items-center justify-between space-y-4">
              <button
                className="w-full bg-custom-blue text-white hover:bg-custom-yellow hover:text-custom-blue font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
              <a
                className="font-bold text-sm text-custom-blue hover:text-blue-800"
                href="/forgotPassword"
              >
                Forgot Password?
              </a>
              <button
                className="w-full bg-custom-yellow hover:bg-gray-400 text-custom-blue font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={navigateToSignUp}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>

    </>
  );
}

export default LoginPage;
