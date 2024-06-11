import React, { useState } from "react";
import VideoCall from "./VideoCall";
import "tailwindcss/tailwind.css";
import io from "socket.io-client";

const App = () => {
  const [userId, setUserId] = useState("");
  const [randomChat, setRandomChat] = useState(false);
  const [peerId, setPeerId] = useState("");

  const socket = io("https://new-omagle.onrender.com");

  const handleRandomChat = () => {
    setRandomChat(true);
    socket.emit("joinRandomChat");
    socket.on("peerFound", (peerId) => {
      setPeerId(peerId);
    });
  };

  return (
    <div className="App h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="App-header flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold">Random Chat</h1>
        <input
          type="text"
          placeholder="Enter your user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={handleRandomChat}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Random Chat
        </button>
        {peerId && <VideoCall userId={userId} peerId={peerId} />}
      </header>
    </div>
  );
};

export default App;
