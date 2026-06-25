import {Server} from "socket.io";

let io;

export function initSocket(httpServer){
    io = new Server(httpServer,{
        cors:{
            origin:"https://query-ai-frontend.vercel.app",
            credentials: true
        }
    })

    console.log("Socket io Server is running")
    
    io.on("connection",(socket)=>{
        console.log("A user connected: " + socket.id)

        // Join a chat room
        socket.on("join:chat", (chatId) => {
            socket.join(`chat:${chatId}`)
            console.log(`User ${socket.id} joined chat ${chatId}`)
        })

        // Leave a chat room
        socket.on("leave:chat", (chatId) => {
            socket.leave(`chat:${chatId}`)
            console.log(`User ${socket.id} left chat ${chatId}`)
        })

        socket.on("disconnect", () => {
            console.log(`User ${socket.id} disconnected`)
        })
    })
}

export function getIO(){
    if(!io){
        throw new Error("Socket.io not initialized")
    }

    return io

}