import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Box, Grid, Card, CardContent, Button } from "@mui/material";
import axios from "axios";

const Tickets = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [ticketData, setTicketData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("payload"));
        
        const urlParams = new URLSearchParams(location.search);
        const invoiceId = urlParams.get("InvoiceId");
        const status = urlParams.get("status");

        if (!storedData || !invoiceId || !status) {
            setErrorMessage("Missing data from localStorage or URL.");
            return;
        }

        if (status === "00") {
            // If payment was successful
            const payload = {
                ...storedData,
                invoiceId: invoiceId,
            };

            // Send API request to fetch ticket details
            const fetchTicketData = async () => {
                try {
                    const response = await axios.post(
                        "https://localhost:7127/api/payments/member/tickets",
                        payload,
                        {
                            headers: {
                                "Content-Type": "application/json-patch+json",
                            },
                        }
                    );
                if (response.status === 200) {
                    setTicketData(payload);
                    
                } else {
                    setErrorMessage("Failed to fetch ticket information.");
                }
            } catch (error) {
                console.error("Error fetching ticket data123344:", error);
                setErrorMessage("An error occurred while fetching ticket data.");
            } finally{
                localStorage.removeItem("payload"); 
            }
        };

            fetchTicketData();
        } else if (status === "02") {
            // If payment failed
            setErrorMessage("Payment was unsuccessful. Please try again.");
        } else {
            setErrorMessage("Invalid payment status.");
        }
    }, [location.search]);

    if (errorMessage) {
        return (
            <Typography color="error" variant="h6" align="center">
                {errorMessage}
            </Typography>
        );
    }

    if (!ticketData) {
        return <Typography>Loading ticket information...</Typography>;
    }

    return (
        <Box p={4}>
            <Typography variant="h4" align="center" gutterBottom>
                Your Tickets
            </Typography>
            <Card>
                <CardContent>
                    <Typography variant="h6">Movie: {ticketData.movieName}</Typography>
                    <Typography variant="body1">Cinema Room: {ticketData.cinemaRoom}</Typography>
                    <Typography variant="body1">Showtime: {ticketData.scheduleShowTime}</Typography>
                    <Typography variant="body1">Show Date: {ticketData.scheduleShow}</Typography>
                    <Typography variant="h6" mt={2}>Selected Seats:</Typography>
                    <Grid container spacing={2}>
                        {ticketData.scheduleSeats.map((seat, index) => (
                            <Grid item xs={6} sm={4} key={index}>
                                <Typography>
                                    Seat: {seat.seatColumn}{seat.seatRow} - {seat.type.name} ({seat.type.price} VND)
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                    <Typography variant="h6" mt={2}>
                        Total Price: {ticketData.finalPrice} VND
                    </Typography>
                </CardContent>
            </Card>
            <Box mt={4} textAlign="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </Button>
            </Box>
        </Box>
    );
};

export default Tickets;
