// import React, { useEffect, useRef, useState } from "react";
// import Peer from "peerjs";
// import io from "socket.io-client";
// import "tailwindcss/tailwind.css";

// const VideoCall = ({ userId }) => {
//   const [peerId, setPeerId] = useState("");
//   console.log("🚀 ~ VideoCall ~ peerId:", peerId)
//   const [remotePeerId, setRemotePeerId] = useState("");
//   const [call, setCall] = useState(null);
//   const [muted, setMuted] = useState(false);
//   const [videoOff, setVideoOff] = useState(false);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const socket = useRef(null);
//   const peerRef = useRef(null);

//   useEffect(() => {
//     const peer = new Peer(userId);
//     peerRef.current = peer;

//     peer.on("open", (id) => {
//       setPeerId(id);
//     });

//     peer.on("call", (incomingCall) => {
//       setCall(incomingCall);
//       setIncomingCall(incomingCall);
//     });

//     socket.current = io("http://localhost:5000");
//     socket.current.on("ring", (data) => {
//       setRemotePeerId(data.from);
//     });

//     return () => {
//       peer.disconnect();
//       socket.current.disconnect();
//     };
//   }, [userId]);

//   const startCall = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         localVideoRef.current.srcObject = stream;
//         const outgoingCall = peerRef.current.call(remotePeerId, stream);
//         outgoingCall.on("stream", (remoteStream) => {
//           remoteVideoRef.current.srcObject = remoteStream;
//         });
//         setCall(outgoingCall);
//       });
//   };

//   const answerCall = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         localVideoRef.current.srcObject = stream;
//         incomingCall.answer(stream);
//         incomingCall.on("stream", (remoteStream) => {
//           remoteVideoRef.current.srcObject = remoteStream;
//         });
//         setCall(incomingCall);
//         setIncomingCall(null);
//       });
//   };

//   const endCall = () => {
//     if (call) {
//       call.close();
//       setCall(null);
//       remoteVideoRef.current.srcObject = null;
//       localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//     }
//   };

//   const toggleMute = () => {
//     const stream = localVideoRef.current.srcObject;
//     stream
//       .getAudioTracks()
//       .forEach((track) => (track.enabled = !track.enabled));
//     setMuted(!muted);
//   };

//   const toggleVideo = () => {
//     const stream = localVideoRef.current.srcObject;
//     stream
//       .getVideoTracks()
//       .forEach((track) => (track.enabled = !track.enabled));
//     setVideoOff(!videoOff);
//   };

//   return (
//     <div className="flex flex-col items-center p-4 space-y-4">
//       <h1 className="text-xl font-bold">1-to-1 Video Call</h1>
//       <div className="flex flex-col items-center space-y-2">
//         <video ref={localVideoRef} autoPlay muted className="w-1/2 border" />
//         <video ref={remoteVideoRef} autoPlay className="w-1/2 border" />
//       </div>
//       <div className="space-y-2">
//         <input
//           type="text"
//           placeholder="Enter peer ID to call"
//           value={remotePeerId}
//           onChange={(e) => setRemotePeerId(e.target.value)}
//           className="p-2 border rounded"
//         />
//         <button
//           onClick={startCall}
//           className="bg-blue-500 text-white p-2 rounded"
//         >
//           Call
//         </button>
//         {call && (
//           <button
//             onClick={endCall}
//             className="bg-red-500 text-white p-2 rounded"
//           >
//             End Call
//           </button>
//         )}
//         <button
//           onClick={toggleMute}
//           className="bg-gray-500 text-white p-2 rounded"
//         >
//           {muted ? "Unmute" : "Mute"}
//         </button>
//         <button
//           onClick={toggleVideo}
//           className="bg-gray-500 text-white p-2 rounded"
//         >
//           {videoOff ? "Turn Video On" : "Turn Video Off"}
//         </button>
//         {incomingCall && (
//           <button
//             onClick={answerCall}
//             className="bg-green-500 text-white p-2 rounded"
//           >
//             Answer Call
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideoCall;

import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import "tailwindcss/tailwind.css";

const VideoCall = ({ userId }) => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [call, setCall] = useState(null);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [waitingForCall, setWaitingForCall] = useState(false); // State to track if the user is waiting for a call
  const [incomingCall, setIncomingCall] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    const peer = new Peer(userId);
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (incomingCall) => {
      if (!call && !waitingForCall) { // If not already in a call and not waiting for a call
        setIncomingCall(incomingCall);
      } else {
        // Automatically answer the call if already in a call or waiting for a call
        answerCall(incomingCall);
      }
    });

    socket.current = io("https://new-omagle.onrender.com");
    socket.current.on("ring", (data) => {
      setRemotePeerId(data.from);
    });

    return () => {
      peer.disconnect();
      socket.current.disconnect();
    };
  }, [userId, call, waitingForCall]);

  const startCall = () => {
    setWaitingForCall(true); // Set waiting for call to true when user initiates a call
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        const outgoingCall = peerRef.current.call(remotePeerId, stream);
        outgoingCall.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
        setCall(outgoingCall);
      });
  };

  const answerCall = (incomingCall) => {
    setWaitingForCall(false); // Set waiting for call to false when user answers a call
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        incomingCall.answer(stream);
        incomingCall.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
        setCall(incomingCall);
        setIncomingCall(null);
      });
  };

  const endCall = () => {
    setWaitingForCall(false); // Set waiting for call to false when user ends the call
    if (call) {
      call.close();
      setCall(null);
      remoteVideoRef.current.srcObject = null;
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const toggleMute = () => {
    const stream = localVideoRef.current.srcObject;
    stream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setMuted(!muted);
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current.srcObject;
    stream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setVideoOff(!videoOff);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">1-to-1 Video Call</h1>
      <div className="flex flex-col items-center space-y-2">
        <video ref={localVideoRef} autoPlay muted className="w-1/2 border" />
        <video ref={remoteVideoRef} autoPlay className="w-1/2 border" />
      </div>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Enter peer ID to call"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={startCall}
          className="bg-blue-500 text-white p-2 rounded"
          disabled={waitingForCall} // Disable the call button if waiting for a call
        >
          {waitingForCall ? "Waiting for call..." : "Call"}
        </button>
        {call && (
          <button
            onClick={endCall}
            className="bg-red-500 text-white p-2 rounded"
          >
            End Call
          </button>
        )}
        <button
          onClick={toggleMute}
          className="bg-gray-500 text-white p-2 rounded"
        >
          {muted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={toggleVideo}
          className="bg-gray-500 text-white p-2 rounded"
        >
          {videoOff ? "Turn Video On" : "Turn Video Off"}
        </button>
        {incomingCall && (
          <button
            onClick={() => answerCall(incomingCall)}
            className="bg-green-500 text-white p-2 rounded"
          >
            Answer Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
