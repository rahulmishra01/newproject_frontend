// import React, { useState } from "react";
// import VideoCall from "./VideoCall";
// import "tailwindcss/tailwind.css";

// const App = () => {
//   const [userId, setUserId] = useState("");

//   return (
//     <div className="App h-screen flex flex-col items-center justify-center bg-gray-100">
//       <header className="App-header flex flex-col items-center space-y-4">
//         <h1 className="text-2xl font-bold">1-to-1 Video Call</h1>
//         <input
//           type="text"
//           placeholder="Enter your user ID"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           className="p-2 border rounded"
//         />
//         {userId && <VideoCall userId={userId} />}
//       </header>
//     </div>
//   );
// };

// export default App;

// import React, { useState } from "react";
// import VideoCall from "./VideoCall";
// import "tailwindcss/tailwind.css";
// import { v4 as uuidv4 } from "uuid";

// const App = () => {
//   const [userId, setUserId] = useState("");
//   const [stop, setStop] = useState(false);
//   console.log("🚀 ~ App ~ userId:", userId);

//   const createRoom = () => {
//     const roomKey = uuidv4();
//     setUserId(roomKey);
//     setStop(!stop);
//   };

//   return (
//     <div className="App h-screen flex flex-col items-center justify-center bg-gray-100">
//       <header className="App-header flex flex-col items-center space-y-4">
//         <h1 className="text-2xl font-bold">1-to-1 Video Call</h1>
//         {userId && <VideoCall userId={userId} />}
//         {!stop && <button onClick={() => createRoom()}>Room</button>}
//       </header>
//     </div>
//   );
// };

// export default App;

import React, { useState } from "react";
import VideoCall from "./VideoCall";
import "tailwindcss/tailwind.css";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const socket = io("https://new-omagle.onrender.com");

const App = () => {
  const [roomId, setRoomId] = useState("");
  const [userId, setUserId] = useState("");
  const [stop, setStop] = useState(false);

  const createRoom = () => {
    const roomKey = uuidv4();
    setRoomId(roomKey);
    setUserId(roomKey);
    setStop(true);
    socket.emit("createRoom", roomKey);
  };

  const joinRoom = () => {
    socket.emit("joinRoom", roomId);
  };

  return (
    <div className="App h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="App-header flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold">1-to-1 Video Call</h1>
        {userId && <VideoCall userId={userId} socket={socket} />}
        {!stop && (
          <>
            <button onClick={createRoom}>Create Room</button>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="p-2 border rounded"
            />
            <button onClick={joinRoom}>Join Room</button>
          </>
        )}
      </header>
    </div>
  );
};

export default App;
