import { io } from "socket.io-client";

let socket = null;

export const initializeSocketConnection = () => {
    if (socket) return socket;

    socket = io("http://localhost:3000", {
        withCredentials: true,
    })

    socket.on("connect", () => {
        console.log("Connected to Socket.IO server")
    })

    socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server")
    })

    return socket
}

export const getSocket = () => {
    return socket
}

export const setupMessageListeners = (dispatch, callback) => {
    if (!socket) {
        console.error("Socket not initialized")
        return
    }

    // Listen for new messages from server
    socket.on("message:new", (data) => {
        console.log("New message received:", data)
        callback(data)
    })

    // Listen for AI responses
    socket.on("message:ai-response", (data) => {
        console.log("AI response received:", data)
        callback(data)
    })
}