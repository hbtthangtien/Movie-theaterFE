// App.js
import React, { useState } from 'react';
import { Fab, Snackbar } from '@mui/material';
import { Message } from '@mui/icons-material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/navbar/NavBar';
import Footer from './components/footer/Footer';
import PreFooter from './components/footer/PreFooter';
import Homepages from './pages/Homepages';
import NotFound from './pages/Notfound';
import './App.css';
import Login from './pages/LoginRegister';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Sidebar from './components/navbar/VnavBar';
import PromoEventM from './pages/PromoEvent';
import Order from './pages/Order';
import { Row, Col } from 'react-bootstrap';
import Shop from './pages/Shop';
import Thankyou from './pages/Thankyou';
import Theater from './pages/Theater';
import TheaterDetail from './pages/TheaterDetail';
import MoviesAdmin from './pages/Admin/MoviesAdmin';
import AddMovies from './pages/Admin/AddnewMovies';
import AdminTheater from './pages/Admin/AdminTheater';
import AddTheater from './pages/Admin/AddNewTheater';
import UsersList from './pages/Admin/AdminUser';
import AddEmployee from './pages/Admin/AddEmployee';
import FoodList from './pages/Admin/AdminFood';
import CreateShowing from './pages/Admin/CreateShowing';
import MessageFab from './components/admin/homepage/Fab';
import Profile from "./components/homepage/myAccount/profile";
import EditProfile from "./components/homepage/myAccount/editProfile";
import BookedTickets from "./components/homepage/myAccount/bookedTickets";
import HistoryScore from "./components/homepage/myAccount/historyScore";
import Promotions from './pages/Admin/PromotionManager';
import BookingConfirm from './components/bookingconfirm/BookingCf';
import Confirm from './components/bookingconfirm/Confirm';
import AddPromotion from './pages/Admin/AddPromotion';
import Tickets from './components/bookingconfirm/Tickets';
import TicketConfirm from './components/bookingconfirm/TicketCf';
import axios from 'axios';
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // Không có refreshToken thì chuyển về login
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Gửi request refresh token kèm refreshToken trong Authorization header
        const response = await axios.post(
          'https://localhost:7127/api/auth/refresh-token',
          {},
          {
            headers: { 'Authorization': `Bearer ${refreshToken}` },
            withCredentials: true,
          }
        );

        localStorage.setItem('accessToken', response.data.accessToken);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.accessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.accessToken;

        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

function App() {
  const [openMessage, setOpenMessage] = useState(false);

  const handleOpenMessage = () => {
    setOpenMessage(true);
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const role = localStorage.getItem('role') ?? "";

  return (
    <div className="App">
      <Router>
        {
          role.toLowerCase() === 'admin' ?
            <>
              <Row>
                <Col md={2}>
                  <Sidebar />
                </Col>
                <Col md={10}>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/admin/movies" element={<MoviesAdmin />} />
                    <Route path="/admin/movies/addMovies" element={<AddMovies />} />
                    <Route path="/admin/theaters" element={<AdminTheater />} />
                    <Route path="/admin/theaters/addTheater" element={<AddTheater />} />
                    <Route path="/admin/users" element={<UsersList />} />
                    <Route path="/admin/users/add" element={<AddEmployee />} />
                    <Route path="/admin/foods" element={<FoodList />} />
                    <Route path="/createShowing" element={<CreateShowing />} />
                    <Route path="/admin/promotions" element={<Promotions />} />
                    <Route path="/admin/addPromotion" element={<AddPromotion />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <MessageFab open={handleOpenMessage} handleClose={handleCloseMessage} />
                </Col>
              </Row>
            </>
            :
            <>
              <NavBar />
              <Routes>
                <Route path="/" element={<Homepages />} />
                <Route path="/theater" element={<Theater />} />
                <Route path="/theater/:tid" element={<TheaterDetail />} />
                <Route path="/promo" element={<PromoEventM />} />
                <Route path="/order/:mid" element={<Order />} />
                <Route path="/success" element={<Thankyou />} />
                <Route path="/payments" element={<BookingConfirm />} />
                <Route path="/confirm" element={<Confirm />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/tickets" element={<BookedTickets />} />
                <Route path="/ticket" element={<Tickets />} />
                <Route path="/ticket-details" element={<TicketConfirm />} />
                <Route path="/scores" element={<HistoryScore />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <PreFooter />
              <Footer />
            </>
        }
      </Router>
    </div>
  );
}

export default App;
