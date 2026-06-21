import { initializeSocketConnection, getSocket, setupMessageListeners } from "../service/chat.socket";
import { sendMessage,getChats,getMessages,deleteChat } from "../service/chat.api";
import { useDispatch } from "react-redux";
import { setChats,setCurrentChatId,setError,setLoading , createNewChat,addNewMessage,addMessages} from "../chat.slice";
import { useEffect } from "react";

export const useChat = ()=>{

    const dispatch = useDispatch()

    useEffect(() => {
        const socket = initializeSocketConnection()
        
        if (socket) {
            setupMessageListeners(dispatch, (data) => {
                if (data.chatId && data.message) {
                    dispatch(addNewMessage({
                        chatId: data.chatId,
                        content: data.message.content,
                        role: data.message.role,
                    }))
                }
            })
        }

        return () => {
            // Cleanup if needed
        }
    }, [dispatch])

    async function handleSendMessage({ message, chatId }) {

        dispatch(setLoading(true))
        const data = await sendMessage({ message, chatId })
        const { chat, aiMessage } = data
        
        // Create or update chat
        dispatch(createNewChat({
            chatId: chat._id,
            title: chat.title,
        }))

        // Add user message
        dispatch(addNewMessage({
            chatId: chat._id,
            content: message,
            role: "user",
        }))

        // Add AI message
        dispatch(addNewMessage({
            chatId: chat._id,
            content: aiMessage.content,
            role: aiMessage.role,
        }))

        dispatch(setCurrentChatId(chat._id))
        dispatch(setLoading(false))
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc,chat)=>{
            acc[ chat._id ] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updateAt,
            }
            return acc
        },{})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId,chats){

        if(chats[chatId]?.messages.length === 0){
        const data = await getMessages(chatId)
        const {messages} = data

        const formatttedMessages = messages.map(msg=>({
            content: msg.content,
            role: msg.role,
        }))
        dispatch(addMessages({
            chatId,
            messages: formatttedMessages
        }))
    }
        dispatch(setCurrentChatId(chatId))

    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }

}