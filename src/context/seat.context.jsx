import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useWebSocketContext } from "./websoket.context";
import { useForm } from "react-hook-form";

const SeatContext = createContext();

export const useSeatContext = () => useContext(SeatContext);

export const SeatProvider = ({ children }) => {
    const { lastJsonMessage } = useWebSocketContext();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const { id } = useParams();
    const [seats, setSeats] = useState([]);
    const [objects, setObjects] = useState([]);
    const [roomInfo, setRoomInfo] = useState(null);
    const [file, setFile] = useState(null);
    const [color, setColor] = useState("#ff0000");
    const [objected, setObjected] = useState(null)
    const [objectCopy, setObjectCopy] = useState(null)
    const [users, setUser] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [userAssign, setUserAssign] = useState(null);
    const [seatAssign, setSeatAssign] = useState(null);
    const [assign, setAssign] = useState(false);



    const handleSetNameObject = (e, idObject) => {
        if (objects.length <= 0) return
        setObjects((prev) => prev.map((object) => object.id === idObject ? { ...object, name: e.target.value } : object))
    }
    const handleDeleteObject = (objectId) => {
        setObjects((prev) => prev.filter((item) => item.id !== objectId));
    };
    const handleUpdateObject = (objectId, updates) => {
        setObjects((prev) =>
            prev.map((item) =>
                item.id === objectId ? { ...item, ...updates } : item
            )
        );
    };
    const handleAddObject = (newObject) => {
        setObjects((prev) => [...prev, newObject]);
    };

    const handleCopyOrPaste = (e, object) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "c") {
            setObjectCopy(() => object)
            e.preventDefault();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "v") {
            console.log("Paste event detected", object);
            if (!objectCopy) {
                return
            }
            handleAddObject({ ...object, id: Date.now(), posX: (objectCopy.posX + 10) })

            e.preventDefault();
        }
    };
    const handleColor = (newColor) => {
        setColor(newColor)
        handleUpdateObject(objected.id, { color: newColor.hex })
    }

    // Controller Seat 


    const createSeat = async (data) => {
        try {
            const token = localStorage.getItem("accessToken");
            console.log("check data create seat :::: ", data)
            if (data.userId && (data.userId === null || !assign || users.length === 0)) {
                delete data.userId
            }
            await axios.post(
                "http://localhost:8080/seat",
                {
                    ...data,
                    roomId: id,
                    posX: 0,
                    posY: 0,
                },
                {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                }
            );
            await fetchData();
            setIsOpen(false);
            reset();
        } catch (error) {
            console.error("Error creating seat:", error);
        }
    };

    const handleSetSeatPosition = (seatId, position) => {
        setSeats((prevSeats) =>
            prevSeats.map((seat) => seat.id === seatId ? {
                ...seat,
                posX: position.x,
                posY: position.y,
            } : seat)
        );
    };



    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
        }
    };

    const handleResetSeat = (seatId) => {
        setSeats((prevSeats) =>
            prevSeats.map((seat) =>
                seat.id === seatId ? { ...seat, posX: 0, posY: 0 } : seat
            )
        );
    }

    const handleUnassignSeat = (seatId) => {
        setSeats((prevSeats) =>
            prevSeats.map((seat) => {
                if (seat.id === seatId) {
                    return {
                        ...seat,
                        posX: 0,
                        posY: 0,
                    };
                }
                return seat;
            })
        );

    };

    const handleAssign = async (seatId, userId) => {
        const token = localStorage.getItem("accessToken");
        console.log("check seatId :::: ", seatId, "   ", userId)
        await axios.put("http://localhost:8080/seat/assign", {
            "seatId": seatId,
            "userId": userId,
        },
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            }
        )
        fetchDataUser({
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
        })
    }

    const handleReAssign = async (newSeatId, oldSeatId, userId) => {
        const token = localStorage.getItem("accessToken");
        await axios.put("http://localhost:8080/seat/reassign", {
            "newSeatId": newSeatId,
            "oldSeatId": oldSeatId,
            "userId": userId
        },
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            }
        )
        fetchDataUser({
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
        })
    }
    const handleUnAssign = async (seatId) => {
        if (window.confirm("Are you sure unAssign?")) {
            const token = localStorage.getItem("accessToken");
            await axios.get(`http://localhost:8080/seat/unassign/${seatId}`,
                {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                }
            )
            fetchDataUser({
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            })
        }

    }






    const fetchData = useCallback(async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const authentication = { headers: { Authorization: `Bearer ${JSON.parse(token)}` } };

            const response = await axios.get(`http://localhost:8080/room/view/${id}`, authentication);
            const data = response.data.result;

            setPreviewUrl(data.image);
            setSeats(data.seats);
            setObjects(JSON.parse(data.object) ?? []);
            setRoomInfo({ name: data.name, floor: data.floor, hall: data.hall });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [id]);

    const handleSaveDiagram = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const formData = new FormData();
            formData.append("roomId", id);
            if (file) formData.append("image", file);
            formData.append("seats", JSON.stringify(seats));
            formData.append("object", JSON.stringify(objects));

            await axios.post("http://localhost:8080/diagram/draft", formData, {
                headers: { Authorization: `Bearer ${JSON.parse(token)}`, "Content-Type": "multipart/form-data" },
            });
        } catch (error) {
            console.error("Error saving diagram:", error);
        }
    };

    const handleAssignSeat = async (seatId, userId) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.put("http://localhost:8080/seat/assign", { seatId, userId }, {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            });
            fetchData();
        } catch (error) {
            console.error("Error assigning seat:", error);
        }
    };



    const fetchDataUser = async (authentication) => {
        try {
            const userResponse = await axios.get(`http://localhost:8080/room/users/${id}`, authentication)
            setUser(userResponse.data.result);
        } catch (error) {
            alert(error.message)
        }
    }


    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const authentication = {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
        };
        fetchData(authentication);
        fetchDataUser(authentication)
        console.log("run at here")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchData();

        if (!lastJsonMessage) return;

        const { type, data } = lastJsonMessage;
        switch (type) {
            case "seatUpdate":
                setSeats(prevSeats => prevSeats.map(seat => (seat.id === data.id ? { ...seat, ...data } : seat)));
                break;
            case "createSeat":
                setSeats(prevSeats => [...prevSeats, data]);
                break;
            case "seatDelete":
                setSeats(prevSeats => prevSeats.filter(seat => seat.id !== data.seatId));
                break;
            case "assignSeat":
                setSeats(prevSeats => prevSeats.map(seat => (seat.id === data.id ? { ...seat, isOccupied: true, user: data.user } : seat)));
                break;
            case "unAssignSeat":
                setSeats(prevSeats => prevSeats.map(seat => (seat.id === data.id ? { ...seat, isOccupied: false, user: null } : seat)));
                break;
            default:
                console.warn("Unknown message type:", type);
        }
    }, [fetchData, lastJsonMessage]);

    return (
        <SeatContext.Provider value={{
            seats, setSeats,
            handleAssignSeat,
            objects,
            setObjected,
            handleSetNameObject,
            handleDeleteObject,
            handleUpdateObject,
            handleCopyOrPaste,
            objectCopy,
            handleAddObject,
            setObjectCopy,
            setObjects,

            handleSetSeatPosition,
            handleResetSeat,
            handleUnassignSeat,
            handleAssign,
            handleUnAssign,
            handleReAssign,
            handleFileChange,
            previewUrl,
            setPreviewUrl,
            isOpen,
            setIsOpen,
            register,
            handleSubmit,
            reset,
            formState: { errors },
            createSeat,
            file, setFile,
            roomInfo,
            handleSaveDiagram,
            handleColor,
            color,
            setColor
        }}>
            {children}
        </SeatContext.Provider>
    );
};
