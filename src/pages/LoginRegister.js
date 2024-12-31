import axios from 'axios';
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../src/App.css';
// Define the API URLs
const LOGIN_URL = 'https://localhost:7127/api/auth/login';
const REGISTER_URL = 'https://localhost:7127/api/users/register';  // replace if needed
const REFRESH_TOKEN_URL = 'https://localhost:7127/api/auth/refresh-token';
const ROLES_URL = 'https://localhost:7127/api/roles';

// Function to check if token has expired
const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decodedToken.exp < currentTime;
};

// Function to refresh token
const refreshTokenFunction = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
        console.error("No refresh token found");
        return null;
    }

    try {
        const response = await axios.post(REFRESH_TOKEN_URL, {}, {
            headers: {
                Authorization: `Bearer ${storedRefreshToken}`
            },
            withCredentials: true  // Ensure cookies are sent with the request
        });

        if (response.status === 200) {
            const { accessToken, refreshToken: newRefreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
            return accessToken;
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        alert("Unable to refresh token. Please log in again.");
        return null;
    }
};

function Login() {
    const [loginData, setLoginData] = useState({ userName: '', password: '' });

    const initialRegisterData = {
        userName: '',
        fullName: '',
        gender: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        email: '',
        dateOfBirth: '',
        address: '',
        identityCard: '',
    };
    const [registerData, setRegisterData] = useState(initialRegisterData);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [showModal, setShowModal] = useState(false);
    const [requestData, setRequestData] = useState({
        email: '',
        requestType: '',
        description: ''
    });
    const [loginErrors, setLoginErrors] = useState({});
    const [registerErrors, setRegisterErrors] = useState({});
    const [accountBanned, setAccountBanned] = useState(false);

    const navigate = useNavigate(); // Using useNavigate hook from react-router-dom

    // Handler for login form changes
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prevLoginData => ({
            ...prevLoginData,
            [name]: value
        }));
        // Clear login errors when user starts typing
        setLoginErrors(prevErrors => {
            const { [name]: removed, ...rest } = prevErrors;
            return rest;
        });
    };

    // Handler for register form changes
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prevRegisterData => ({
            ...prevRegisterData,
            [name]: value
        }));
        // Clear register errors when user starts typing
        setRegisterErrors(prevErrors => {
            const { [name]: removed, ...rest } = prevErrors;
            return rest;
        });
    };

    // Handler for request form changes
    const handleRequestChange = (e) => {
        const { name, value } = e.target;
        setRequestData(prevRequestData => ({
            ...prevRequestData,
            [name]: value
        }));
        // Clear request errors when user starts typing
        // If you have request-specific errors, handle them similarly
    };

    // Handler for login submission
    const handleLogin = async () => {
        const { userName, password } = loginData;
    
        // Validate inputs
        if (!userName || !password) {
            setAlert({ type: 'error', message: 'Please enter both username and password.' });
            return;
        }
    
        try {
            const response = await axios.post(LOGIN_URL, { userName, password });
            const { accessToken, refreshToken } = response.data;
    
            // Decode the token
            const decodedToken = jwtDecode(accessToken);
    
            // Check if token is expired
            if (isTokenExpired(accessToken)) {
                const newAccessToken = await refreshTokenFunction();
                if (!newAccessToken) {
                    setAlert({ type: 'error', message: 'Token refresh failed. Please log in again.' });
                    return;
                }
            }
    
            // Store tokens and set headers
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('role', decodedToken.role);
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    
            // Show success alert and navigate to home
            setAlert({ type: 'success', message: 'Login Successful' });
            setTimeout(() => {
                navigate('/', { replace: true }); // Redirect to homepage
                window.location.reload(); // Optional: Ensure headers and state sync
            }, 1500);
        } catch (error) {
            if (error.response) {
                const { statusMessage } = error.response.data;
                let fieldErrors = {};
    
                if (statusMessage) {
                    if (/username/i.test(statusMessage)) {
                        fieldErrors.userName = statusMessage;
                    }
                    if (/password/i.test(statusMessage)) {
                        fieldErrors.password = statusMessage;
                    }
                    setLoginErrors(fieldErrors);
    
                    setAlert({
                        type: 'error',
                        message: statusMessage || 'Login failed. Please check your inputs.',
                    });
                }
            } else {
                setAlert({ type: 'error', message: 'Network error. Please try again later.' });
            }
        }
    };


