import { useState, useEffect } from "react";
import { api } from '../config/config'
import io from 'socket.io-client'
import { useAuth } from '../context/AuthProvider'
const server = api.slice(0, -3)
const socketIo = io(server)

function useSocket(cb) {
    const [socket, setSocket] = useState(null)
    const { isAuthenticated, authenticatedUser } = useAuth()
    useEffect(() => {

        if (socket || !socketIo) return;

        if (isAuthenticated) {
            socketIo.emit('SET_USER_ID', { id: authenticatedUser.getID })
        }

        cb && cb(socket)
        setSocket(socketIo)

        return () => {
            socketIo.off('Offline', cb)
        }

    }, [socket])

    return socket
}

module.exports = useSocket
