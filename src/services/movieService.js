import axios from "axios";

export const getIncomingMovies = async () => {
    try {
        const response = await axios.get('https://localhost:7127/movies/incoming');
        return response.data;
    } catch (error) {
        console.error('Error fetching incoming movies:', error);
        throw error;
    }
};

export const getUpcomingMovies = async () => {
    try {
        const response = await axios.get('https://localhost:7127/movies/upcoming');
        return response.data;
    } catch (error) {
        console.error('Error fetching upcoming movies:', error);
        throw error;
    }
};

