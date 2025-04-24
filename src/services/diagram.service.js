import axios from 'axios';

export const switchDraftDiagram = async (roomId) => {
  const token = localStorage.getItem('accessToken');
  const authentication = {
    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
  };
  await axios.get(
    `https://seatmanage-be-v3.onrender.com/diagram/${roomId}/request/switch`,
    authentication
  );
};
