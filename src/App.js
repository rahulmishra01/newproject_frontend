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
        <VideoCall userId={userId} />
      </header>
    </div>
  );
};

export default App;
