import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { api } from '../config/config';
import { useAuth } from './AuthProvider';

const server = api.slice(0, -3);
const socketIo = io(server, { autoConnect: false });

const socketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, authenticatedUser } = useAuth();

  const [socket, setSocket] = useState(null);
  const [isConnected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCounts, setNotificationCounts] = useState(0);
  const [isNotificationChecked, setIsNotificationChecked] = useState(false);
  const [privateMessage, setPrivateMessage] = useState(null)
  const [onlineStatus, setOnlineStatus] = useState([])

  useEffect(() => {
    if ((socket && socket.connected) || !socketIo || !isAuthenticated) return;
    socketIo.auth = { userId: authenticatedUser.getID };
    socketIo.connect();
    setConnected(true);
    setSocket(socketIo);

    return function cleanup() {
      socketIo.disconnect();
    };
  }, [socket, isAuthenticated]);

  useEffect(() => {
    if (isConnected) {
      socket.on('PING', (data) => console.log(data));
      socket.on('GET_NOTIFICATION', (notifications) => {
        setNotifications(notifications.data);
        if (notifications.count > 0) setNotificationCounts(notifications.count);
      });

      socket.on('PRIVATE_MESSAGE', data => {
        setPrivateMessage(data)
      })

      socket.on('SET_ONLINE_STATUS', userId => {
        setOnlineStatus([
          ...onlineStatus,
          userId
        ])
      })

      socket.on('SET_OFFLINE_STATUS', userId => {
        setOnlineStatus(onlineStatus.filter(id => id !== userId))
      })
    }
  }, [socket, isConnected]);

  const notificationsChecked = () => {
    if (socket && isConnected) {
      socket.emit('OPENED_NOTIFICATION', { user: authenticatedUser.getID });
      setIsNotificationChecked(true);
    }
  };

  return (
    <socketContext.Provider
      value={{
        notifications,
        isNotificationChecked,
        notificationCounts,
        setNotifications,
        setNotificationCounts,
        notificationsChecked,
        privateMessage,
        socket
      }}
    >
      {children}
    </socketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(socketContext);
  if (context === undefined) {
    throw new Error('socketContext must be used within an SocketProvider');
  }
  return context;
};
