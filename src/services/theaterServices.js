import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getTheaterData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/theater`);
        return response.data;
    } catch (error) {
        console.error('Error fetching on theater:', error);
        throw error;
    }
};

