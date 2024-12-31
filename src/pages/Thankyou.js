import { Button, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Typography } from "@mui/material";

const Thankyou = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    
    // Extract query parameters
    const queryParams = new URLSearchParams(location.search);
    const appTransId = queryParams.get('apptransid');
    const statusFromUrl = queryParams.get('status');
    const amount = queryParams.get('amount');
    const checksum = queryParams.get('checksum');
    
    useEffect(() => {
        if (appTransId) {
            axios.post('http://localhost:4000/check-status-order', { app_trans_id: appTransId })
                .then(response => {
                    // Check if response status is success
                    if (response.data.return_code === 1) {
                        setStatus({
                            message: 'Payment Successful!',
                            amount,
                            appTransId,
                            bankCode: queryParams.get('bankcode'),
                            discountAmount: queryParams.get('discountamount'),
                            pmcId: queryParams.get('pmcid'),
                            status: statusFromUrl
                        });
                    } else {
                        setStatus({
                            message: `Payment Failed: ${response.data.return_message}`,
                            amount: null,
                            appTransId: null,
                            bankCode: null,
                            discountAmount: null,
                            pmcId: null,
                            status: statusFromUrl
                        });
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Failed to check order status:', error);
                    setError('Failed to check order status');
                    setLoading(false);
                });
        } else {
            setLoading(false);
            setError('Invalid Transaction ID');
        }
    }, [appTransId, amount, statusFromUrl, checksum, location.search]);

    if (loading) {
        return <Typography variant="h4">Loading...</Typography>;
    }

    return (
        <Container fluid className="text-center text-white bg-dark">
            <Container className="p-4">
                <img src="/images/thankyou.png" alt="Thank You" />
                <Container className="p-4">
                    <h3>THANK YOU FOR YOUR ORDER</h3>
                    {status ? (
                        <Typography variant="h4" color={status.message.includes('Failed') ? 'error' : 'primary'}>
                            {status.message}
                        </Typography>
                    ) : (
                        <Typography variant="h4" color="error">{error || 'Invalid Transaction ID'}</Typography>
                    )}
                    {status && status.amount && (
                        <Typography variant="h5" color="success">Amount: {status.amount.toLocaleString('vi-VN')} VND</Typography>
                    )}
                    <Link to='/yourtickets' className="text-success">Click here to see your ticket</Link>
                </Container>
            </Container>
        </Container>
    );
};

export default Thankyou;
