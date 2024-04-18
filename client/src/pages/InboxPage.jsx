// Importing Libraries, Frameworks and React Components
import React, { useState, useEffect, useContext, useRef } from "react";
import Sidebar from "components/Sidebar";
import ChatsList from "components/ChatsList";
import { useParams, Link } from "react-router-dom";
import ChatWindow from "components/ChatWindow";
import { AuthContext } from "components/AuthProvider";

/**
 * Inbox page component.
 * Displays the user's inbox with chats and messages.
 */
function InboxPage() {
  // Get the conversantId from the URL params
  let { conversantId } = useParams();

  // State variables
  const [messages, setMessages] = useState([]);
  const { userData, apiToken } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(false);

  const WS_URL = process.env.REACT_APP_WS_URL;

  // Initialize a ref for the WebSocket connection
  const ws = useRef(null);

  /**
   * Effect for WebSocket connection.
   * Establishes a WebSocket connection and handles incoming messages.
   */
  useEffect(() => {
    // WebSocket connection setup

    ws.current = new WebSocket(`${WS_URL}/chat/?token=${apiToken}`);
    
    ws.current.onopen = () => console.log('WebSocket Connected');
    ws.current.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      // Assuming messageData format is suitable or you adjust as needed
      // Update activeChatMessages if the message belongs to the active conversation
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };
    ws.current.onerror = (error) => console.error('WebSocket Error: ', error);
    ws.current.onclose = () => console.log('WebSocket Disconnected');

    const handleClose = () => ws.current.close();
    window.addEventListener('beforeunload', handleClose);

    return () => {
      ws.current.close();
      window.removeEventListener('beforeunload', handleClose);
    };
  }, [apiToken]); // Add dependencies as needed

  /**
   * Effect to resize on mobile.
   * Updates the isMobile state based on the window width.
   */
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

  /**
   * Effect to fetch all messages.
   * Fetches all messages from the server and updates the messages state.
   */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/`, {
          headers: {
            'Authorization': `Token ${apiToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const messages = await response.json();

        // Set the fetched messages to the state
        setMessages(messages);

      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchMessages();
  }, [apiToken]); // Depend on apiToken to re-fetch messages if it changes

  /**
   * Sends a message via WebSocket.
   * @param {string} messageContent - The content of the message to send.
   */
  const sendMessage = (messageContent) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const messageData = {
        receiver: conversantId,
        message: messageContent,
      };
      ws.current.send(JSON.stringify(messageData));
      console.log(` Sent Message: ${JSON.stringify(messageData)}`);
    } else {
      console.error('WebSocket is not connected.');
    }
  };

  // Filter messages based on the selected conversantId
  const filteredMessages = messages.filter((m) =>
    String(m.sender) === String(conversantId) || String(m.receiver) === String(conversantId)
  );

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex h-screen overflow-hidden pt-6 sm:pt-6 sm:ml-28">
        {/* Check if user signed in yet */}
        {!userData ? (
          <>
            {/* If user is not signed in, display warning */}
            <div className="flex justify-center items-center text-center h-screen w-full">
              <p>
                Login required to view your messages. Please{" "}
                <a href="login" className="text-blue-600">
                  sign in
                </a>
                .
              </p>
            </div>
          </>
        ) : (
          <>
            {/* If user already signed in, display chatsList and chatWindow */}
            {isMobile ? (
              <>
                {/* Mobile view: Check if a specific conversation is selected */}
                {conversantId &&
                conversantId.trim() !== "" &&
                messages.length > 0 ? (
                  <>
                    <div className="fixed top-4 left-0 z-50 p-3 mb-6">
                      {/* Back arrow to go back to the chats list */}
                      <Link to="/inbox" className="text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </Link>
                    </div>
                    {/* Render ChatWindow for the selected conversation */}
                    <ChatWindow userId={userData.id} messages={filteredMessages} sendMessage={sendMessage} />
                  </>
                ) : (
                  // If no specific conversation selected, display the ChatsList
                  <>
                    <Sidebar />
                    <ChatsList messages={messages} userId={userData.id} conversantId={conversantId} />
                  </>
                )}
              </>
            ) : (
              <>
                <ChatsList messages={messages} userId={userData.id} conversantId={conversantId} />
                {filteredMessages && filteredMessages.length > 0 ? (
                  <ChatWindow userId={userData.id} messages={filteredMessages} sendMessage={sendMessage}  />
                ) : (
                  <div className="flex flex-col justify-center items-center flex-1">
                    <p>No messages to display. Please select a conversation</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default InboxPage;
