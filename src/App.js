import React, { useState } from "react";
import VideoCall from "./VideoCall";
import "tailwindcss/tailwind.css";
import io from "socket.io-client";

const App = () => {
  const [peerId, setPeerId] = useState("");
  const socket = io("https://new-omagle.onrender.com");

  const handleRandomChat = () => {
    socket.emit("joinRandomChat");
    socket.on("peerFound", (peerId) => {
      setPeerId(peerId);
    });
  };

  return (
    <div className="App h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="App-header flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold">Random Chat</h1>
        <button
          onClick={handleRandomChat}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Random Chat
        </button>
        {peerId && <VideoCall peerId={peerId} />}
      </header>
    </div>
  );
};

export default App;
