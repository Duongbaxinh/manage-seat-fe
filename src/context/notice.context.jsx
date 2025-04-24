import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocketContext } from "./websoket.context";
import axios from "axios";
import { toast } from "react-toastify";

const NoticeContext = createContext()

export const NoticeProvider = ({ children }) => {
    const { lastJsonMessage } = useWebSocketContext()
    const [diagrams, setDiagrams] = useState([]);
    const [requestApprove, setRequestApprove] = useState(0)
    const fetchData = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const diagramRes = await axios.get("https://seatmanage-be-v3.onrender.com/diagram/all", {
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
            case "switchDiagram":
                toast(`Phòng ${lastJsonMessage.data} đang có sự thay đổi`)
                break;
            case "reject":
                setRequestApprove(requestApprove - 1)
                break;
            case "requestDiagram":
                fetchData()
                toast(`Có yêu cầu thay đổi thay layout từ phòng ${lastJsonMessage.data}`)
                break;
            default:
                break;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastJsonMessage]);

    return (
        <NoticeContext.Provider value={{ requestApprove, setRequestApprove, diagrams, setDiagrams }}>
            {children}
        </NoticeContext.Provider>
    )
}

export const useNoticeContext = () => useContext(NoticeContext)
