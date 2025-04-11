import { createContext, useContext, useState } from "react";

const SeatContext = createContext();


export const SeatProvider = ({ children }) => {
    const [seats, setSeats] = useState([]);

    const handleSetSeatPosition = (seatId, position) => {
        setSeats((prevSeats) =>
            prevSeats.map((seat) =>
                seat.id === seatId
                    ? {
                        ...seat,
                        posX: position.x,
                        posY: position.y,
                    }
                    : seat
            )
        );
    };

    const handleResetSeat = (seatId) => {
        setSeats((prevSeats) =>
            prevSeats.map((seat) => (seat.id === seatId ? { ...seat, posX: 0, posY: 0 } : seat))
        );
    };
    return (
        <SeatContext.Provider value={{
            seats, setSeats, handleResetSeat, handleSetSeatPosition
        }}>
            {children}
        </SeatContext.Provider>
    );
};

export const useSeatContext = () => {
    return useContext(SeatContext);
};
