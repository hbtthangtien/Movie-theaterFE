import axios from "axios";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddTheater = () => {
    const [theater, setTheater] = useState({
        name: "",
        email: "",
        place: "",
        phoneNumber: "",
        img: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTheater(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9999/theater', theater);
            alert("Theater added successfully");
            navigate('/admin/theaters');
        } catch (error) {
            console.log('Error adding theater:', error);
        }
    };

    return (
        <Container>
            <h3>Add New Theater</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={theater.name}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={theater.email}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Place</Form.Label>
                    <Form.Control
                        type="text"
                        name="place"
                        value={theater.place}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        name="phoneNumber"
                        value={theater.phoneNumber}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                        type="text"
                        name="img"
                        value={theater.img}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button type="submit" variant="primary">Add Theater</Button>
            </Form>
        </Container>
    );
};

export default AddTheater;
