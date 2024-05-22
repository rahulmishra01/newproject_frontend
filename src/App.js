import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import io from "socket.io-client";

const VideoCall = ({ userId }) => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [call, setCall] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);

  const peer = new Peer(userId);
  useEffect(() => {
    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      setCall(call);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });
    });

    socket.current = io("https://new-omagle.onrender.com");
    socket.current.on("ring", (data) => {
      setRemotePeerId(data.from);
    });

    return () => {
      peer.disconnect();
      socket.current.disconnect();
    };
  }, [userId]);

  const startCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        const call = peer.call(remotePeerId, stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
        setCall(call);
      });
  };

  return (
    <div>
      <div>
        <video ref={localVideoRef} autoPlay muted />
        <video ref={remoteVideoRef} autoPlay />
      </div>
      <button onClick={startCall}>Call</button>
    </div>
  );
};

export default VideoCall;
