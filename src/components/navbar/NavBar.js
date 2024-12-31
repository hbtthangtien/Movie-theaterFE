import { Container, Navbar, Nav } from "react-bootstrap";
import { FaTicket } from "react-icons/fa6";
import "../../css/navbar/NavBar.css";
import { Link } from "react-router-dom";
import { Avatar, Button} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
const NavBar = () => {
  const [role, setRole] = useState(null);
  const [Fullname, setFullName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {  
            const decodedToken = jwtDecode(accessToken);
            setRole(decodedToken.role);  // Lấy role từ decodedToken
            setFullName(decodedToken.Fullname);  // Lấy fullName từ decodedToken
        }
    }, []);

    const handleLoggout = async () => {
        try {             
            localStorage.removeItem('role');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userLogged');
    
            // Redirect to the home page
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Failed to log out. Please try again.');
        }
    };
    

const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
};

const closeDropdown = () => {
    setIsDropdownOpen(false);
};

  return (
    <Container
      fluid
      className="border-bottom-custom container-all bg-dark nav-top"
    >
      <Container>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="/">
            <img
              width="180"
              height="90"
              className="d-inline-block align-top"
              src="/images/logo.png"
              alt="logo"
            />
          </Navbar.Brand>
          {role === "admin" && (
            <h5 className="pt-2 text-center text-white">
              Welcome back <span className="text-success">ADMIN</span>
            </h5>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {role === "member" && (
                <Nav.Link href="/yourtickets">Your Tickets</Nav.Link>
              )}
              <Nav.Link href="/promo">Khuyến Mãi/ Sự kiện</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <div className="d-flex align-items-center">
            {role ? (
              <>
                <h5 className="p-2 text-center text-white">
                  Welcome back: <span className="text-success">{Fullname}</span>
                </h5>

                <div className="avatar-container">
                  <Avatar
                    className="m-2"
                    alt="User Avatar"
                    src="/images/avatar_25.jpg"
                    sx={{ width: 56, height: 56 }}
                    onClick={toggleDropdown}
                  />
                  <div
                    className={`avatar-dropdown ${
                      isDropdownOpen ? "show" : ""
                    }`}
                  >
                    < a href="/profile" className="menu-item">
                      Information
                    </a>
                    <a href="/tickets" className="menu-item">
                      Booked Tickets
                    </a>
                    <a href="/scores" className="menu-item">
                      History Score
                    </a>
                  </div>
                </div>
                <Button
                  className="m-2"
                  onClick={handleLoggout}
                  size="small"
                  variant="outlined"
                  color="success"
                >
                  Logout
                </Button>
              </>
            ) : (
              <div>
                <Link
                  to="/login"
                  className="btn btn-success transparent-button m-4"
                >
                  Đăng nhập/ Đăng ký
                </Link> 
              </div>
            )}
          </div>
        </Navbar>
      </Container>
    </Container>
  );
};

export default NavBar;
