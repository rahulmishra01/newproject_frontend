import React, { useState } from 'react';
import VideoCall from './VideoCall';
import 'tailwindcss/tailwind.css';

const App = () => {
  const [userId, setUserId] = useState('');

  return (
    <div className="App h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="App-header flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold">1-to-1 Video Call</h1>
        <input
          type="text"
          placeholder="Enter your user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="p-2 border rounded"
        />
        {userId && <VideoCall userId={userId} />}
      </header>
    </div>
  );
};

export default App;

// import React, { useEffect, useState, useRef } from 'react';
// import VideoCall from './VideoCall';
// import 'tailwindcss/tailwind.css';
// import io from 'socket.io-client';

// const App = () => {
//   const [partnerId, setPartnerId] = useState(null);
//   const socket = useRef(null);

//   useEffect(() => {
//     socket.current = io("https://new-omagle.onrender.com");

//     socket.current.on("pair", ({ partnerId }) => {
//       setPartnerId(partnerId);
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);

//   return (
//     <div className="App h-screen flex flex-col items-center justify-center bg-gray-100">
//       <header className="App-header flex flex-col items-center space-y-4">
//         <h1 className="text-2xl font-bold">1-to-1 Video Call</h1>
//         {partnerId ? (
//           <VideoCall partnerId={partnerId} />
//         ) : (
//           <button className="bg-blue-500 text-white p-2 rounded">Waiting for a partner...</button>
//         )}
//       </header>
//     </div>
//   );
// };

// export default App;
