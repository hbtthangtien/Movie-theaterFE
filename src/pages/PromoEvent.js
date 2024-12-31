import { Container, Spinner, Alert } from "react-bootstrap";
import PromoEvent from "../components/promoEvent/PromoEvent";
import { useEffect, useState } from 'react';
import axios from 'axios';

const PromoEventM = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Adjusted API call to fetch only events
                const res = await axios.get("https://localhost:7127/api/Promotion/all");
                setEvents(res.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" variant="light" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <Container fluid className="p-4 bg-dark">
            <Container>
                <h1 className="pt-4 text-center text-white"><strong>DISCOVER OUR EVENTS</strong></h1>  
                <PromoEvent className="p-4" events={events} detail={"EVENTS"} />
            </Container>
        </Container>
    );
};

export default PromoEventM;