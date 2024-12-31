import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Box, Grid, Card, CardContent, Button } from "@mui/material";

const TicketDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve ticket data from location state
    const ticketData = location.state;

    if (!ticketData) {
        return (
            <Typography variant="h6" color="error" align="center">
                No ticket information found. Please return to the previous page.
            </Typography>
        );
    }

    const {
        movieName,
        cinemaRoom,
        scheduleShow,
        scheduleShowTime,
        selectedSeats,
        finalPrice,
        qrCodeUrl,
    } = ticketData;

    return (
        <Box p={4}>
            <Typography variant="h4" align="center" gutterBottom>
                Your Movie Ticket
            </Typography>
            <Card>
                <CardContent>
                    <Typography variant="h6"><strong>Movie:</strong> {movieName}</Typography>
                    <Typography variant="body1"><strong>Cinema Room:</strong> {cinemaRoom}</Typography>
                    <Typography variant="body1"><strong>Show Date:</strong> {scheduleShow}</Typography>
                    <Typography variant="body1"><strong>Show Time:</strong> {scheduleShowTime}</Typography>
                    <Typography variant="h6" mt={2}>Selected Seats:</Typography>
                    <Grid container spacing={2}>
                        {ticketData?.scheduleSeats?.length > 0 ? (
                            ticketData.scheduleSeats.map((seat, index) => (
                                <Grid item xs={6} sm={4} key={index}>
                                    <Typography>
                                        Seat: {seat.seatColumn}{seat.seatRow} - ({seat.type.price} VND)
                                    </Typography>
                                </Grid>
                            ))
                        ) : (
                            <Typography>No seats selected or data is missing.</Typography>
                        )}
                    </Grid>

                    <Typography variant="h6" mt={2}><strong>Total Price:</strong> {finalPrice} VND</Typography>
                    {qrCodeUrl && (
                        <Box mt={4} textAlign="center">
                            <Typography variant="h6">Scan QR Code to Pay:</Typography>
                            <img src={qrCodeUrl} alt="QR Code" style={{ width: 200, height: 200 }} />
                        </Box>
                    )}
                </CardContent>
            </Card>
            <Box mt={4} textAlign="center">
                <Button variant="contained" color="primary" onClick={() => navigate("/")}>
                    Back to Home
                </Button>
            </Box>
        </Box>
    );
};

export default TicketDetails;
