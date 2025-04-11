import axios from 'axios';
import { useState } from 'react';
import { handleAxiosError } from '../utils/handleError';
import DetailRoomService from './room.service';
import { useObjectContext } from '../context/object.context';

const useSeat = (id) => {
  const { users, setLoading, setSeats, fetchDataUser, getDetailRoom, setObjects } =
    DetailRoomService(id);
  const [userAssign, setUserAssign] = useState(null);
  const [seatAssign, setSeatAssign] = useState(null);
  const { objected } = useObjectContext();
  const [color, setColor] = useState('#ff0000');
  const [isOpen, setIsOpen] = useState(false);
  const createSeat = async (data) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const authentication = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      if (data.userId && (data.userId === null || users.length === 0)) {
        delete data.userId;
      }
      await axios.post(
        'https://seatment-app-be-v2.onrender.com/seat',
        {
          ...data,
          roomId: id,
          posX: 0,
          posY: 0,
        },
        authentication
      );
      await getDetailRoom(authentication);
      setLoading(false);
      setIsOpen(false);
    } catch (error) {
      setLoading(false);
      handleAxiosError(error);
    }
  };

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
    const token = localStorage.getItem('accessToken');
    await axios.put(
      'https://seatment-app-be-v2.onrender.com/seat/assign',
      {
        seatId: seatId,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    fetchDataUser({
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
  };

  const handleReAssign = async (newSeatId, oldSeatId, userId) => {
    const token = localStorage.getItem('accessToken');
    await axios.put(
      'https://seatment-app-be-v2.onrender.com/seat/reassign',
      {
        newSeatId: newSeatId,
        oldSeatId: oldSeatId,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    fetchDataUser({
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
  };

  const handleUnAssign = async (seatId) => {
    if (window.confirm('Are you sure unAssign?')) {
      const token = localStorage.getItem('accessToken');
      await axios.get(`https://seatment-app-be-v2.onrender.com/seat/unassign/${seatId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
      fetchDataUser({
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
    }
  };

  const handleAddObject = (newObject) => {
    setObjects((prev) => [...prev, newObject]);
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
    handleUpdateObject(objected.id, { color: newColor.hex });
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
    createSeat,
    setUserAssign,
    setSeatAssign,
    // handle seat
    handleSetSeatPosition,
    handleResetSeat,
    handleUnassignSeat,
    handleAssign,
    handleReAssign,
    handleUnAssign,
    // handle object
    handleAddObject,
    handleDeleteObject,
    handleUpdateObject,
    handleColor,
  };
};

export default useSeat;