// Handler for register submission
const handleRegister = async () => {
    // Validate inputs
    let fieldErrors = {};
    for (const [key, value] of Object.entries(registerData)) {
        if (!value.trim()) {
            fieldErrors[key] = 'This field is required.';
        }
    }
    // If there are validation errors, set them and prevent submission
    if (Object.keys(fieldErrors).length > 0) {
        setRegisterErrors(fieldErrors);
        return;
    }

    try {
        const response = await axios.post(REGISTER_URL, {
            ...registerData,
        });

        // Assume registration is successful
        const data = response.data;
        console.log('Registration successful:', data);
        setAlert({ message: 'Registration successful!', type: 'success' });
        setRegisterData(initialRegisterData); // Reset registration form
        setRegisterErrors({});
        setTimeout(() => {
            setAlert({ message: '', type: '' });
        }, 3000);
    } catch (error) {
        if (error.response) {
            const { statusCode, statusMessage } = error.response.data;
            let fieldErrors = {};
            if (statusMessage.toLowerCase().includes('username')) {
                fieldErrors.userName = statusMessage;
            }
            if (statusMessage.toLowerCase().includes('email')) {
                fieldErrors.email = statusMessage;
            }
            if (statusMessage.toLowerCase().includes('phone number') || statusMessage.toLowerCase().includes('phonenumber')) {
                fieldErrors.phoneNumber = statusMessage;
            }
            if (statusMessage.toLowerCase().includes('password')) {
                fieldErrors.password = statusMessage;
            }
            if (statusMessage.toLowerCase().includes('confirm password') || statusMessage.toLowerCase().includes('confirmpassword')) {
                fieldErrors.confirmPassword = statusMessage;
            }
            if (statusMessage.toLowerCase().includes('identity card') || statusMessage.toLowerCase().includes('identitycard')) {
                fieldErrors.identityCard = statusMessage;
            }
            if (statusMessage.toLowerCase().includes('full name') || statusMessage.toLowerCase().includes('fullname')) {
                fieldErrors.fullName = statusMessage;
            }
            if (statusMessage.toLowerCase().includes('date of birth') || statusMessage.toLowerCase().includes('dateofbirth')) {
                fieldErrors.dateOfBirth = statusMessage;
            }
            if (statusMessage.toLowerCase().includes('address')) {
                fieldErrors.address = statusMessage;
            }
            if (Object.keys(fieldErrors).length === 0) {
                setAlert({ type: 'error', message: `${statusMessage}` });
            } else {
                setRegisterErrors(fieldErrors);
            }
        } else {
            console.error('Error during registration:', error);
            setAlert({ message: 'An unexpected error occurred. Please try again.', type: 'error' });
        }
    }
};

// States to manage password visibility
const [isPasswordVisiblee, setPasswordVisiblee] = useState(false);
const [isPasswordVisible, setPasswordVisible] = useState(false);
const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
};
const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
};
const togglePasswordVisibilitye = () => {
    setPasswordVisiblee(!isPasswordVisiblee);
};

