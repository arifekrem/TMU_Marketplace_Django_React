// Importint the necessary modules and the logo image
import React, { useState } from 'react';
import logo from '../images/logo.jpg';

/**
 * Renders the Forgot Password page.
 * Allows users to request a password reset by entering their email address.
 */
function ForgotPasswordPage() {
  const [email, setemail] = useState('');

  /**
   * Handles the password reset request.
   * @param {Event} event - The form submit event.
   */
  const handleResetRequest = (event) => {
    event.preventDefault();
    // Handle the password reset logic here
    console.log('Requesting password reset for:', email);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleResetRequest}>
          <div className="mb-6">
            <div className="flex justify-center mb-6">
                <img src={logo} alt="Logo" className="w-auto h-20" />
            </div>
            
            <h1 className="text-lg font-bold text-gray-700 text-center mb-4">
              Password assistance
            </h1>
            <p className="text-sm text-gray-600 text-center mb-4">
              Enter the email address associated with your account.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              E-mail address
            </label>
 s            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Send Request
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

export default ForgotPasswordPage;
