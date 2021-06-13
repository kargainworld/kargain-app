import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { api } from '../config/config';
import { useAuth } from './AuthProvider';

const server = api.slice(0, -3);
const socketIo = io(server, { autoConnect: false });

const defaultContext = {
  socket: null,
  isConnected: false,
  isNotificationChecked: false,
  notifications: [],
  notificationCounts: 0,
  messages: [],
  notificationsChecked: () => {},
  setNotifications: () => {},
  setNotificationCounts: () => {},
};

const socketContext = createContext(defaultContext);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, authenticatedUser } = useAuth();
  const [socketState, setSocketState] = useState(defaultContext);

  useEffect(() => {
    const { socket } = socketState;
    if ((socket && socket.connected) || !socketIo || !isAuthenticated) return;
    socketIo.auth = { userId: authenticatedUser.getID };
    socketIo.connect();
    setSocketState({ ...socketState, socket: socketIo, isConnected: true });

    return function cleanup() {
      socketIo.disconnect();
    };
  }, [socketState.socket, isAuthenticated]);

  useEffect(() => {
    const { isConnected, socket } = socketState;
    if (isConnected) {
      socket.on('PING', (data) => console.log(data));
      socket.on('GET_NOTIFICATION', (notifications) => {
        setNotifications(notifications.data);
        setNotificationCounts(notifications.counts);
      });
    }
  }, [socketState.socket]);

  const setNotifications = (data) => {
    setSocketState({ ...notifications, data });
  };

  const setNotificationCounts = (counts) => {
    setSocketState({ ...notificationCounts, counts });
  };

  const notificationsChecked = () => {
    const { socket } = socketState;
    if (socket) {
      socket.emit('OPENED_NOTIFICATION', { user: authenticatedUser.getID });
      setSocketState({ ...socketState, isNotificationChecked: true });
    }
  };

  return <socketContext.Provider value={{ ...socketState, notificationsChecked }}>{children}</socketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(socketContext);
  if (context === undefined) {
    throw new Error('socketContext must be used within an SocketProvider');
  }
  return context;
};
