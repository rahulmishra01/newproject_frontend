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

import React, { useState } from "react";
import VideoCall from "./VideoCall";
import "tailwindcss/tailwind.css";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [userId, setUserId] = useState("");
  const [stop, setStop] = useState(false);
  console.log("🚀 ~ App ~ userId:", userId);

  const createRoom = () => {
    const roomKey = uuidv4();
    setUserId(roomKey);
    setStop(!stop);
  };

  return (
    <div className="App h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="App-header flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold">1-to-1 Video Call</h1>
        {userId && <VideoCall userId={userId} />}
        {!stop && <button onClick={() => createRoom()}>Room</button>}
      </header>
    </div>
  );
};

export default App;
