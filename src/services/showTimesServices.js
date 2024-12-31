import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getShowtimesData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/showTimes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching on showtime:', error);
        throw error;
    }
};

