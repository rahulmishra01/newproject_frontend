// import React, { useState } from 'react';
// import VideoCall from './VideoCall';
// import 'tailwindcss/tailwind.css';

// const App = () => {
//   const [userId, setUserId] = useState('');

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

import React, { useEffect, useRef, useState } from 'react';
import VideoCall from './VideoCall';
import io from "socket.io-client";
import 'tailwindcss/tailwind.css';

const App = () => {
  const [userId, setUserId] = useState('');
  const [inCall, setInCall] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("https://new-omagle.onrender.com");

    socket.current.on("matchFound", (data) => {
      setUserId(data.userId);
      setInCall(true);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleCall = () => {
    socket.current.emit("findMatch");
  };

  return (
    <div className="App h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="App-header flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold">1-to-1 Video Call</h1>
        {!inCall ? (
          <button
            onClick={handleCall}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Call with Random
          </button>
        ) : (
          <VideoCall userId={userId} />
        )}
      </header>
    </div>
  );
};

export default App;
