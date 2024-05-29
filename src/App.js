import React, { useState } from "react";
import VideoCall from "./VideoCall";
import "tailwindcss/tailwind.css";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [userId, setUserId] = useState("");
  const [stop, setStop] = useState(false);

  const handleClick = () => {
    setUserId(uuidv4());
    setStop(true);
  };

  return (
    <div className="App h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="App-header flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold">1-to-1 Video Call</h1>
        {!stop && (
          <button
            onClick={handleClick}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Random
          </button>
        )}
        {userId && <VideoCall userId={userId} />}
      </header>
    </div>
  );
};

export default App;
