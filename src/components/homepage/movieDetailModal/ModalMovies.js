import { Modal } from "react-bootstrap";
import { Row, Col, Button, Badge } from "react-bootstrap";
import { FaTicket } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ModalMovies = (props) => {
    return (
        <>
            <Modal
                size="xl"
                show={props.show}
                onHide={props.onHide}
                centered
            >
                <Modal.Body className="bg-dark">
                    {props.data && (
                        <Row>
                            <Col md={4}>
                                <img
                                    style={{ width: '100%' }}
                                    src={props.data.largeImage || props.data.smallImage}
                                    alt={props.data.movieNameEnglish || props.data.movieNameVn}
                                />
                                <div className="mt-4 d-flex justify-content-between">
                                    {props.data.fromDate && props.data.toDate && (
                                        // Kiểm tra nếu phim đang chiếu (Now Showing)
                                        new Date() >= new Date(props.data.fromDate) && new Date() <= new Date(props.data.toDate) ? (
                                            <Link
                                                to={localStorage.getItem('role') ? `order/${props.data.movieId}` : "/login"}
                                                className="btn btn-success"
                                            >
                                                <FaTicket /> Buy Ticket Now
                                            </Link>
                                        ) : (
                                            // Không hiển thị nút "Buy Ticket Now" cho phim sắp chiếu (Upcoming)
                                            <Button className="transparent-button">Coming Soon</Button>
                                        )
                                    )}
                                    <Button className="transparent-button" href="https://www.youtube.com/embed/abPmZCZZrFA" >
                                        Watch Trailer
                                    </Button>
                                </div>
                            </Col>
                            <Col md={8}>
                                <h1 className="text-success">{props.data.movieNameEnglish || props.data.movieNameVn}</h1>
                                <p className="pt-3 text-white">{props.data.content}</p>
                                <p className="pt-3 text-white">Age under: <Badge bg="danger">{props.data.ageUnder || "N/A"}</Badge></p>
                                <p className="pt-3 text-white">Type: <Badge bg="success">{props.data.typeName}</Badge></p>
                                <p className="pt-3 text-white">Director: {props.data.director}</p>
                                <p className="pt-3 text-white">Category: {props.data.category || "N/A"}</p>
                                <p className="pt-3 text-white">Start Date: {new Date(props.data.fromDate).toLocaleDateString()}</p>
                                <p className="pt-3 text-white">Duration: {props.data.duration}</p>
                                <p className="pt-3 text-white">Language: {props.data.language || "N/A"}</p>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalMovies;
