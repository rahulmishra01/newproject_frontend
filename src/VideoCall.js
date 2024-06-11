import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import "tailwindcss/tailwind.css";

const VideoCall = ({ peerId }) => {
  const [call, setCall] = useState(null);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log("Peer ID:", id);
      socket.current = io("https://new-omagle.onrender.com");
      socket.current.emit("joinRandomChat", id);
      socket.current.on("peerFound", (peerId) => {
        startCall(peerId);
      });

      peer.on("call", (incomingCall) => {
        setCall(incomingCall);
        setIncomingCall(incomingCall);
      });

      socket.current.on("callEnded", () => {
        endCall();
      });
    });

    return () => {
      peer.disconnect();
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const startCall = (peerId) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        const outgoingCall = peerRef.current.call(peerId, stream);
        outgoingCall.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
        setCall(outgoingCall);
      });
  };

  const answerCall = () => {
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
    if (call) {
      call.close();
      setCall(null);
      remoteVideoRef.current.srcObject = null;
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      socket.current.emit("endCall", { to: peerId });
    }
  };

  const toggleMute = () => {
    const stream = localVideoRef.current.srcObject;
    stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setMuted(!muted);
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current.srcObject;
    stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
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
        {incomingCall && (
          <button
            onClick={answerCall}
            className="bg-green-500 text-white p-2 rounded"
          >
            Answer Call
          </button>
        )}
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
