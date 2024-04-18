import React from "react";

/**
 * Modal component that displays a modal dialog box.
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Determines whether the modal is open or not.
 * @param {Function} props.onClose - Callback function to close the modal.
 * @param {string} props.title - The title of the modal.
 * @param {string} props.message - The message to be displayed in the modal.
 * @returns {JSX.Element|null} The Modal component.
 */
function Modal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  let modalClass = "bg-white rounded-lg shadow-lg";
  let headerClass = "bg-red-300";
  let icon = (
    <svg
      className="flex-shrink-0 w-6 h-6 me-2 text-red-600"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  if (title === "Success!") {
    modalClass = "bg-white border-green-300 rounded-lg shadow-lg";
    headerClass = "bg-green-200";
    icon = (
      <svg
        className="flex-shrink-0 w-6 h-6 me-2 text-green-600"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`relative flex flex-col w-full max-w-sm rounded-xl ${modalClass}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b border-solid ${headerClass} rounded-t`}
        >
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <span className="text-black h-6 w-6 text-2xl block">&times;</span>
          </button>
        </div>
        {/* Body */}
        <div className="relative p-6 flex-auto">
          <p className="my-4 text-md text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default Modal;
