import axios from 'axios';
import { handleAxiosError } from '../utils/handleError';

export const getUser = async (assignSeatData) => {
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
