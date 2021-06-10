import { useState, useEffect } from "react";
import { api } from '../config/config'
import io from 'socket.io-client'
import { useAuth } from '../context/AuthProvider'
const server = api.slice(0, -3)
const socketIo = io(server, { autoConnect: false })

function useSocket(cb) {
    const [socket, setSocket] = useState(null)
    const { isAuthenticated, authenticatedUser } = useAuth()

    useEffect(() => {

        if ((socket && socket.connected) || !socketIo || !isAuthenticated) return;
        socketIo.auth = { userId: authenticatedUser.getID }
        socketIo.connect()

        cb && cb(socket)
        setSocket(socketIo)

        return function cleanup() {
            console.log('CleanUP')
            socketIo.off("connect_error");
        }

    }, [socket, isAuthenticated])

    return socket
}

module.exports = useSocket
