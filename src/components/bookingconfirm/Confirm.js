import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Box, Button, Grid, Card, CardContent, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import axios from "axios";

const Confirm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [user, setUser] = useState({ score: 0, pointsToUse: 0 });
    const [finalPrice, setFinalPrice] = useState(0);
    const [accountId, setAccountId] = useState(""); // Input for Member Account ID
    const [memberInfo, setMemberInfo] = useState(null); // Member information
    const [qrCodeUrl, setQrCodeUrl] = useState(""); // QR Code URL
    const [invoiceId, setInvoiceId] = useState("");
    const [useScoreOption, setUseScoreOption] = useState("agree"); // Default to agree
    const [isQrGenerated, setIsQrGenerated] = useState(false); // Status for QR code generation

    useEffect(() => {
        if (!location.state) {
            navigate("/");
            return;
        }
        setBookingData(location.state);
    }, [location.state, navigate]);

    useEffect(() => {
        if (bookingData) {
            calculateFinalPrice();
        }
    }, [bookingData, user.pointsToUse, useScoreOption]);

    const calculateFinalPrice = () => {
        if (!bookingData) return;
        const totalSeatPrice = bookingData.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
        const priceAfterPoints = memberInfo && useScoreOption === "agree"
            ? Math.max(totalSeatPrice - user.pointsToUse, 0)
            : totalSeatPrice;
        setFinalPrice(priceAfterPoints);
    };

    const handlePointsChange = (event) => {
        const pointsToUse = Math.min(parseInt(event.target.value, 10) || 0, user.score);
        setUser(prev => ({ ...prev, pointsToUse }));
    };

    const handleUseScoreOptionChange = (event) => {
        const value = event.target.value;
        setUseScoreOption(value);
        if (value === "disagree") {
            setUser(prev => ({ ...prev, pointsToUse: 0 }));
        }
    };

    const handleMemberIdChange = (event) => {
        setAccountId(event.target.value);
    };



    const handleCheckMember = async () => {
        try {
            const response = await axios.get(`https://localhost:7127/api/users/${accountId}`);
            setMemberInfo(response.data);
            setUser(prev => ({ ...prev, score: response.data.score }));
        } catch (error) {
            console.error("Error fetching member data:", error);
            alert("Member not found. Please check the member ID and try again.");
        }
    };

    const handleQrCodeGeneration = async () => {
        setIsProcessing(true);
        if (!bookingData) return;

        const payload = {
            movieName: bookingData.movieSelected.movieNameEnglish,
            cinemaRoom: bookingData.selectedSeats[0].cinemeRoomName,
            scheduleSeats: bookingData.selectedSeats.map(seat => ({
                scheduleSeatId: seat.scheduleSeatId,
                seatColumn: seat.seatColumn,
                seatRow: seat.seatRow,
                type: {
                    name: "NORMAL",
                    price: seat.price,
                },
                reserveUntil: new Date().toISOString(),
            })),
            scheduleShow: bookingData.showDates,
            scheduleShowTime: bookingData.selectedShowing?.scheduleTime,
            isUseScore: !!memberInfo, // isUseScore is true only if memberInfo exists
            useScore: memberInfo && useScoreOption === "agree" ? user.pointsToUse : 0,
            member: accountId || null,
            confirm: !!memberInfo, // Confirm is true only if member information exists
        };

        try {
            const response = await axios.post("https://localhost:7127/api/payments/employee/generateQr", payload, {
                headers: { 'Content-Type': 'application/json-patch+json' }
            });
            if (response.status === 200 && response.data.qrCode?.data?.qrDataUrl) {
                setQrCodeUrl(response.data.qrCode.data.qrDataUrl);
                setInvoiceId(response.data.invoiceId);
                setIsQrGenerated(true);
            } else {
                alert("QR Code generation failed. Please try again.");
                setIsQrGenerated(false);
            }
        } catch (error) {
            console.error("QR Code generation error:", error);
            alert("QR Code generation failed, please try again.");
            setIsQrGenerated(false);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmPayment = async () => {
        setIsProcessing(true);
        if (!bookingData) return;

        const payload = {
            movieName: bookingData.movieSelected.movieNameEnglish,
            cinemaRoom: bookingData.selectedSeats[0].cinemeRoomName,
            scheduleSeats: bookingData.selectedSeats.map(seat => ({
                scheduleSeatId: seat.scheduleSeatId,
                seatColumn: seat.seatColumn,
                seatRow: seat.seatRow,
                type: {
                    name: "NORMAL",
                    price: seat.price,
                },
                reserveUntil: new Date().toISOString(),
            })),
            scheduleShow: bookingData.showDates,
            scheduleShowTime: bookingData.selectedShowing?.scheduleTime,
            isUseScore: !!memberInfo, // isUseScore is true only if memberInfo exists
            useScore: memberInfo && useScoreOption === "agree" ? user.pointsToUse : 0,
            member: memberInfo?.memberId || null,
            confirm: !!memberInfo,
            invoiceId: invoiceId,
            finalPrice: finalPrice
        };

        try {
            const response = await axios.put("https://localhost:7127/api/payments/employee/confirm", payload, {
                headers: { 'Content-Type': 'application/json-patch+json' }
            });
            if (response.status === 200) {
                alert("Payment confirmed successfully!");
                navigate("/ticket-details", { state: payload });
            } else {
                alert("Payment confirmation failed. Please try again.");
            }
        } catch (error) {
            console.error("Payment confirmation error:", error);
            alert("Payment confirmation failed, please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Box p={4}>
            <Typography variant="h4" align="center" gutterBottom>
                Ticket Information
            </Typography>

            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Movie:</strong> {bookingData?.movieSelected?.movieNameEnglish} </Typography>
                            <Typography variant="body1"><strong>Screen:</strong> {bookingData?.selectedSeats?.[0]?.cinemeRoomName}</Typography>
                            <Typography variant="body1"><strong>Date:</strong> {bookingData?.showDates}</Typography>
                            <Typography variant="body1"><strong>Time:</strong> {bookingData?.selectedShowing?.scheduleTime}</Typography>
                            <Typography variant="h6" mt={2}>Selected Seats:</Typography>
                            <Grid container spacing={2}>
                                {bookingData?.selectedSeats?.map((seat, index) => (
                                    <Grid item xs={6} sm={4} key={index}>
                                        <Typography>
                                            {seat.seatColumn}{seat.seatRow} - {seat.price} VND
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                            <Typography variant="h6" mt={2}><strong>Total:</strong> {finalPrice} VND</Typography>
                            {qrCodeUrl && (
                                <Box mt={2} textAlign="center">
                                    <Typography variant="h6">Scan QR Code to Pay:</Typography>
                                    <img src={qrCodeUrl} alt="Payment QR Code" style={{ width: 200, height: 200 }} />
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Member Information</Typography>
                            <TextField
                                label="Account ID or IdentityCard"
                                value={accountId}
                                onChange={handleMemberIdChange}
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" onClick={handleCheckMember}>
                                Check Member Info
                            </Button>
                            {memberInfo && (
                                <>
                                    <TextField
                                        label="Member ID"
                                        value={memberInfo.memberId}
                                        fullWidth
                                        margin="normal"
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Points to Use"
                                        type="number"
                                        InputProps={{ inputProps: { min: 0, max: memberInfo.score } }}
                                        value={user.pointsToUse}
                                        onChange={handlePointsChange}
                                        margin="normal"
                                        fullWidth
                                        disabled={useScoreOption === "disagree"}
                                    />
                                    <Typography variant="caption" display="block" gutterBottom>
                                        Available Points: {memberInfo.score}
                                    </Typography>
                                    <FormControl component="fieldset" margin="normal">
                                        <FormLabel component="legend">Use Score:</FormLabel>
                                        <RadioGroup row value={useScoreOption} onChange={handleUseScoreOptionChange}>
                                            <FormControlLabel value="agree" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="disagree" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Box mt={4} display="flex" justifyContent="space-between">
                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} disabled={isProcessing}>
                    Go Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConfirmPayment}
                    disabled={isProcessing || !isQrGenerated}
                >
                    {isProcessing ? "Processing..." : "Confirm Payment"}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleQrCodeGeneration}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : "Generate QR Code"}
                </Button>
            </Box>
        </Box>
    );
};

export default Confirm;
