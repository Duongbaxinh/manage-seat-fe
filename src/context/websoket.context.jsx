import React, { createContext, useContext } from "react";
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
