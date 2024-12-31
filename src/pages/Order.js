import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Col, Container, Row } from "react-bootstrap";
import { SeatWrap } from '../components/seat/Seat.js'
import Countdown from "../components/Real-time/CountDown.js";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { styled } from '@mui/material/styles';

const LegendSeat = styled(Box)(({ theme, color }) => ({
    width: 30,
    height: 30,
    backgroundColor: color,
    border: '1px solid #000',
    borderRadius: 4,
    display: 'inline-block',
    marginRight: theme.spacing(1),
}));
const Order = () => {
    const { mid } = useParams();
    const navigate = useNavigate();
    const [showDates, setShowDates] = useState([]);
    const [showTimes, setShowTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedShowing, setSelectedShowing] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [movieSelected, setMovieSelected] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [seats, setSeats] = useState([]);
    const [connection, setConnection] = useState(null);
    const [reverseUntil, setreverseUntil] = useState(null);

    useEffect(() => {
        const userLogged = JSON.parse(localStorage.getItem('userLogged'));
        setUser(userLogged);

        // Khôi phục dữ liệu sau reload
        const savedSelectedSeats = localStorage.getItem('selectedSeats');
        const savedReverseUntil = localStorage.getItem('reverseUntil');
        if (savedSelectedSeats) {
            setSelectedSeats(JSON.parse(savedSelectedSeats));
        }
        if (savedReverseUntil) {
            setreverseUntil(savedReverseUntil);
            // Nếu có dữ liệu saved, có thể mở modal ngay nếu muốn, 
            // nhưng ở đây không mở modal tự động, chỉ khôi phục dữ liệu.
        }

        const fetchMovieData = async () => {
            try {
                const movieResponse = await axios.get(`https://localhost:7127/api/movies/${mid}`);
                setMovieSelected(movieResponse.data);
            } catch (error) {
                console.error("Error fetching movie data:", error);
            }
        };

        const fetchShowDates = async () => {
            try {
                const datesResponse = await axios.get(`https://localhost:7127/api/movies/showsday/${mid}`);
                setShowDates(datesResponse.data);
            } catch (error) {
                console.error("Error fetching show dates:", error);
            }
        };

        fetchMovieData();
        fetchShowDates();
    }, [mid]);

    useEffect(() => {
        const con = new HubConnectionBuilder()
            .withUrl("https://localhost:7127/seathub")
            .withAutomaticReconnect()
            .build();
        con.start()
            .then(() => console.log("Connected to the SignalR hub"))
            .catch(err => console.error('Error connecting to the hub:', err));
        con.on("updateSeat", response => {
            setSeats(prevSeats => {
                const seats = { ...prevSeats };
                [...response].forEach(i => {
                    Object.values(seats).forEach(e => {
                        if (i.scheduleSeatId === e.scheduleSeatId) {
                            e.seatStatus = i.seatStatus;
                        }
                    });
                });
                return seats;
            });
        });
        con.on("reserveSeat", response => {
            setSeats(prevSeats => {
                const seats = { ...prevSeats };
                [...response].forEach(i => {
                    Object.values(seats).forEach(s => {
                        if (s.scheduleSeatId === i) {
                            s.seatStatus = 'EMPTY';
                        }
                    });
                });
                return seats;
            });
        });
        con.on("confirmSeat", response =>{
            //console.log('confirmSeat');
            setSeats(prevSeats =>{
                const seats = {...prevSeats};
                [...response].forEach(i => {
                    Object.values(seats).forEach(seat =>{
                        if(seat.scheduleSeatId === i.scheduleSeatId){
                            seat.seatStatus = 'SUCCESS';
                        }
                    });
                });
                return seats;
            });
        });
        setConnection(con);
        return () => con.stop();
    }, []);

    const fetchSeats = async (schId) => {
        try {
            const seatsResponse = await axios.get(`https://localhost:7127/api/movies/seats/${mid}/${schId}`);
            const [showtime] = seatsResponse.data;
            const roomName = showtime.cinemeRoomName;
            console.log(roomName);
            setSeats(showtime?.scheduleSeats ?? []);
            fetchSelectedSeats(schId, roomName);
        } catch (error) {
            console.error("Error fetching seats data:", error);
        }
    };

    const fetchSelectedSeats = async (schId, roomName) => {
        try {
            const dataResponse = await axios.get(`https://localhost:7127/api/movies/ScheduleSeats/${mid}/${schId}`);
            const data = dataResponse.data;
            const prevData = data.map(e => ({
                cinemeRoomName: roomName,
                movieId: mid,
                reverseUntil: e.reservedUntil,
                price: e.seatType.price,
                scheduleSeatId: e.scheduleSeatId,
                seatColumn: e.seatColumn,
                seatId: e.seatId,
                seatRow: e.seatRow,
                seatStatus: e.seatStatus,
                seatType_id: e.seatType.seatTypeId,
                scheduleId: e.scheduleId
            }));
            if (prevData.length > 0) {
                setreverseUntil(prevData[0].reverseUntil);
                setSelectedSeats(prevData);
                console.log('=====================');
                console.log(seats);
                console.log(selectedSeats);

                setModalOpen(true);
            }
            console.log(prevData);
        } catch (error) {
            console.error("Error fetching selected seats data:", error);
        }
    };


    const fetchShowTimes = async (date) => {
        try {
            const timesResponse = await axios.get(`https://localhost:7127/api/movies/showstime/${mid}/${date}`);
            setShowTimes(timesResponse.data);
            console.log(timesResponse.data);
        } catch (error) {
            console.error("Error fetching showtimes:", error);
        }
    };

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        setSelectedDate(selectedDate);
        fetchShowTimes(selectedDate);
        setSelectedShowing(null);
        setSelectedSeats([]);
        setTotalPrice(0);
        // Xóa dữ liệu localStorage khi thay đổi ngày để tránh nhầm lẫn
        localStorage.removeItem('selectedSeats');
        localStorage.removeItem('reverseUntil');
    };

    const handleSelectShowtime = (showtime) => {
        setSelectedShowing(showtime);
        fetchSeats(showtime.scheduleId);
        setSelectedSeats([]);
        setTotalPrice(0);
        // Khi chọn suất chiếu mới, xóa dữ liệu cũ
        localStorage.removeItem('selectedSeats');
        localStorage.removeItem('reverseUntil');
    };

    const toggleSeatSelection = (seat) => {
        if (seat.isBooked) return;

        const isSelected = selectedSeats.find(s => s.class === seat.class && s.number === seat.number);

        const updatedSeats = isSelected
            ? selectedSeats.filter(s => !(s.class === seat.class && s.number === seat.number))
            : [...selectedSeats, seat];
        setSelectedSeats(updatedSeats);
        calculateTotalPrice(updatedSeats);
    };

    const calculateTotalPrice = (selectedSeats) => {
        let totalPrice = selectedSeats.reduce((total, seat) => {
            const seatClass = selectedShowing?.seats?.find(s => s.class === seat.class);
            return total + (seatClass ? seatClass.price : 0);
        }, 0);
        setTotalPrice(totalPrice);
    };

    const handleOrder = async () => {
        if (selectedSeats.length === 0) {
            setError('Please select at least one seat.');
            return;
        }
        try {
            const datesResponse = await axios.post(`https://localhost:7127/api/movies/seats`, selectedSeats);
            console.log(datesResponse);
            const reverse = datesResponse.data.scheduleSeats[0].reverseUntil;
            console.log(reverse);
            setSelectedSeats(prev => {
                return prev.map(seat => {
                    return {
                        ...seat,
                        reverseUntil: reverse,
                        seatStatus: 'HOLD'
                    };
                });
            });
            setreverseUntil(reverse);
            console.log('-------------');
            console.log(selectedSeats);
            console.log(seats);
            setError('');
            setModalOpen(true);
        } catch (error) {
            setError(error.response.data.statusMessage + '! Please choose another seats');
            handleHoldSeat();
            console.error("Error fetching show dates:", error);
        }
    };

    const handleModalClose = async () => {
        try {
            const seatTypeMapping = {
                1: { Name: "NORMAL", price: 200 },
                2: { Name: "VIP", price: 250 },
            };

            const payload = selectedSeats.map(seat => ({
                ScheduleSeatId: seat.scheduleSeatId,
                seatColumn: seat.seatColumn,
                seatRow: seat.seatRow,
                seatType: seatTypeMapping[seat.seatType_id] || { Name: "UNKNOWN", price: 0 },
                seatStatus: seat.seatStatus,
                CinemaName: seat.CinemaName,
            }));
            const listId = selectedSeats.map(e => e.scheduleSeatId);
            console.log('cancel seat');
            console.log(payload);
            connection.invoke("ReserveUntil", listId)
                .catch(err => console.error('Error sending seat selections:', err));
            setModalOpen(false);
        } catch (error) {
            console.error('Error releasing seats:', error);
            alert('Failed to release seats. Please try again.');
        }
    };

    const handleSelectSeat = (seat) => {
        setSelectedSeats(prev => {
            const newSelectedSeats = [...prev];
            const seatIndex = newSelectedSeats.findIndex(s => s.seatId == seat.seatId);
            if (seatIndex !== -1) {
                newSelectedSeats.splice(seatIndex, 1);
            } else {
                newSelectedSeats.push(seat);
            }
            console.log(seatIndex);
            console.log(newSelectedSeats);
            return newSelectedSeats;
        });
    };
    const handleHoldSeat = () => {
        setSelectedSeats(prev => {
            const newSelectedSeats = [...prev].filter(s => s.seatStatus === 'EMPTY');
            return newSelectedSeats
        });
    }

    const handlePayments = () => {
        const role = localStorage.getItem('role')?.toLowerCase() || "";
        if (role === 'member') {
            navigate("/payments", {
                state: {
                    movieSelected,
                    showDates: selectedDate,
                    selectedSeats,
                    selectedShowing,
                    totalPrice,
                    user,
                },
            });
        } else if (role === 'employee') {
            navigate("/confirm", {
                state: {
                    movieSelected,
                    showDates: selectedDate,
                    selectedSeats,
                    selectedShowing,
                    totalPrice,
                    user,
                },
            });
        } else {
            console.log("Unauthorized or unknown role trying to execute payment.");
        }
    };

    const price = useMemo(() => {
        return selectedSeats.reduce((acc, { price }) => {
            return acc += price;
        }, 0)
    }, [selectedSeats]);

    return (
        <Container fluid className="bg-dark text-light order-container">
            <Row className="order-header">
                <Col md={4}>
                    <img src={movieSelected.smallImage} alt="Movie" className="movie-poster" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Col>
                <Col md={8}>
                    <Typography variant="h4" className="text-success text-center my-4">Order Tickets for {movieSelected.movieNameEnglish}</Typography>

                    <select value={selectedDate} onChange={handleDateChange} className="date-picker">
                        <option value="">Select Date</option>
                        {showDates.map(date => (
                            <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>
                        ))}
                    </select>
                    <Box mt={4} className="showing-times">
                        {showTimes.map((showTime) => (
                            <Button
                                key={showTime.id}
                                variant={selectedShowing?.id === showTime.id ? "contained" : "outlined"}
                                onClick={() => handleSelectShowtime(showTime)}
                            >
                                {showTime.scheduleTime}
                            </Button>
                        ))}
                    </Box>
                    <div className="screen" id="screen">Screen</div>
                    <SeatWrap selectedSeats={selectedSeats} seats={seats} onSelect={handleSelectSeat} />
                    {/* Legend Section */}
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ marginTop: '50px' }}
                    >
                        <Box display="flex" alignItems="center" mr={2}>
                            <LegendSeat color="red" />
                            <Typography variant="body2">SOLD</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mr={2}>
                            <LegendSeat color="yellow" />
                            <Typography variant="body2">HOLD</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mr={2}>
                            <LegendSeat color="grey" />
                            <Typography variant="body2">EMPTY</Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <LegendSeat color="green" />
                            <Typography variant="body2">SELECTING</Typography>
                        </Box>
                    </Box>
                    {/* End of Legend Section */}
                    {error && (<Typography variant="body2" color="error" align="center">{error}</Typography>)}
                    <div className="d-flex justify-content-between align-items-center">
                        <Typography variant="h6">Total Price: {price} VND</Typography>
                        <Button variant="contained" color="primary" onClick={handleOrder}>Checkout</Button>
                    </div>
                </Col>
            </Row>

            <Dialog open={modalOpen} onClose={handleModalClose}>
                <DialogTitle>Thông tin đơn hàng</DialogTitle>
                <DialogContent>
                    <Countdown targetDate={reverseUntil} onComplete={handleModalClose} />
                    <ul>
                        {selectedSeats.map(seat => (<li key={seat.seatId}>{seat.seatColumn}{seat.seatRow}</li>))}
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="secondary">Đóng</Button>
                    <Button color="primary" variant="contained" onClick={handlePayments} >Thanh toán</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Order;
