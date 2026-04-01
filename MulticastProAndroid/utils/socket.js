import io from 'socket.io-client';

const SERVER_URL = 'https://multicast-pro-signaling.onrender.com';

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;