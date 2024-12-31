import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getMemberShip = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/memberShip`);
        return response.data;
    } catch (error) {
        console.error('Error fetching membership data:', error);
        throw error;
    }
};
