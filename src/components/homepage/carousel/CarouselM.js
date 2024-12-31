import { useState, useEffect } from "react";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import '../../../css/carousel/Carousel.css'

const CarouselM = () => {
    const [carousels, setCarousels] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9999/carousel');
                setCarousels(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <Carousel>
            {carousels.map((c, index) => (
                <Carousel.Item>
                <img className="d-block w-100" key={index} src={c.src} alt={`carousel-${index}`} />
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default CarouselM;
