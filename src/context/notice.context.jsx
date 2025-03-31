import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocketContext } from "./websoket.context";
import axios from "axios";

const NoticeContext = createContext()

export const NoticeProvider = ({ children }) => {
    const { lastJsonMessage } = useWebSocketContext()
    const [diagrams, setDiagrams] = useState([]);
    const [requestApprove, setRequestApprove] = useState(0)
    const fetchData = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const diagramRes = await axios.get("http://localhost:8080/diagram/all", {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            })
            setDiagrams(diagramRes.data);
            setRequestApprove(diagramRes.data.length || 0)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        switch (lastJsonMessage?.type) {
            case "approve":

                break;
            case "reject":
                setRequestApprove(requestApprove - 1)
                break;
            case "requestDiagram":
                fetchData()
                break;
            default:
                break;
        }
        console.log("fetchData", lastJsonMessage)
    }, [lastJsonMessage, requestApprove]);
    console.log("diagrams", diagrams)
    console.log("requestApprove", lastJsonMessage?.data)
    return (
        <NoticeContext.Provider value={{ requestApprove, setRequestApprove, diagrams, setDiagrams }}>
            {children}
        </NoticeContext.Provider>
    )
}

export const useNoticeContext = () => useContext(NoticeContext)
