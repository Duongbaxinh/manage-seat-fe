import React, { createContext, useContext, useEffect } from "react";
import useWebSocket from "react-use-websocket";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const { sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket } = useWebSocket(
            "ws://localhost:8080/ws",
            {
                shouldReconnect: () => true,
                reconnectInterval: 3000,
            }
        );
    useEffect(() => {
        console.log("check role message", lastJsonMessage)
    }, [lastJsonMessage])
    return (
        <WebSocketContext.Provider value={{
            sendMessage,
            sendJsonMessage,
            lastMessage,
            lastJsonMessage,
            readyState,
            getWebSocket
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
