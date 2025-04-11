import { useCallback, useEffect, useState } from 'react';
import { handleAxiosError } from '../utils/handleError';
import axios from 'axios';
import { useObjectContext } from '../context/object.context';
import { useSeatContext } from '../context/seat.context';

const DetailRoomService = (id) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const { seats, setSeats } = useSeatContext();
  const [file, setFile] = useState(null);
  const { objects, setObjects } = useObjectContext();
  const [roomInfo, setRoomInfo] = useState(null);
  const [owner, setOwner] = useState(null);
  const [users, setUser] = useState([]);
  const [teams, setTeams] = useState([]);

  console.log('seat current ', seats);
  const getDetailRoom = useCallback(
    async (authentication) => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://seatment-app-be-v2.onrender.com/room/view/${id}`,
          authentication
        );
        const result = res.data.result;

        setPreviewUrl(result.image);
        setOwner(result.chief);
        setSeats(result.seats);
        setObjects(JSON.parse(result.object) ?? []);
        setRoomInfo({
          name: result.name,
          floor: result.floor,
          hall: result.hall,
          seatAvailable: result.seatAvailable,
          capacity: result.capacity,
          usersCount: result.usersCount,
        });
        setLoading(false);
      } catch (error) {
        handleAxiosError(error);
        setLoading(false);
      }
    },
    [id]
  );
  const handleSaveDiagram = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('roomId', id);
      if (file) formData.append('image', file);
      formData.append('seats', JSON.stringify(seats));
      formData.append('name', roomInfo.name);
      formData.append('floor', roomInfo.floor);
      formData.append('hall', roomInfo.hall);

      formData.append('object', JSON.stringify(objects));

      await axios.post('https://seatment-app-be-v2.onrender.com/room/save/diagram', formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleAxiosError(error);
    }
  };

  const fetchDataUser = useCallback(
    async (authentication) => {
      try {
        if (!id) return;
        const userResponse = await axios.get(
          `https://seatment-app-be-v2.onrender.com/room/users/${id}`,
          authentication
        );
        setUser(userResponse.data.result);
      } catch (error) {
        handleAxiosError(error);
      }
    },
    [id]
  );
  const fetchDataTeam = useCallback(
    async (authentication) => {
      try {
        if (!id) return;
        const teamRes = await axios.get(
          `https://seatment-app-be-v2.onrender.com/team`,
          authentication
        );
        setTeams(teamRes.data.result);
      } catch (error) {
        handleAxiosError(error);
      }
    },
    [id]
  );
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const authentication = {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };
    if (id) {
      getDetailRoom(authentication);
      fetchDataTeam(authentication);
      fetchDataUser(authentication);
    }
  }, [fetchDataTeam, fetchDataUser, getDetailRoom, id]);

  return {
    // use value
    previewUrl,
    seats,
    objects,
    roomInfo,
    owner,
    loading,
    file,
    users,
    teams,
    // useSet
    setLoading,
    setFile,
    setPreviewUrl,
    setSeats,
    setRoomInfo,
    setObjects,
    setOwner,
    setUser,
    setTeams,
    // fetch data
    getDetailRoom,
    fetchDataTeam,
    fetchDataUser,
    // handle room
    handleSaveDiagram,
  };
};

export default DetailRoomService;
