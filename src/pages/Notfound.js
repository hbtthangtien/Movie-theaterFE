// NotFound.js
import React from 'react';
import { Button, Container } from 'react-bootstrap';
import '../css/NotFound/NotFound.css'
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container fluid className='p-4 text-center text-white bg-dark'>
      <img style={{width: "50%"}} src='./images/error.png'/>
      <p>Sorry, we couldn’t find the page you’re looking for.</p>
      <p>Perhaps you’ve mistyped the URL? Be sure to check your spelling.</p>
      <Link to="/" className='btn transparent-button'>Go to Home</Link>
    </Container>
  );
};

export default NotFound;
