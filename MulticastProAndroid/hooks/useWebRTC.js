import { useState, useRef, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import io from 'socket.io-client';
import {
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';

export const useWebRTC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [roomInfo, setRoomInfo] = useState({ roomId: '', streamerName: '' });
  
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);

  const startStream = useCallback(async (roomId, streamerName) => {
    try {
      // Get media stream
      const stream = await mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: 1280,
          height: 720,
        },
        audio: true,
      });
      setLocalStream(stream);

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });
      peerConnectionRef.current = pc;

      // Add tracks
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('ice-candidate', {
            candidate: event.candidate,
          });
        }
      };

      // Handle connection state
      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
        if (pc.connectionState === 'failed') {
          Alert.alert('Connection Failed', 'Stream connection lost');
        }
      };

      // Connect to signaling server
      const socket = io('https://multicast-pro-signaling.onrender.com', {
        transports: ['websocket'],
        reconnection: true,
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('✅ Connected to signaling server');
        socket.emit('streamer-join', { roomId, streamerName });
        setIsStreaming(true);
        setRoomInfo({ roomId, streamerName });
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        Alert.alert('Connection Error', 'Could not connect to signaling server');
      });

      // Handle incoming offers from viewers
      socket.on('offer', async (data) => {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          
          socket.emit('answer', {
            target: data.from,
            sdp: pc.localDescription,
            streamerId: socket.id,
          });
        } catch (error) {
          console.error('Error handling offer:', error);
        }
      });

      return true;
    } catch (error) {
      console.error('Error starting stream:', error);
      Alert.alert('Stream Error', `Failed to start stream: ${error.message}`);
      return false;
    }
  }, []);

  const stopStream = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    setIsStreaming(false);
    setRoomInfo({ roomId: '', streamerName: '' });
  }, [localStream]);

  return {
    isStreaming,
    localStream,
    roomInfo,
    startStream,
    stopStream,
  };
};