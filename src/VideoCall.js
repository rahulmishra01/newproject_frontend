import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';
import 'tailwindcss/tailwind.css';

const VideoCall = ({ userId }) => {
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
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

    peer.on('open', id => {
      setPeerId(id);
    });

    peer.on('call', call => {
      setCall(call);
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        localVideoRef.current.srcObject = stream;
        call.answer(stream);
        call.on('stream', remoteStream => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      });
    });

    socket.current = io('http://localhost:5000');
    socket.current.on('ring', data => {
      setRemotePeerId(data.from);
    });

    return () => {
      peer.disconnect();
      socket.current.disconnect();
    };
  }, [userId]);

  const startCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      localVideoRef.current.srcObject = stream;
      const call = peerRef.current.call(remotePeerId, stream);
      call.on('stream', remoteStream => {
        remoteVideoRef.current.srcObject = remoteStream;
      });
      setCall(call);
    });
  };

  const toggleMute = () => {
    const stream = localVideoRef.current.srcObject;
    stream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
    setMuted(!muted);
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current.srcObject;
    stream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
    setVideoOff(!videoOff);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
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
        <button onClick={startCall} className="bg-blue-500 text-white p-2 rounded">
          Call
        </button>
        <button onClick={toggleMute} className="bg-gray-500 text-white p-2 rounded">
          {muted ? 'Unmute' : 'Mute'}
        </button>
        <button onClick={toggleVideo} className="bg-gray-500 text-white p-2 rounded">
          {videoOff ? 'Turn Video On' : 'Turn Video Off'}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
