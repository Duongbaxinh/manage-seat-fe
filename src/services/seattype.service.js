import axios from 'axios';
import { handleAxiosError } from '../utils/handleError';

export const addSeat = async (seatData) => {
  try {
    const token = localStorage.getItem('accessToken');

    const data = await axios.post(
      'https://seatmanage-be-v3.onrender.com/seat',
      { ...seatData },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    return data.data.result;
  } catch (error) {
    handleAxiosError(error);
  }
};
export const removeSeat = async (seatId) => {
  try {
    const token = localStorage.getItem('accessToken');

    const data = await axios.delete(`https://seatmanage-be-v3.onrender.com/seat/${seatId}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    return data.data.result;
  } catch (error) {
    handleAxiosError(error);
  }
};
export const assignSeat = async (assignSeatData) => {
  try {
    const token = localStorage.getItem('accessToken');

    const data = await axios.put(
      `https://seatmanage-be-v3.onrender.com/seat/assign`,
      {
        ...assignSeatData,
      },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    return data.data.result;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const reAssignSeat = async ({ seatId, newUserId, userId, typeSeat, expiration }) => {
  const token = localStorage.getItem('accessToken');
  await axios.put(
    'https://seatmanage-be-v3.onrender.com/seat/reassign',
    {
      seatId: seatId,
      userId: userId,
      newUserId: newUserId,
      typeSeat: typeSeat,
      expiration: expiration,
    },
    {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    }
  );
};

export const unAssignSeat = async (seatId) => {
  const token = localStorage.getItem('accessToken');
  await axios.get(`https://seatmanage-be-v3.onrender.com/seat/unassign/${seatId}`, {
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
};
export const switchSeat = async ({ seatId, userIdSwitch, seatSelected }) => {
  const token = localStorage.getItem('accessToken');
  await axios.post(
    `https://seatmanage-be-v3.onrender.com/seat/switch`,
    {
      seatId: seatId,
      userIdSwitch: userIdSwitch,
      seatIdSwitch: seatSelected,
    },
    {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    }
  );
};

export const addSeatType = async (seatData) => {
  try {
    const token = localStorage.getItem('accessToken');
    const data = await axios.post(
      'https://seatmanage-be-v3.onrender.com/seat-type',
      { ...seatData },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    return data.data.result;
  } catch (error) {
    return handleAxiosError(error);
  }
};
export const removeSeatType = async (id) => {
  try {
    const token = localStorage.getItem('accessToken');

    const data = await axios.delete(`https://seatmanage-be-v3.onrender.com/seat-type/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    return data.data.result;
  } catch (error) {
    handleAxiosError(error);
  }
};
