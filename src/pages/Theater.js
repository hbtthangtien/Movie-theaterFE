import axios from "axios";
import { useEffect, useState } from "react";
import { Button,Row, Col, Card, CardBody, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Theater = () => {
    const [theaters, setTheaters] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:9999/theater');
                setTheaters(res.data);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    return (
        <Container fluid className="p-4 bg-dark text-white">
            <Container>
                <h3 className="text-center">About our theater</h3>
                <Row className="pt-4">
                {theaters.map(t => (
                    <Col sm={4}>
                        <Card>
                            <Card.Img src={t.img}/>
                        </Card>
                        <CardBody>
                            <Card.Title>
                                <h3>{t.name.toUpperCase()}</h3>
                            </Card.Title>
                            <div>
                                <Link to={`/theater/${t.id}`} className= "m-2 btn btn-success">Theater Details</Link>
                                <Button className="m-2 transparent-button">Share</Button>
                            </div>
                        </CardBody>
                    </Col>
                ))}
                </Row>
            </Container>
        </Container>
    );
}

export default Theater;