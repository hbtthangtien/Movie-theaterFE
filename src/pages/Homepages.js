import CarouselM from "../components/homepage/carousel/CarouselM";
import MovieCard from "../components/homepage/movieCard/MovieCard";
import { useState, useEffect } from "react";
import ModalMovies from "../components/homepage/movieDetailModal/ModalMovies";
import { getIncomingMovies, getUpcomingMovies } from "../services/movieService";

const Homepages = () => {
    const [memberShip, setMemberShip] = useState([]);
    const [incomingMovies, setIncomingMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
   
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const incomingData = await getIncomingMovies();
                const upcomingData = await getUpcomingMovies();
                setIncomingMovies(incomingData);
                setUpcomingMovies(upcomingData);
            } catch (error) {
                console.log('Error fetching movie data:', error);
            }
        };
        fetchMovies();
    }, []);

    return (
        <>
            <ModalMovies />
            <CarouselM />
            <MovieCard movies={incomingMovies} title={"NOW SHOWING"} />
            <MovieCard movies={upcomingMovies} title={"UPCOMING"} />
            {/* <MemberShip memberShip={memberShip} /> */}
        </>
    );
}

export default Homepages;