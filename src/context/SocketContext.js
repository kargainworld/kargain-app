import { createContext, useContext, useEffect, useState } from "react";
import io from 'socket.io-client'
import { api } from '../config/config'
import { useAuth } from './AuthProvider'

const server = api.slice(0, -3)
const socketIo = io(server, { autoConnect: false })

const socketContext = createContext()

export function SocketProvider({ children }) {
    const socket = useProvideSocket();
    return <socketContext.Provider value={socket}>{children}</socketContext.Provider>
}


export const useSocket = () => {
    return useContext(socketContext)
}

const useProvideSocket = () => {
    const [socket, setSocket] = useState(null)
    const [isConnected, setConnected] = useState(false)
    const { isAuthenticated, authenticatedUser } = useAuth()
    useEffect(() => {

        if ((socket && socket.connected) || !socketIo || !isAuthenticated) return;
        socketIo.auth = { userId: authenticatedUser.getID }
        socketIo.connect()
        setConnected(true)
        setSocket(socketIo)

        return function cleanup() {
            socketIo.disconnect()
        }

    }, [socket, isAuthenticated])

    useEffect(() => {
        if (isConnected) {
            socket.on('PING', (data) => console.log(data))
        }
    }, [socket])

    return {
        socket,
        isConnected
    }
}