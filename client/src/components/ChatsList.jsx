import React from "react";
import { Link } from "react-router-dom";

/**
 * Renders a list of chats with their latest messages.
 * @param {Object[]} messages - The array of messages.
 * @param {number} conversantId - The ID of the conversant.
 * @param {number} userId - The ID of the user.
 * @returns {JSX.Element} The ChatsList component.
 */
function ChatsList({ messages, conversantId, userId }) {
  conversantId = parseInt(conversantId);

  /**
   * Groups messages by conversation and finds the latest message in each.
   * @type {Object}
   */
  const latestMessages = messages.reduce((acc, message) => {
    // Determine the other party in the conversation
    const key = message.sender === userId ? message.receiver : message.sender;

    // If there's already an entry for this conversation, check if the current message is newer
    if (
      !acc[key] ||
      new Date(acc[key].timestamp) < new Date(message.timestamp)
    ) {
      acc[key] = message;
    }

    return acc;
  }, {});

  /**
   * Maps the latest messages to chat objects.
   * @type {Object[]}
   */
  const chats = Object.values(latestMessages).map((message) => ({
    id: message.sender === userId ? message.receiver : message.sender,
    name:
      message.sender === userId ? message.receiver_name : message.sender_name,
    last_message:
      message.sender === userId ? `You: ${message.text}` : message.text,
    profile_picture_url:
      message.sender === userId
        ? message.receiver_profile_picture
        : message.sender_profile_picture,
    timestamp: message.timestamp,
  }));

  // Sort chats by timestamp in descending order to show newest conversations first
  chats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="lg:w-1/3 w-full h-screen overflow-y-auto p-3 mb-9 pb-20">
      <h1 className="text-2xl font-semibold mb-4">Chats</h1>
      {chats.map((chat, index) => (
        <Link key={index} to={`/inbox/${chat.id}`}>
          <div
            className={`flex items-center mb-1 border-t border-b border-gray-300 cursor-pointer p-2  ${
              chat.id === conversantId ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img
                src={
                  chat.profile_picture_url
                    ? chat.profile_picture_url
                    : `https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`
                }
                alt="Conversation Avatar"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="flex-1 h-20">
              <h2 className="text-lg font-semibold">{chat.name}</h2>
              <p className="text-gray-600">
                {chat.last_message.length > 50
                  ? chat.last_message.slice(0, 50) + "..."
                  : chat.last_message}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ChatsList;
