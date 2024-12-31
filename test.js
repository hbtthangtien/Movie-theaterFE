import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Container, Row, Form, Button, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';
import CryptoJS from 'crypto-js';

const Order = () => {
    const { mid } = useParams();
    const [theaters, setTheaters] = useState([]);
    const [movie, setMovie] = useState({});
    const [popCorn, setPopCorn] = useState(false);
    const [foods, setFoods] = useState([]);
    const [foodOrders, setFoodOrders] = useState({});
    const [ticketInfo, setTicketInfo] = useState({
        userId: localStorage.getItem('role') === "user" ? JSON.parse(localStorage.getItem("userLogged")).id : null,
        movieID: mid,
        quantity: 1,
        showTime: "",
        cinema: "",
        showDate: new Date(),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseM = await axios.get(`http://localhost:9999/onTheaterMovies`);
                const responseF = await axios.get(`http://localhost:9999/popCorns`);
                const res = await axios.get('http://localhost:9999/theater');
                setTheaters(res.data);
                const foundMovie = responseM.data.find(p => p.id == mid);
                setMovie(foundMovie);
                setFoods(responseF.data);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        fetchData();
    }, [mid]);

    const handleQuantityChange = (event) => {
        const { value } = event.target;
        setTicketInfo({ ...ticketInfo, quantity: parseInt(value) });
    };

    const handleShowTimeChange = (event) => {
        const { value } = event.target;
        setTicketInfo({ ...ticketInfo, showTime: value });
    };

    const handleCinemaChange = (event) => {
        const { value } = event.target;
        setTicketInfo({ ...ticketInfo, cinema: value });
    };

    const handlePopCornChange = (event) => {
        setPopCorn(event.target.checked);
    };

    const handleFoodQuantityChange = (event, foodId) => {
        const { value } = event.target;
        setFoodOrders({ ...foodOrders, [foodId]: parseInt(value) || 0 });
    };

    const handleDateChange = (date) => {
        setTicketInfo({ ...ticketInfo, showDate: date });
    };

    const calculateTotalAmount = () => {
        let total = ticketInfo.quantity * 250000;

        Object.keys(foodOrders).forEach(foodId => {
            const food = foods.find(f => f.id === parseInt(foodId));
            if (food) {
                total += food.price * (foodOrders[foodId] || 0);
            }
        });

        return total.toLocaleString('vi-VN');
    };

    const handleSubmitOrder = async () => {
        const orderData = {
            ...ticketInfo,
            foods: foodOrders,
            totalAmount: calculateTotalAmount(),
        };

        try {
            const userId = ticketInfo.userId;
            const userResponse = await axios.get(`http://localhost:9999/users/${userId}`);
            const user = userResponse.data;

            const newTotalAmount = user.totalAmount + parseInt(calculateTotalAmount().replace(/\D/g, ''));

            await axios.put(`http://localhost:9999/users/${userId}`, {
                ...user,
                totalAmount: newTotalAmount
            });

            // Prepare data for ZaloPay payment
            const zaloPayData = {
                app_id: "2554",
                app_trans_id: `${new Date().getTime()}`, // Unique transaction ID
                app_user: user.username, // Replace with actual user identifier
                amount: orderData.totalAmount.replace(/\D/g, ''), // Remove non-numeric characters
                app_time: Date.now(), // Unix timestamp in milliseconds
                item: JSON.stringify(orderData.foods),
                description: `Payment for movie tickets - Order #${orderData.app_trans_id}`,
            };

            // Calculate MAC for ZaloPay request
            const data = zaloPayData.app_id + "|" + zaloPayData.app_trans_id + "|" + zaloPayData.app_user + "|" + zaloPayData.amount + "|" + zaloPayData.app_time + "|" + zaloPayData.item;
            zaloPayData.mac = CryptoJS.HmacSHA256(data, "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn").toString();

            // Send request to ZaloPay endpoint
            const response = await axios.post("https://sb-openapi.zalopay.vn/v2/create", zaloPayData);

            // Redirect user to ZaloPay payment page
            window.location.href = response.data.data.zp_trans_url;

        } catch (error) {
            console.error("Error submitting order:", error);
        }
    };

    return (
        <Container fluid className="p-4 bg-dark">
            <Container>
                <h2 className="text-center p-4 text-success">{movie.title}</h2>
                <Row>
                    <Col md={6}>
                        <img src={movie.img} alt={movie.title} style={{ maxWidth: '100%' }} />
                        <p className="pt-3 text-white">{movie.description}</p>
                        <p className="text-white">Director: {movie.director}</p>
                        <p className="text-white">Start Date: {movie.startDate}</p>
                        <p className="text-white">Duration: {movie.time} minutes</p>
                        <p className="text-white">Language: {movie.language}</p>
                    </Col>
                    <Col md={6}>
                        <Form className="mt-4">
                            <Form.Group controlId="quantity">
                                <Form.Label className="text-white">Quantity:</Form.Label>
                                <Form.Control
                                    type="number"
                                    className="transparent-input"
                                    min="1"
                                    value={ticketInfo.quantity}
                                    onChange={handleQuantityChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="showTime">
                                <Form.Label className="text-white">Show Time:</Form.Label>
                                <Form.Control
                                    as="select"
                                    className="transparent-input"
                                    value={ticketInfo.showTime}
                                    onChange={handleShowTimeChange}
                                >
                                    <option value="">Select show time</option>
                                    <option value="7">7:00 AM</option>
                                    <option value="18">6:00 PM</option>
                                    <option value="22">10:00 PM</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="cinema">
                                <Form.Label className="text-white">Select Cinema:</Form.Label>
                                <Form.Control
                                    as="select"
                                    className="transparent-input"
                                    value={ticketInfo.cinema}
                                    onChange={handleCinemaChange}
                                >
                                    <option value="">Select cinema</option>
                                    {
                                        theaters?.map(t => (
                                            <option key={t.id} value={t.name}>{t.name}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="pt-3" controlId="showDate">
                                <Form.Label className="text-white">Select Date :</Form.Label>
                                <DatePicker
                                    selected={ticketInfo.showDate}
                                    onChange={handleDateChange}
                                    minDate={new Date()}
                                    maxDate={addDays(new Date(), 7)}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control transparent-input"
                                />
                            </Form.Group>
                            <Form.Check
                                className="text-white p-4"
                                type="checkbox"
                                label="I want to order food"
                                checked={popCorn}
                                onChange={handlePopCornChange}
                            />
                            {
                                popCorn ? (
                                    <div>
                                        <h4 className="text-white pt-4 pb-2">Select Food:</h4>
                                        <Row className="pb-3">
                                            {foods.map(food => (
                                                <Col sm={6} key={food.id}>
                                                    <Form.Group>
                                                        <Row className="align-items-center">
                                                            <Card className="m-2 bg-dark">
                                                                <Card.Img variant="top" src={food.img} style={{ width: '100%' }} />
                                                                <Card.Body>
                                                                    <Card.Title className="text-white">{food.name}</Card.Title>
                                                                    <Card.Text className="text-white">{food.desc}</Card.Text>
                                                                    <Card.Text className="text-white">Price: {food.price} VND</Card.Text>
                                                                </Card.Body>
                                                                <Form.Control
                                                                    style={{ width: '50px' }}
                                                                    className="transparent-input"
                                                                    size="sm"
                                                                    type="number"
                                                                    min="0"
                                                                    value={foodOrders[food.id] || 0}
                                                                    onChange={(e) => handleFoodQuantityChange(e, food.id)}
                                                                />
                                                            </Card>
                                                        </Row>
                                                    </Form.Group>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                ) : null
                            }
                            <div className="pb-4 text-white">
                                Your Total: <span className="text-success">{calculateTotalAmount()} VND</span>
                            </div>
                            <Button variant="primary" onClick={handleSubmitOrder}>
                                Pay with ZaloPay
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default Order;
