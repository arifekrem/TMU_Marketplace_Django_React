import React, { useState, useEffect } from "react";

/**
 * Renders the avatar component.
 * @param {string} avatarUrl - The URL of the avatar image.
 * @param {string} altText - The alt text for the avatar image.
 * @returns {JSX.Element} The Avatar component.
 */
function Avatar({ avatarUrl, altText }) {
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
      <img src={avatarUrl} alt={altText} className="w-8 h-8 rounded-full" />
    </div>
  );
}

/**
 * Formats the timestamp to display in the chat message.
 * @param {number} timestamp - The timestamp of the message.
 * @returns {string} The formatted timestamp.
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0"); // Get hours and pad with 0 if single digit
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Get minutes and pad with 0 if single digit
  return `${hours}:${minutes}`;
}

/**
 * Renders the chat message component.
 * @param {Object} message - The message object.
 * @param {boolean} isSender - Indicates if the message is sent by the current user.
 * @returns {JSX.Element} The ChatMessage component.
 */
function ChatMessage({ message, isSender }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check on mount
    handleResize();
    // Listen to window resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const messageClass = isSender
    ? "flex justify-end  mb-4 cursor-pointer lg:pr-0 pr-2"
    : "flex mb-4 cursor-pointer  lg:pl-0 pl-2";
  const messageBoxClass = isSender
    ? "flex lg:max-w-96 max-w-64 bg-indigo-500 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl p-3 gap-3 "
    : "flex lg:max-w-96 max-w-64 bg-gray-100 rounded-tl-xl rounded-tr-xl rounded-br-xl p-3 gap-3 ";
  const avatarUrl = message.sender_profile_picture;

  return (
    <div className={messageClass}>
      {!isSender && (
        <>
          {!isMobile ? (
            <Avatar
              avatarUrl={
                avatarUrl
                  ? avatarUrl
                  : "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              }
              altText="User Avatar"
            />
          ) : null}
          <div className={messageBoxClass}>
            <p>{message.text}</p>
          </div>
          <p className="text-xs ml-1 text-gray-500 self-end">
            {formatTimestamp(message.timestamp)}
          </p>
        </>
      )}

      {isSender && (
        <>
          <p className="text-xs ml-1 text-gray-500 self-end pr-1">
            {formatTimestamp(message.timestamp)}
          </p>
          <div className={messageBoxClass}>
            <p>{message.text}</p>
          </div>

          {!isMobile ? (
            <Avatar
              avatarUrl={
                avatarUrl
                  ? avatarUrl
                  : "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              }
              altText="My Avatar"
            />
          ) : null}
        </>
      )}
    </div>
  );
}

/**
 * Renders the chat window component.
 * @param {Object[]} messages - The array of chat messages.
 * @param {string} userId - The ID of the current user.
 * @param {Function} sendMessage - The function to send a message.
 * @returns {JSX.Element} The ChatWindow component.
 */
function ChatWindow({ messages, userId, sendMessage }) {
  const [messageText, setMessageText] = useState("");

  // Handle message text change
  const handleMessageChange = (event) => {
    setMessageText(event.target.value);
  };

  // Send message and clear input
  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText(""); // Clear the input field after sending the message
    }
  };

  // Sort messages by timestamp before rendering
  const sortedMessages = messages.sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const conversantName =
    messages[0].sender === userId
      ? messages[0].receiver_name
      : messages[0].sender_name;
  const conversantPicture =
    messages[0].sender === userId
      ? messages[0].receiver_profile_picture
      : messages[0].sender_profile_picture;

  return (
    <div className="flex-1 relative border-l border-gray-300 pt-0">
      <header className="bg-white lg:p-4 pl-10 pb-4 text-gray-700 border-b border-gray-200 flex items-center">
        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-2">
          <img
            src={
              conversantPicture
                ? conversantPicture
                : "https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
            }
            alt={"myavatar"}
            className="w-10 h-10 rounded-full"
          />
        </div>
        <h1 className="text-2xl font-semibold">{conversantName}</h1>
      </header>

      <div className="h-[calc(100vh-144px-32px)] overflow-y-auto lg:p-4 pr-2 p-2 pb-36">
        {sortedMessages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isSender={msg.sender === userId}
          />
        ))}
      </div>
      <footer className="bg-white p-4 absolute bottom-0 w-full">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
            value={messageText}
            onChange={handleMessageChange}
          />
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

export default ChatWindow;
