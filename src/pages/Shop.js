import PromoEventM from "./PromoEvent";
import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Container, Row, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Shop = () => {

    const [popCorn, setPopCorn] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseF = await axios.get(`http://localhost:9999/popCorns`);
                setPopCorn(responseF.data);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    return (
        <Container fluid className="pt-4 text-white bg-dark">
            <h1 className="text-center">Buy some stuff</h1>
            <Container>
                <Row className="pb-3">
                    {popCorn.map(food => (
                        <Col sm={3}>
                            <Form.Group>
                                <Row className="align-items-center">
                                    <Card className="m-2 bg-dark">
                                        <Card.Img variant="top" src={food.img} style={{ width: '100%' }} />
                                        <Card.Body>
                                            <Card.Title className="text-white">{food.name}</Card.Title>
                                            <Card.Text className="text-white">{food.desc}</Card.Text>
                                            <Card.Text className="text-white">Price: {food.price} VND</Card.Text>
                                            <Link to={localStorage.getItem('role') === "user" ? "/" : "/login"} className="btn btn-success">Order now</Link>
                                        </Card.Body>
                                    </Card>
                                </Row>
                            </Form.Group>
                        </Col>
                    ))}
                </Row>
            </Container>
            <PromoEventM />
        </Container>
    );
}

export default Shop;