import React, { useState, useEffect, useContext } from 'react';
import Logo from "../assets/LogoBigNoBg.svg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from 'components/AuthProvider';

function SignUp() {
  const {login} = useContext(AuthContext);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, matchPasswordError] = useState('');
  const [fNameError, setFirstNameError] = useState('');
  const [lNameError, setLastNameError] = useState('');
  const [isMobile, setIsMobile] = useState(false); // State to track if the view is mobile
  const [generalError, setGeneralError] = useState('');


  useEffect(() => {
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

  const validatePassword = (pwd) => {
    //validates password string to include specified chars and length
    const regex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()]).{8,}');
    if (!regex.test(pwd)) {
      setPasswordError("Password must be 8+ characters with a mix of uppercase, lowercase, numbers, and symbols.");
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };


  const validateEmail = (email) => {
    //validates password string to include correct email string formatting
    const regex = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
    if (!regex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const handleConfirmPassword = (e) => {
    //Ensure both passwords are the same
    if (confirmPassword === '') {
      matchPasswordError('Please confirm your password.');
    } else if (password !== confirmPassword) {
      matchPasswordError('Passwords do not match.');
      return false;
    } else {
      matchPasswordError('');
      return true;
    }
  }

  const handleSignUp = async (event) => {
    //handle passwords validation 
    handleConfirmPassword();
    validatePassword(password);
    //set email and password error
    setFirstNameError(first_name === '' ? 'Please enter your first name.' : '');
    setLastNameError(last_name === '' ? 'Please enter your last name.' : '');
    setEmailError(email === '' ? 'Please enter your email.' : !validateEmail(email) ? 'Email must be in the format something@mail.com.' : '');
    setPasswordError(password === '' ? 'Please enter your password.' : '');
    matchPasswordError(confirmPassword === '' ? 'Please confirm your password.' : '');

    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = handleConfirmPassword();

    event.preventDefault();

    //if passwords are valid, call signup api with user credentials
    if (isPasswordValid && isConfirmPasswordValid) {
      try {
        const response = await axios.post('/api/users/signup/',
          JSON.stringify({ username: username, email: email, password, first_name: first_name, last_name: last_name }),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );
        // Strip and Save token to local cache
        const token = response.data.Authorization.split(' ')[1];
        //call authcontext login function with credentials
        login(username, password);
        //navigate to home page
        navigateToHome();
      } catch (error) {
        console.error('Error:', error);
    
        // Check if the error response has data and detail property
        if (error.response && error.response.data && error.response.data.detail) {
          // Set the error based on the detail message from the server
          const detailMessage = error.response.data.detail;
          if (detailMessage.includes('Username already exists')) {
            // Handle username error
            setUsernameError('An account with this username already exists.');
          } else if (detailMessage.includes('Email already exists')) {
            // Handle email error
            setUsernameError('');
            setEmailError('An account with this email already exists.');
          } else {
            // Handle other kinds of errors
            setGeneralError('An error occurred while signing up.');
          }
        } else {
          // Fallback error message
          setGeneralError('An error occurred. Please try again.');
        }
      }
    }
  };

  let navigate = useNavigate();
  // Function to handle navigation to the home page
  const navigateToHome = () => {
    navigate('/');
  };
  
  return (
    <div className={`flex items-center justify-center h-screen bg-gray-100 ${isMobile ? 'px-4 lg:px-20' : ''}`}>

      <div className="w-full max-w-md">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-4 mt-4 mb-4"
          onSubmit={handleSignUp}
        >
          <div className="flex justify-center">
            <a href="/">

              {isMobile ? (
                <img src={Logo} alt="Logo" className="w-auto h-32 " />
              ) : (
                <img src={Logo} alt="Logo" className="w-auto h-36" />
              )}
            </a>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="first-name">
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="first-name"
              type="text"
              placeholder="First Name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {fNameError && <div className="text-red-500 text-sm">{fNameError}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="last-name">
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="last-name"
              type="text"
              placeholder="Last Name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
            {lNameError && <div className="text-red-500 text-sm">{lNameError}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <div className="text-red-500 text-sm">{usernameError}</div>}

          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className="text-red-500 text-sm">{emailError}</div>}

          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirm-password"
              type="password"
              placeholder="************"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordMatchError && <div className="text-red-500 text-sm">{passwordMatchError}</div>}
          </div>

          <div className="flex flex-col items-center justify-between space-y-4">
            <button className="w-full hover:bg-custom-blue hover:text-white bg-custom-yellow text-custom-blue font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Create Account
            </button>
          </div>
          <div className="text-center">
            <a className="font-bold text-sm text-custom-blue hover:text-blue-800" href="/login">
              Already have an account? Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;

