import { Container, Card, Button } from "react-bootstrap";
import '../../../css/movieCard/MovieCard.css'
import { FaTicketAlt, FaInfo } from "react-icons/fa";
import { useState, useEffect } from "react";
import ModalMovies from "../movieDetailModal/ModalMovies";
import Flickity from 'react-flickity-component';
import 'flickity/css/flickity.css';
import { size } from "lodash";


const MovieCard = ({ movies, title }) => {
    const [modalShow, setModalShow] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const shortenTitle = (title) => {
        return title && title.length > 15    ? title.substring(0, 14 ) + '...' : title;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000 * 60); // Cập nhật mỗi phút
        return () => clearInterval(interval);
    }, []);
    const flickityOptions = {
        initialIndex: 2,
        autoPlay: 1500,
        wrapAround: true,
    };
    const ButtonHandle = ({movie}) => {
        const today = new Date();
        today.setHours(0,0,0,0);
        const from = new Date(movie.fromDate + 'T00:00:00');
        const to = new Date(movie.toDate + 'T00:00:00');
        console.log(from);
        if(today < from){
            return  (<Button onClick={() => handleSelectMovie(movie)} className="transparent-button m-1">
                            <FaInfo /> Detail Information
                    </Button>)
        }else if(from <= today && today <= to){
            return (<>
                <Button onClick={() => handleSelectMovie(movie)} variant="success" className="m-1">
                    <FaTicketAlt /> Buy Ticket
                </Button>
                <Button onClick={() => handleSelectMovie(movie)} className="transparent-button m-1">
                    <FaInfo /> Info
                </Button>
            </>);
        }else{
            return null;
        }
    };
    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
        setModalShow(true);
    };
    const typefilter = (type) => {
        switch (type) {
            case "IMAX":
                return 'danger';
            case "4DX":
                return 'primary';
            case "3D":
                return 'warning';
            default:
                return 'success';
        }
    }
    return (
        <Container fluid className="border-bottom-custom p-4 bg-dark">
            <Container>
                <h2 className="p-4 text-white text-center">{title}</h2>
                <Flickity
                    className={'carousel'}
                    elementType={'div'}
                    options={flickityOptions}
                    disableImagesLoaded={false}
                    reloadOnUpdate
                    static
                >
                    {movies.map((movie) => (
                        <Card className="custom-card bg-dark border-0" key={movie.movieId}>
                            <Card.Img variant="top" src={movie.largeImage || movie.smallImage} alt="Movie Image" />
                            <Card.Body>
                                <Card.Title>
                                    <Button size="sm" className="m-1" variant={typefilter(movie.version)}>{movie.version}</Button>
                                    <Button size="sm" className="transparent-button m-1">{movie.duration}</Button>
                                    {/* <Button size="sm" className="m-1" variant="success">{o.type}</Button> */}
                                </Card.Title>
                                <Card.Text>
                                <h3 style={{ fontSize: '1.5rem' }}>{shortenTitle(movie.movieNameEnglish)}</h3>
                                    <p>Type : {movie.types?.map(t => t.typeName).join(", ")}</p>
                                </Card.Text>
                                <ButtonHandle movie={movie}
                                />
                            </Card.Body>
                        </Card>
                    ))}
                </Flickity>
                {selectedMovie && (
                    <ModalMovies data={selectedMovie} show={modalShow} onHide={() => setModalShow(false)} />
                )}
            </Container>
        </Container>
    );
};

export default MovieCard;
