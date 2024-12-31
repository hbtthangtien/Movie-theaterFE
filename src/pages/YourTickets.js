// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Card, Col, Container, Row, Table } from "react-bootstrap";
// import { format, isBefore } from "date-fns";

// const YourTickets = () => {
//     const user = JSON.parse(localStorage.getItem('userLogged'));
//     const [tickets, setTickets] = useState([]);
//     const [movies, setMovies] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [showings, setShowings] = useState([]);
//     const { id } = useParams();

//     useEffect(() => {
//         const fetchData = async (id) => {
//             try {
//                 const res = await axios.get('http://localhost:9999/tickets');
//                 const resM = await axios.get('https://localhost:7127/movies/incoming');
//                 const resU = await axios.get('https://localhost:7127/api/users/${mid}');
//                 const resS = await axios.get('http://localhost:9999/showing');
//                 setTickets(res.data);
//                 setMovies(resM.data);
//                 setUsers(resU.data);
//                 setShowings(resS.data);
//             } catch (error) {
//                 console.log('Error fetching data:', error);
//             }
//         };
//         fetchData();
//     }, []);

//     const getMembershipImage = (amount) => {
//         if (amount >= 10000000) {
//             return "/images/memberShip/pla.png";
//         } else if (amount >= 5000000) {
//             return "/images/memberShip/gold.png";
//         } else {
//             return "/images/memberShip/nor.png";
//         }
//     };

//     const userTicket = tickets.filter(t => t.userId === user.id);

//     const userLog = users.find(u => parseInt(u.id) === parseInt(user.id));

//     return (
//         userLog ? (
//             <Container fluid className="p-4 text-white bg-dark">
//                 <Container>
//                     <h2 onClick={() => { console.log(showings); }}>Welcome back <span className="text-success">{user.userName.toUpperCase()}</span>, how are you today?</h2>
//                     <Row>
//                         <Col md={3}>
//                             <Card className="bg-dark">
//                                 <Card.Img className="rounded-circle" src="/images/avatar_25.jpg" />
//                                 <Card.Body>
//                                     <Card.Title>
//                                         <p>You have paid: <strong>{userLog.totalAmount.toLocaleString('vi-VN')} VND</strong></p>
//                                     </Card.Title>
//                                     <Card.Text>
//                                         <p>Your membership is:</p>
//                                         <Card.Img src={getMembershipImage(userLog.totalAmount)} />
//                                     </Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>

//                         <Col md={9}>
//                             <h4 className="text-center">Your tickets</h4>
//                             <Table striped hover bordered className="table-dark text-white">
//                                 <thead>
//                                     <tr>
//                                         <th>TicketId</th>
//                                         <th>Movie</th>
//                                         <th>Date</th>
//                                         <th>Time</th>
//                                         <th>Food</th>
//                                         <th>Bạn nữ xem cùng</th>
//                                         <th>Total</th>
//                                         <th>Seats</th>
//                                         <th>Paid</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {
//                                         userTicket?.map(u => (
//                                             <tr key={u.id}>
//                                                 <td>{u.id}</td>
//                                                 <td>
//                                                     <img style={{ width: '80px' }} src={`${movies.find(m => parseInt(m.id) === parseInt(u.movieId))?.img}`} alt="Movie" />
//                                                 </td>
//                                                 <td>{showings.find(s => (s.id) === (u.showingId))?.showDate}</td>
//                                                 <td>{showings.find(s => (s.id) === (u.showingId))?.showTime}</td>
//                                                 <td className={Object.keys(u.foods).length > 0 ? "text-success" : "text-danger"}>
//                                                     {Object.keys(u.foods).length > 0 ? Object.keys(u.foods).length : "no"}
//                                                 </td>
//                                                 <td className={u.emXinhTuoi ? "text-success" : "text-danger"}>{u.emXinhTuoi > 0 ? "yes" : "no"}</td>
//                                                 <td>{u.totalPrice.toLocaleString('vi-VN')} VND</td>
//                                                 <td>
//                                                     {/* Render seats here */}
//                                                     {Object.entries(u.seats).map(([seatType, count], index) => (
//                                                         <p key={index}>{`${seatType}: ${count}`}</p>
//                                                     ))}
//                                                 </td>
//                                                 <td className="text-success">Paid</td>

//                                             </tr>
//                                         ))
//                                     }
//                                 </tbody>
//                             </Table>
//                         </Col>
//                     </Row>
//                 </Container>
//             </Container>
//         ) : <></>
//     );
// };

// export default YourTickets;
