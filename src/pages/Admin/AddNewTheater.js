import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const AddTheater = () => {
    const [theater, setTheater] = useState({
        cinemeRoomName: '',
        seatQuantity: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTheater((prevTheater) => ({
            ...prevTheater,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://localhost:7127/api/manager/cinemarooms/cinemaroom', theater);
            window.alert('Theater added successfully');
            navigate('/admin/theaters');
        } catch (error) {
            console.error('Error adding theater:', error);
            window.alert('Error adding theater. Please try again.');
        }
    };

    return (
        <Container className="p-4 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            <Card style={{ width: '40rem', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 8px', backgroundColor:'#fff'}}>
                <Card.Body>
                <Link to="/admin/theaters">
          <Button variant="secondary">Back</Button>
                </Link>
                    <h3 className="text-center text-primary mb-4">Add New Theater</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-2">
                            <Form.Label style={{ color: 'black' }}>CinemeRoom Name: </Form.Label>
                            <Form.Control
                                type="text"
                                name="cinemeRoomName"
                                value={theater.cinemeRoomName}
                                onChange={handleChange}
                                placeholder="Enter theater name"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: 'black' }}>Seat Quantity: </Form.Label>
                            <Form.Control
                                type="number"
                                name="seatQuantity"
                                value={theater.seatQuantity}
                                onChange={handleChange}
                                placeholder="Enter seat quantity"
                                required
                            />
                        </Form.Group>
                        <div className="d-grid">
                            <Button variant="success" type="submit">
                                Add Theater
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddTheater;
