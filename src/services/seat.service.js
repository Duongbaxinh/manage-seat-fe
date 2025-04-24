import { useState } from 'react';
import { useObjectContext } from '../context/object.context';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import DetailRoomService from './room.service';

const useSeat = () => {
  const { setSeats, setObjects } = DetailRoomService();
  const [userAssign, setUserAssign] = useState(null);
  const [seatAssign, setSeatAssign] = useState(null);
  const { objected } = useObjectContext();
  const [color, setColor] = useState('#ff0000');
  const [isOpen, setIsOpen] = useState(false);
  const [isOY, setIsOY] = useState(false);
  const [isOX, setIsOX] = useState(false);

  useKeyboardShortcuts((action, type) => {
    if (action === 'shift' && type === 'keydown') setIsOY(true);
    if (action === 'shift' && type === 'keyup') setIsOY(false);
    if (action === 'ctrl+shift' && type === 'keydown') setIsOX(true);
    if ((action === 'shift' || action === 'ctrl') && type === 'keyup') setIsOX(false);
  });

  const handleSetSeatPosition = (seatId, position) => {
    // await axios.post(
    //   'https://seatmanage-be-v3.onrender.com/seat',
    //   {
    //     name: 'S102',
    //     description: 'description seat 2',
    //     typeSeat: 'TEMPORARY',
    //     seatTypeId: '7bcca31f-4dc9-44e8-ad70-5e129c9eddd1',
    //     roomId: '6be7f52f-3caa-47c7-8ca1-9995545f2cd0',
    //   },
    //   {
    //     headers: {
    //       Authorization:
    //         'Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ5b3VyLWFwcCIsInN1YiI6InN1cGVydXNlciIsImV4cCI6MTc0NTQxMDE1MywiaWF0IjoxNzQ1MDUwMTUzfQ.7uKdPRL2NOU_NBID6cJKlkMYkMJJkXnSD23AvHs0fkRp8A7KvRHjbL-dj7dr9PFdyt1kjaTmUQ5O46J9rIx65g',
    //     },
    //   }
    // );
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

  const handleAddObject = (newObject) => {
    setObjects((prev) => [...prev, { ...newObject, id: Date.now() }]);
  };

  const handleUpdateObject = (objectId, updates) => {
    setObjects((prev) =>
      prev.map((item) => (item.id === objectId ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteObject = (objectId) => {
    setObjects((prev) => prev.filter((item) => item.id !== objectId));
  };

  const handleColor = (newColor) => {
    if (!objected) return;
    setColor(newColor);
    handleUpdateObject(objected.id, { color: newColor });
  };

  return {
    isOpen,
    userAssign,
    seatAssign,
    color,
    objected,
    // use set
    setColor,
    setIsOpen,
    setUserAssign,
    setSeatAssign,
    // handle seat
    handleSetSeatPosition,
    // handle object
    handleAddObject,
    handleDeleteObject,
    handleUpdateObject,
    handleColor,
  };
};

export default useSeat;
