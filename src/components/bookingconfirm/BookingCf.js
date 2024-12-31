import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Box, Button, Grid, Card, CardContent, TextField } from "@mui/material";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const BookingConfirm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [user, setUser] = useState({ score: 0, pointsToUse: 0 });
    const [finalPrice, setFinalPrice] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState('');

    useEffect(() => {
        if (!location.state) {
            navigate("/");
            return;
        }
        setBookingData(location.state);
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUser(prev => ({ ...prev, ...decodedToken }));
            fetchScore(decodedToken.ID);
        }
    }, [location.state, navigate]);

    useEffect(() => {
        if (bookingData) {
            calculateFinalPrice();
        }
    }, [user.pointsToUse, bookingData]);

    const fetchScore = async (userId) => {
        try {
            const ScoreResponse = await axios.get(`https://localhost:7127/api/users/scores/${userId}`);
            setUser(prev => ({ ...prev, score: ScoreResponse.data.score }));
        } catch (error) {
            console.error("Error fetching score data:", error);
        }
    };

    const calculateFinalPrice = () => {
        const totalSeatPrice = bookingData.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
        const priceAfterPoints = Math.max(totalSeatPrice - user.pointsToUse, 0);
        setFinalPrice(priceAfterPoints);
    };

    const handlePointsChange = (event) => {
        const points = Math.min(parseInt(event.target.value, 10) || 0, user.score);
        setUser(prev => ({ ...prev, pointsToUse: points }));
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        const payload = {
            movieName: movieSelected.movieNameEnglish,
            cinemaRoom: selectedSeats[0].cinemeRoomName,
            scheduleSeats: selectedSeats.map(seat => ({
                scheduleSeatId: seat.scheduleSeatId,
                seatColumn: seat.seatColumn,
                seatRow: seat.seatRow,
                type: {
                    name: seatTypeMapping.Name,
                    price: seat.price,
                },
                CinemaName: seat.CinemaName,
                reserveUntil: new Date().toISOString(),
            })),
            scheduleShow: showDates,
            scheduleShowTime: selectedShowing?.scheduleTime,
            invoiceMessage: "Movie Ticket Purchase",
            useScore: user.pointsToUse,
            finalPrice: finalPrice,
        };

        try {
            const response = await axios.post("https://localhost:7127/api/payments", payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 200 && response.data.vnp_UrlPayment) {
                // Disable points input and payment button after successfully obtaining payment link
                setIsProcessing(true);
                localStorage.removeItem('payload');
                localStorage.setItem('payload', JSON.stringify(payload));
                // Navigate to the payment URL
                window.location.href = response.data.vnp_UrlPayment;
            } else {
                alert("Payment failed. Please try again.");
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment processing failed, please try again.");
            setIsProcessing(false);
        }
    };

    if (!bookingData) {
        return <Typography>Loading...</Typography>;
    }

    const seatTypeMapping = {
        1: { Name: "NORMAL" },
        2: { Name: "VIP" },
    };
    const { movieSelected, selectedSeats, selectedShowing, showDates } = bookingData;
    return (
        <Box p={4}>
            <Typography variant="h4" align="center" gutterBottom>
                Ticket Information
            </Typography>

            <Card>
                <CardContent>
                    <Typography variant="h6">Movie: {movieSelected.movieNameEnglish}</Typography>
                    <Typography variant="body1">Cinema Room: {selectedSeats[0].cinemeRoomName}</Typography>
                    <Typography variant="body1">
                        Showtime: {selectedShowing.scheduleTime}
                    </Typography>
                    <Typography variant="h6" mt={2}>
                        Selected Seats:
                    </Typography>
                    <Grid container spacing={2}>
                        {selectedSeats.map((seat, index) => (
                            <Grid item xs={6} sm={4} key={index}>
                                <Typography>
                                    {seat.seatColumn}{seat.seatRow} - {seat.price} VND
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                    <Typography variant="h5" mt={2}>
                        Total Price: {finalPrice} VND
                    </Typography>
                    <TextField
                        label="Use Points"
                        type="number"
                        InputProps={{ inputProps: { min: 0, max: user.score } }}
                        value={user.pointsToUse}
                        onChange={handlePointsChange}
                        margin="normal"
                        fullWidth
                        disabled={isProcessing} // Disable input while processing payment
                    />
                    <Typography variant="caption" display="block" gutterBottom>
                        Available Points: {user.score}
                    </Typography>
                </CardContent>
            </Card>

            <Box mt={4} display="flex" justifyContent="space-between">
                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} disabled={isProcessing}>
                    Go Back
                </Button>
                <Button variant="contained" color="primary" onClick={handlePayment} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Proceed to Payment"}
                </Button>
            </Box>
        </Box>
    );
};

export default BookingConfirm;