return (
    <Container style={{ paddingTop: '50px', paddingBottom: '50px' }} fluid className="bg-dark">
        <Container className="text-white">
            {/* Display alert if any */}
            {alert.message && <Box sx={{ mb: 2 }}><Alert variant={alert.type}>{alert.message}</Alert></Box>}
            <Row>
                {/* Login Form */}
                <Col md={4}>
                    <h3 className="p-2 text-white">LOGIN</h3>
                    <Form>
                        <Form.Group className="p-2">
                            <Form.Label>User Name *</Form.Label>
                            <Form.Control
                                autoComplete="username"
                                className="transparent-input"
                                type="text"
                                placeholder="Enter your User Name"
                                name="userName"
                                value={loginData.userName}
                                onChange={handleLoginChange}
                                isInvalid={!!loginErrors.userName}
                            />
                            <Form.Control.Feedback type="invalid" style={{ color: 'red' }} className='invalid-feedback'>
                                {loginErrors.userName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="p-2">
                            <Form.Label>Password*</Form.Label>
                            <div className="password-wrapper" style={{ position: 'relative' }}>
                                <Form.Control
                                    autoComplete="off"
                                    className="transparent-input"
                                    type={isPasswordVisiblee ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    isInvalid={!!loginErrors.password} // Bind error state
                                />
                                <span
                                    className="show-btn"
                                    onClick={togglePasswordVisibilitye}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <i className={`fas ${isPasswordVisiblee ? 'fa-eye-slash' : 'fa-eye'}`} />
                                </span>
                            </div>
                            <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                {loginErrors.password} {/* Display password error */}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button className='mt-2 d-block' onClick={handleLogin} variant="success">LOGIN</Button>
                        {accountBanned && <Alert variant="danger" className="text-white mt-3">Your account has been banned. Please contact admin to unlock.</Alert>}
                    </Form>
                </Col>

                {/* Register Form */}
                <Col md={8}>
                    <h3 className="p-2 text-white">SIGNUP</h3>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="p-2">
                                    <Form.Label>User Name *</Form.Label>
                                    <Form.Control
                                        className="transparent-input"
                                        type="text"
                                        placeholder="Enter your user name"
                                        name="userName"
                                        value={registerData.userName}
                                        onChange={handleRegisterChange}
                                        isInvalid={!!registerErrors.userName}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                        {registerErrors.userName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="p-2">
                                    <Form.Label>Full Name *</Form.Label>
                                    <Form.Control
                                        className="transparent-input"
                                        type="text"
                                        placeholder="Enter your full name"
                                        name="fullName"
                                        value={registerData.fullName}
                                        onChange={handleRegisterChange}
                                        isInvalid={!!registerErrors.fullName}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                        {registerErrors.fullName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form className="p-2">
                                    <Form.Label>Gender *</Form.Label>
                                    <Form.Check
                                        type="radio"
                                        label="Male"
                                        name="gender"
                                        value="male"
                                        checked={registerData.gender === 'male'}
                                        onChange={handleRegisterChange}
                                        isInvalid={!!registerErrors.gender}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Female"
                                        name="gender"
                                        value="female"
                                        checked={registerData.gender === 'female'}
                                        onChange={handleRegisterChange}
                                        isInvalid={!!registerErrors.gender}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                        {registerErrors.gender}
                                    </Form.Control.Feedback>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="p-2">
                                    <Form.Label>Phone Number *</Form.Label>
                                    <Form.Control
                                        className="transparent-input"
                                        type="text"
                                        placeholder="Enter your phone number"
                                        name="phoneNumber"
                                        value={registerData.phoneNumber}
                                        onChange={handleRegisterChange}
                                        isInvalid={!!registerErrors.phoneNumber}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                        {registerErrors.phoneNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="p-2">
                                    <Form.Label>Password *</Form.Label>
                                    <div className="password-wrapper" style={{ position: 'relative' }}>
                                        <Form.Control
                                            autoComplete="new-password"
                                            className="transparent-input"
                                            type={isPasswordVisible ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            name="password"
                                            value={registerData.password}
                                            onChange={handleRegisterChange}
                                            isInvalid={!!registerErrors.password}
                                        />
                                        <span
                                            className="show-btn"
                                            onClick={togglePasswordVisibility}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <i className={`fas ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`} />
                                        </span>
                                    </div>
                                    <Form.Control.Feedback type="invalid" style={{ color: 'red' }} className='invalid-feedback'>
                                        {registerErrors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="p-2">
                                    <Form.Label>Confirm Password *</Form.Label>
                                    <div className="password-wrapper" style={{ position: 'relative' }}>
                                        <Form.Control
                                            autoComplete="new-password"
                                            className="transparent-input"
                                            type={isConfirmPasswordVisible ? 'text' : 'password'}
                                            placeholder="Re-enter your password"
                                            name="confirmPassword"
                                            value={registerData.confirmPassword}
                                            onChange={handleRegisterChange}
                                            isInvalid={!!registerErrors.confirmPassword}
                                        />
                                        <span
                                            className="show-btn"
                                            onClick={toggleConfirmPasswordVisibility}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <i className={`fas ${isConfirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`} />
                                        </span>
                                    </div>
                                    <Form.Control.Feedback type="invalid" style={{ color: 'red' }} className='invalid-feedback'>
                                        {registerErrors.confirmPassword}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="p-2">
                                    <Form.Label>Email *</Form.Label>
                                    <Form.Control
                                        className="transparent-input"
                                        type="email"
                                        placeholder="Enter your email"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        isInvalid={!!registerErrors.email}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                        {registerErrors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="p-2">
                                    <Form.Label>Date of Birth *</Form.Label>
                                    <Form.Control
                                        className="transparent-input"
                                        type="date"
                                        name="dateOfBirth"
                                        value={registerData.dateOfBirth}
                                        onChange={handleRegisterChange}
                                        isInvalid={!!registerErrors.dateOfBirth}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                        {registerErrors.dateOfBirth}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="p-2">
                                    <Form.Label>Address *</Form.Label>
                                    <Form.Control
                                        className="transparent-input"
                                        type="text"
                                        name="address"
                                        value={registerData.address}
                                        onChange={handleRegisterChange}
                                        isInvalid={!!registerErrors.address}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                        {registerErrors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="p-2">
                                    <Form.Label>Identity Card *</Form.Label>
                                    <Form.Control
                                        className="transparent-input"
                                        type="text"
                                        name="identityCard"
                                        value={registerData.identityCard}
                                        onChange={handleRegisterChange}
                                        isInvalid={!!registerErrors.identityCard}
                                    />
                                    <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                        {registerErrors.identityCard}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button className="m-2 d-block" variant="success" onClick={handleRegister}>REGISTER</Button>
                    </Form>
                </Col>
            </Row>

            {/* Request Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Request Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address *</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={requestData.email}
                                onChange={handleRequestChange}
                                isInvalid={!!registerErrors.email} // Adjust if you have separate request errors
                            />
                            <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                {registerErrors.email} {/* Adjust if you have separate request errors */}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Request Type *</Form.Label>
                            <Form.Control
                                as="select"
                                name="requestType"
                                value={requestData.requestType}
                                onChange={handleRequestChange}
                                isInvalid={!!registerErrors.requestType} // Adjust if you have separate request errors
                            >
                                <option value="">Select Request Type</option>
                                <option value={1}>Unban Account</option>
                                <option value={2}>Forgot Password</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                {registerErrors.requestType} {/* Adjust if you have separate request errors */}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={requestData.description}
                                onChange={handleRequestChange}
                                isInvalid={!!registerErrors.description} // Adjust if you have separate request errors
                            />
                            <Form.Control.Feedback type="invalid" style={{ color: 'red' }}>
                                {registerErrors.description} {/* Adjust if you have separate request errors */}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    {/* Uncomment and implement handleRequestSubmit if needed */}
                    {/* <Button variant="primary" onClick={handleRequestSubmit}>
                            Submit
                        </Button> */}
                    <Button variant="primary">
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    </Container>
);
}

export default Login;
