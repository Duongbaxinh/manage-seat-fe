import React, { createContext, useContext, useState } from "react";
import useWebSocket from "react-use-websocket";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [approving, setApproving] = useState(0)
    const { sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket } = useWebSocket(
            "wss://seatmanage-be-v3.onrender.com/ws",
            // "https://seatmanage-be-v3.onrender.com/ws",
            {
                shouldReconnect: () => true,
                reconnectInterval: 3000,
                onOpen: () => {
                    if (user) {
                        sendMessage(JSON.stringify({ type: "auth", username: user.username, role: user.role }))
                    }
                    console.log("WebSocket connection opened")
                },
                onClose: () => console.log("WebSocket connection closed"),
            }
        );
    return (
        <WebSocketContext.Provider value={{
            sendMessage,
            sendJsonMessage,
            lastMessage,
            lastJsonMessage,
            readyState,
            getWebSocket,
            approving,
            setApproving,
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
