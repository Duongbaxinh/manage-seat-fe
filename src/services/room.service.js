import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { URL_SERVER } from '../config';
import { useObjectContext } from '../context/object.context';
import { useSeatContext } from '../context/seat.context';
import { handleAxiosError } from '../utils/handleError';

const DetailRoomService = () => {
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const { seats, setSeats } = useSeatContext();
  const [file, setFile] = useState(null);
  const { objects, setObjects } = useObjectContext();
  const [roomInfo, setRoomInfo] = useState(null);
  const [owner, setOwner] = useState(null);
  const [users, setUser] = useState([]);
  const [userNoSeat, setUserNoSeat] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isDraftLayout, setIsDraftLayout] = useState(false);

  const getDetailRoom = async (roomId) => {
    const token = localStorage.getItem('accessToken');
    const authentication = {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };
    try {
      setLoading(true);
      const res = await axios.get(
        `https://seatmanage-be-v3.onrender.com/room/view/${roomId}`,
        authentication
      );
      const result = res.data.result;
      if (result.image) {
        setPreviewUrl(`${URL_SERVER}${result.image}`);
      }
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
      console.log('run end detail ');
      setLoading(false);
    } catch (error) {
      handleAxiosError(error);
      setLoading(false);
    }
  };

  const getRoomLayoutDraft = async (roomId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const authentication = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };
      setLoading(true);
      const roomResponse = await axios.get(
        `https://seatmanage-be-v3.onrender.com/diagram/${roomId}/draft`,
        authentication
      );
      if (roomResponse.data.image) {
        setPreviewUrl(`${URL_SERVER}${roomResponse.data.image}`);
      }
      setSeats(roomResponse.data.seats);
      setObjects(JSON.parse(roomResponse.data.object) ?? []);
      setLoading(false);
      const seatAvailable =
        roomResponse.data.seats && roomResponse.data.seats.filter((seat) => seat.user === null);
      setRoomInfo({
        name: roomResponse.data.name,
        floor: roomResponse.data.floor,
        hall: roomResponse.data.hall,
        seatAvailable: seatAvailable.length,
        capacity: roomResponse.data.seats.length,
        usersCount: roomResponse.data.usersCount,
      });
    } catch (error) {
      handleAxiosError(error);
      setLoading(false);
    }
  };

  const getRoomLayoutRequest = async (roomId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const authentication = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };
      setLoading(true);
      const roomResponse = await axios.get(
        `https://seatmanage-be-v3.onrender.com/diagram/${roomId}`,
        authentication
      );
      if (roomResponse.data.image) {
        setPreviewUrl(`${URL_SERVER}${roomResponse.data.image}`);
      }

      setSeats(roomResponse.data.seats);
      setObjects(JSON.parse(roomResponse.data.object) ?? []);
      setLoading(false);
      setRoomInfo({
        name: roomResponse.data.name,
        floor: roomResponse.data.floor,
        hall: roomResponse.data.hall,
        seatAvailable: roomResponse.data.seatAvailable,
        capacity: roomResponse.data.capacity,
        usersCount: roomResponse.data.usersCount,
      });
    } catch (error) {
      handleAxiosError(error);
      setLoading(false);
    }
  };

  const getAnalyseRoom = async ({ authentication, roomId }) => {
    const resData = await axios.get(
      `https://seatmanage-be-v3.onrender.com/room/analyse/${roomId}`,
      authentication
    );
    const result = resData.data.result;
    setRoomInfo((prev) => ({
      ...prev,
      seatAvailable: result.seatAvailable,
      capacity: result.capacity,
      usersCount: result.usersCount,
    }));
  };

  const checkIsDraftLayout = async (roomId, authentication) => {
    const checkIsDraftDiagram = await axios.get(
      `https://seatmanage-be-v3.onrender.com/diagram/${roomId}/draft/check`,
      authentication
    );

    setIsDraftLayout(checkIsDraftDiagram.data);
  };

  const handleSaveDiagram = async ({ roomId, draft }) => {
    // console.log('check full :::', roomInfo.capacity);
    // console.log('check full :::', roomInfo.seatAvailable);
    // console.log('check full :::', roomInfo.usersCount);
    try {
      setLoadingProgress(true);
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('roomId', roomId);
      if (file) formData.append('image', file);
      formData.append('seats', JSON.stringify(seats));
      formData.append('name', roomInfo.name);
      formData.append('floor', roomInfo.floor);
      formData.append('hall', roomInfo.hall);
      formData.append('seatAvailable', roomInfo.seatAvailable);
      formData.append('capacity', roomInfo.capacity);
      formData.append('usersCount', roomInfo.usersCount);

      formData.append('object', JSON.stringify(objects));
      if (draft) {
        await axios.post(
          'https://seatmanage-be-v3.onrender.com/room/save/diagram/draft',
          formData,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        await axios.post('https://seatmanage-be-v3.onrender.com/room/save/diagram', formData, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      toast('Send request success!!');
      setIsDraftLayout(true);
      setLoadingProgress(false);
    } catch (error) {
      setLoadingProgress(false);
      handleAxiosError(error);
    }
  };

  const handleSaveDiagramRequest = async (roomId) => {
    try {
      setLoadingProgress(true);
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('roomId', roomId);
      if (file) formData.append('image', file);
      formData.append('seats', JSON.stringify(seats));
      formData.append('name', roomInfo?.name);
      formData.append('floor', roomInfo?.floor);
      formData.append('hall', roomInfo?.hall);
      formData.append('seatAvailable', roomInfo?.seatAvailable ?? 0);
      formData.append('capacity', roomInfo?.capacity ?? 0);
      formData.append('usersCount', roomInfo?.usersCount ?? 0);

      formData.append('object', JSON.stringify(objects));
      console.log('check 1 :: ', seats);
      if (seats.length <= 0 || !seats) return;

      await axios.post(
        'https://seatmanage-be-v3.onrender.com/room/save/diagram/request',
        formData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setIsDraftLayout(true);
      setLoadingProgress(false);
    } catch (error) {
      alert(error);
      setLoadingProgress(false);
      handleAxiosError(error);
    }
  };

  const handleSaveDiagramAuto = async (roomId) => {
    try {
      setLoadingProgress(true);
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('roomId', roomId);
      if (file) formData.append('image', file);
      formData.append('seats', JSON.stringify(seats));
      formData.append('name', roomInfo.name);
      formData.append('floor', roomInfo.floor);
      formData.append('hall', roomInfo.hall);
      formData.append('seatAvailable', roomInfo.seatAvailable);
      formData.append('capacity', roomInfo.capacity);
      formData.append('usersCount', roomInfo.usersCount);
      formData.append('object', JSON.stringify(objects));

      await axios.post('https://seatmanage-be-v3.onrender.com/room/save/diagram/draft', formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsDraftLayout(true);
      setLoadingProgress(false);
    } catch (error) {
      setLoadingProgress(false);
      handleAxiosError(error);
    }
  };

  const fetchDataUser = async (roomId, noSeat = false, authentication) => {
    try {
      if (!roomId) return;
      const userResponse = await axios.get(
        `https://seatmanage-be-v3.onrender.com/room/users/${roomId}?noSeat=${noSeat}`,
        authentication
      );
      if (noSeat) {
        setUserNoSeat(userResponse.data.result);
      } else {
        setUser(userResponse.data.result);
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };
  const fetchDataTeam = async (roomId, authentication) => {
    try {
      if (!roomId) return;
      const teamRes = await axios.get(`https://seatmanage-be-v3.onrender.com/team`, authentication);
      setTeams(teamRes.data.result);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return {
    // use value
    previewUrl,
    seats,
    objects,
    roomInfo,
    owner,
    file,
    users,
    userNoSeat,
    teams,
    loading,
    loadingProgress,
    isDraftLayout,
    // useSet
    setLoading,
    setLoadingProgress,
    setFile,
    setPreviewUrl,
    setSeats,
    setRoomInfo,
    setObjects,
    setOwner,
    setUser,
    setTeams,
    setIsDraftLayout,
    // fetch data
    getDetailRoom,
    fetchDataTeam,
    fetchDataUser,
    // handle room
    handleSaveDiagram,
    handleSaveDiagramRequest,
    getRoomLayoutDraft,
    getAnalyseRoom,
    handleSaveDiagramAuto,
    getRoomLayoutRequest,
    checkIsDraftLayout,
  };
};

export default DetailRoomService;
