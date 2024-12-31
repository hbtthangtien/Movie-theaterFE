import React, { useState, useEffect } from 'react';
import { Fab, Modal, Box, Typography, Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Snackbar, Badge } from '@mui/material';
import { Message } from '@mui/icons-material';
import axios from 'axios';
import { Mail as MailIcon } from '@mui/icons-material';

const MessageFab = ({ open, handleClose }) => {
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reqD = await axios.get("http://localhost:9999/userRequest");
                const reqU = await axios.get("http://localhost:9999/users");
                setRequests(reqD.data);
                setUsers(reqU.data);
                if (reqD.data.length > 0) {
                    setSnackbarOpen(true); // Open Snackbar when there are new requests
                }
            } catch (error) {
                console.log('Error fetching user requests:', error);
            }
        };
        fetchData();
    }, []);

    const handleOpenMessage = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleReject = async (requestId, resolveStatus) => {
        try {
            const reqs = requests.find(request => parseInt(request.id) === parseInt(requestId));
            const updatedReq = { ...reqs, resolver: !resolveStatus };
            // Update the resolver field in the backend
            await axios.put(`http://localhost:9999/userRequest/${requestId}`, updatedReq);
    
            // Update the local state to reflect the change
            setRequests(prevRequests => {
                return prevRequests.map(r => {
                    if (r.id === requestId) {
                        return { ...r, resolver: true };
                    }
                    return r;
                });
            });
        } catch (error) {
            console.log('Error rejecting request:', error);
        }
    };
    
    const handleUnban = async (requestId, email,resolveStatus) => {
        try {
            const findU = users.find(u => u.email === email);
            const updatedReq = { ...findU, active: true };
            // Update the resolver field in the backend
            await axios.put(`http://localhost:9999/users/${findU.id}`, updatedReq);
            const reqs = requests.find(request => parseInt(request.id) === parseInt(requestId));
            const updatedReqs = { ...reqs, resolver: !resolveStatus };
            // Update the resolver field in the backend
            await axios.put(`http://localhost:9999/userRequest/${requestId}`, updatedReqs);

            await axios.post('http://localhost:4000/email/send', {
                email: email,
                subject: 'Unban rồi ông cháu ơi',
                content: `We unban you`
            });
    
            // Update the local state to reflect the change
            setRequests(prevRequests => {
                return prevRequests.map(r => {
                    if (r.id === requestId) {
                        return { ...r, resolver: true };
                    }
                    return r;
                });
            });
        } catch (error) {
            console.log('Error rejecting request:', error);
        }
    }
    const handleForgotPass = async  (requestId, email,resolveStatus) => {
        try {
            const reqs = requests.find(request => parseInt(request.id) === parseInt(requestId));
            const updatedReqs = { ...reqs, resolver: !resolveStatus };
            const findU = users.find(u => u.email === email);
            // Update the resolver field in the backend
            await axios.put(`http://localhost:9999/userRequest/${requestId}`, updatedReqs);
            await axios.post('http://localhost:4000/email/send', {
                email: email,
                subject: 'Resend your password',
                content: `your password is ${findU.password}`
            });
            // Update the local state to reflect the change
            setRequests(prevRequests => {
                return prevRequests.map(r => {
                    if (r.id === requestId) {
                        return { ...r, resolver: true };
                    }
                    return r;
                });
            });
        } catch (error) {
            console.log('Error rejecting request:', error);
        }
    }
    

    const falseRequest = requests.filter(r => !r.resolver);

    return (
        <>

            <Fab
                color="primary"
                aria-label="message"
                style={{ position: 'fixed', bottom: '20px', right: '20px' }}
                onClick={handleOpenMessage}
            >
                <Badge anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }} badgeContent={falseRequest.length} color="secondary"></Badge>
                <MailIcon />
            </Fab>

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="request-details-modal"
                aria-describedby="request-details-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600, // Increased width to fit table content better
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    {falseRequest.length > 0 ? (
                        <>
                            <Typography variant="h5" align="center" gutterBottom>
                                Request Details
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Request Id</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {falseRequest.map((r) => (
                                            <TableRow key={r.id}>
                                                <TableCell>{r.id}</TableCell>
                                                <TableCell>{r.email}</TableCell>
                                                <TableCell>
                                                    {r.requestType === 1 ? "Unban Account" : "Reset Password"}</TableCell>
                                                <TableCell>{r.description}</TableCell>
                                                <TableCell>
                                                    <Button onClick={() => handleReject(r.id, r.resolver)} variant="contained" color="secondary">Reject</Button>
                                                    { 
                                                        parseInt(r.requestType) === 1 ? <Button onClick={() => handleUnban(r.id,r.email,r.resolver)}>Unban</Button> : 
                                                        <Button onClick={() => handleForgotPass(r.id,r.email,r.resolver)} >Reset Password</Button>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    ) : <Typography variant="h5" align="center">
                            Hôm nay không có ai cần gỡ ban
                        </Typography>}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={handleCloseModal} variant="contained" color="primary">
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Snackbar to notify about new requests */}
            {falseRequest.length > 0 && (
                <Snackbar
                    open={snackbarOpen}
                    onClose={handleSnackbarClose}
                    message="Có đứa quên mật khẩu này"
                    action={
                        <Button color="inherit" size="small" onClick={handleOpenMessage}>
                            View
                        </Button>
                    }
                />
            )}
        </>
    );
};

export default MessageFab;
