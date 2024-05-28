// import React, { useEffect, useRef, useState } from "react";
// import Peer from "peerjs";
// import io from "socket.io-client";
// import "tailwindcss/tailwind.css";

// const VideoCall = ({ userId }) => {
//   const [peerId, setPeerId] = useState("");
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

//     socket.current = io("https://new-omagle.onrender.com");
//     socket.current.on("ring", (data) => {
//       setRemotePeerId(data.from);
//     });

//     socket.current.on("callEnded", () => {
//       endCall();
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
//       socket.current.emit("endCall", { to: remotePeerId });
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
//         {incomingCall && (
//           <button
//             onClick={answerCall}
//             className="bg-green-500 text-white p-2 rounded"
//           >
//             Answer Call
//           </button>
//         )}
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
  const [call, setCall] = useState(null);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    const peer = new Peer(userId);
    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log("Peer ID: ", id);
    });

    peer.on("call", (incomingCall) => {
      console.log("Incoming call from: ", incomingCall.peer);
      setCall(incomingCall);
      answerCall(incomingCall);
    });

    socket.current = io("https://new-omagle.onrender.com");

    socket.current.on("ring", (data) => {
      console.log("Ringing from: ", data.from);
      startCall(data.from);
    });

    socket.current.on("callEnded", () => {
      console.log("Call ended");
      endCall();
    });

    return () => {
      peer.disconnect();
      socket.current.disconnect();
    };
  }, [userId]);

  const startCall = (remotePeerId) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Got local stream");
        localVideoRef.current.srcObject = stream;
        const outgoingCall = peerRef.current.call(remotePeerId, stream);
        outgoingCall.on("stream", (remoteStream) => {
          console.log("Got remote stream");
          remoteVideoRef.current.srcObject = remoteStream;
        });
        setCall(outgoingCall);
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  };

  const answerCall = (incomingCall) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Got local stream for answering call");
        localVideoRef.current.srcObject = stream;
        incomingCall.answer(stream);
        incomingCall.on("stream", (remoteStream) => {
          console.log("Got remote stream for answered call");
          remoteVideoRef.current.srcObject = remoteStream;
        });
        setCall(incomingCall);
      })
      .catch((err) => {
        console.error("Failed to get local stream for answering call", err);
      });
  };

  const endCall = () => {
    if (call) {
      call.close();
      setCall(null);
      if (remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      remoteVideoRef.current.srcObject = null;
      if (localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      localVideoRef.current.srcObject = null;
      socket.current.emit("endCall", { to: call.peer });
    }
  };

  const toggleMute = () => {
    const stream = localVideoRef.current.srcObject;
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setMuted(!muted);
    }
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current.srcObject;
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      setVideoOff(!videoOff);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">1-to-1 Video Call</h1>
      <div className="flex flex-col items-center space-y-2">
        <video ref={localVideoRef} autoPlay muted className="w-1/2 border" />
        <video ref={remoteVideoRef} autoPlay className="w-1/2 border" />
      </div>
      <div className="space-y-2">
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
      </div>
    </div>
  );
};

export default VideoCall;
