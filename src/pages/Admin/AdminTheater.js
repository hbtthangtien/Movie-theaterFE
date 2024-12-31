import { Message } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminTheater = () => {
    const [theaters, setTheaters] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentTheater, setCurrentTheater] = useState({});
    const [showSeatsModal, setShowSeatsModal] = useState(false);
    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [showSeatOptionsModal, setShowSeatOptionsModal] = useState(false);
    const [showSeatEditModal, setShowSeatEditModal] = useState(false);
    const [showSeatFormModal, setShowSeatFormModal] = useState(false);
    const [error, setError] = useState(null);
    const [newSeat, setNewSeat] = useState({
      
      seatId: 0,
      cinemaRoomId: 0,
      seatColunm: "",
      seatRow: 0,
      seatStatus: 0,
      seatType_id: 0,
    });
  
    const seatStatusMap = {
      1: "NORMAL",
      0: "BREAK",
    };
  
    const getSeatStatusColor = (status) => {
      switch (status) {
        case 1:
          return "#d4edda"; 
        case 0:
          return "#fff3cd"; 
      }
    };
  
    useEffect(() => {
      const fetchdata = async () => {
        try {
          const response = await axios.get("https://localhost:7127/api/manager/cinemarooms/listcinemaroom");
          setTheaters(response.data);
        } catch (error) {
          console.error("Error fetching theaters:", error);
          
        }
      };
      fetchdata();
    }, []);
  
    const handleDelete = async (cinemaRoomId) => {
      const confirmDelete = window.confirm("Do you really want to delete this theater?");
      if (!confirmDelete) {
        return;
      }
    
      try {
        await axios.delete(`https://localhost:7127/api/manager/cinemarooms/cinemaroom?cinemaRoomId=${cinemaRoomId}`);
        setTheaters(theaters.filter((t) => t.cinemaRoomId !== cinemaRoomId));
      } catch (error) {
        console.error("Error deleting theater:", error);
        alert("Failed to delete. Please try again.");
      }
    };
  
    const handleShowSeats = async (cinemaRoomId, theater) => {
      try {
        const response = await axios.get(`https://localhost:7127/api/manager/cinemarooms/listseatbycinemaid?cinemaId=${cinemaRoomId}`);
        setSeats(response.data);
        setCurrentTheater(theater);
        setShowSeatsModal(true);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };
  
    const handleAddSeat = async () => {
      try {
        await axios.post("https://localhost:7127/api/manager/cinemarooms/seat", [newSeat]);
        alert("Seat added successfully");
        setShowSeatFormModal(false);
        handleShowSeats(newSeat.cinemaRoomId, currentTheater); // Refresh seats
      } catch (error) {
        console.error("Error adding seat:", error);
      }
    };
  
    const handleDeleteSeat = async (seatId) => {
      try {
        await axios.delete("https://localhost:7127/api/manager/cinemarooms/seat", { data: [seatId] });
        alert("Seat deleted successfully");
        setSeats(seats.filter((seat) => seat.seatId !== seatId));
      } catch (error) {
        console.error("Error deleting seat:", error);
        setError("Failed to fetch Cinemarooms. Please try again later.");
      }
    };
  
    const handleEditSeat = async () => {
      try {
        await axios.put("https://localhost:7127/api/manager/cinemarooms/seat", [selectedSeat]);
        alert("Seat updated successfully");
        setSeats(seats.map((seat) => (seat.seatId === selectedSeat.seatId ? selectedSeat : seat)));
        setShowSeatEditModal(false);
      } catch (error) {
        console.error("Error updating seat:", error);
      }
    };
  
    const handleEdit = (theater) => {
      setCurrentTheater(theater);
      setShowModal(true);
    };
  
    const handleSave = async () => {
      try {
        const updatedTheater = {
          cinemaRoomId: currentTheater.cinemaRoomId,
          cinemeRoomName: currentTheater.cinemeRoomName,
          seatQuantity: currentTheater.seatQuantity,
        };
        await axios.put("https://localhost:7127/api/manager/cinemarooms/cinemaroom", updatedTheater);
  
        setTheaters((prevTheaters) =>
          prevTheaters.map((t) => (t.cinemaRoomId === currentTheater.cinemaRoomId ? { ...t, ...updatedTheater } : t))
        );
  
        setShowModal(false);
      } catch (error) {
        console.error("Error updating theater:", error);
      }
    };
  
    const handleSeatClick = (seat) => {
      setSelectedSeat({ ...seat });
      setShowSeatOptionsModal(true);
    };
  
    const handleConfirmDeleteSeat = () => {
      setShowSeatOptionsModal(false);
      if (window.confirm("Are you sure you want to delete this seat?")) {
        handleDeleteSeat(selectedSeat.seatId);
      }
    };
  
    return (
      <Container fluid className="p-4">
        <Container>
          <h1 className="p-4 text-center">OUR THEATER</h1>
          <Link to="/admin/theaters/addTheater" className="btn btn-secondary mb-4">
            Add New Theater
          </Link>
          <Row>
            {theaters.map((t) => (
              <Col key={t.cinemaRoomId} md={4} className="mb-4">
                <Card style={{backgroundColor: "black" }}>
                  <Card.Body>
                    <Card.Title>{t.cinemeRoomName}</Card.Title>
                    <Card.Text>Quantity Seats: {t.seatQuantity}</Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button variant="primary" size="sm" onClick={() => handleEdit(t)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(t.cinemaRoomId)}>
                        Delete
                      </Button>
                    </div>
                    <Button variant="success" size="sm" className="mt-2 w-100" onClick={() => handleShowSeats(t.cinemaRoomId, t)}>
                      Show Seats
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
  
        {/* Modal for Editing Theater */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Theater</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Theater Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentTheater.cinemeRoomName || ""}
                  onChange={(e) => setCurrentTheater({ ...currentTheater, cinemeRoomName: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Seat Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={currentTheater.seatQuantity || 0}
                  onChange={(e) => setCurrentTheater({ ...currentTheater, seatQuantity: parseInt(e.target.value) })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
  
        {/* Modal for Seats */}
        <Modal show={showSeatsModal} onHide={() => setShowSeatsModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Seat Layout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold", fontSize: "18px" }}>
              <div
                style={{
                  width: "100%",
                  height: "40px",
                  backgroundColor: "#000",
                  color: "#fff",
                  lineHeight: "40px",
                  textAlign: "center",
                  borderRadius: "5px",
                }}
              >
                SCREEN
              </div>
            </div>
            <div>
              {Object.entries(
                seats.reduce((rows, seat) => {
                  const rowLabel = seat.seatColunm;
                  if (!rows[rowLabel]) {
                    rows[rowLabel] = [];
                  }
                  rows[rowLabel].push(
                    <div
                      key={seat.seatId}
                      onClick={() => handleSeatClick(seat)}
                      style={{
                        cursor: "pointer",
                        width: "50px",
                        height: "70px",
                        margin: "5px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #ccc",
                        backgroundColor: getSeatStatusColor(seat.seatStatus),
                        color: "#000",
                        borderRadius: "5px",
                      }}
                    >
                      {seat.seatColunm}
                      {seat.seatRow}
                    </div>
                  );
                  return rows;
                }, {})
              ).map(([rowLabel, rowSeats], rowIndex) => (
                <div key={rowIndex} style={{ marginBottom: "10px" }}>
                  <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Row {rowLabel}</div>
                  <div style={{ display: "flex", justifyContent: "center" }}>{rowSeats}</div>
                </div>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() => {
                setNewSeat({
                  seatId: 0,
                  cinemaRoomId: currentTheater.cinemaRoomId,
                  seatColunm: "",
                  seatRow: 0,
                  seatStatus: 0,
                  seatType_id: 1,
                });
                setShowSeatFormModal(true);
              }}
            >
              Add Seat
            </Button>
            <Button variant="secondary" onClick={() => setShowSeatsModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
  
        {/* Modal for Seat Options */}
        <Modal show={showSeatOptionsModal} onHide={() => setShowSeatOptionsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Seat Options</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Seat: {selectedSeat && selectedSeat.seatColunm}
              {selectedSeat && selectedSeat.seatRow}
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setShowSeatOptionsModal(false);
                setShowSeatEditModal(true);
              }}
              className="me-2"
            >
              Edit
            </Button>
            <Button variant="danger" onClick={handleConfirmDeleteSeat}>
              Delete
            </Button>
          </Modal.Body>
        </Modal>
  
        {/* Modal for Editing Seat */}
        <Modal show={showSeatEditModal} onHide={() => setShowSeatEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Seat</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedSeat && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Seat Column</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedSeat.seatColunm}
                    onChange={(e) => setSelectedSeat({ ...selectedSeat, seatColunm: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Seat Row</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedSeat.seatRow}
                    onChange={(e) => setSelectedSeat({ ...selectedSeat, seatRow: parseInt(e.target.value) })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Seat Status</Form.Label>
                  <Form.Select
                    value={selectedSeat.seatStatus}
                    onChange={(e) => setSelectedSeat({ ...selectedSeat, seatStatus: parseInt(e.target.value) })}
                  >
                    <option value={0}>BREAK</option>
                    <option value={1}>NORMAL</option>                   
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Seat Type </Form.Label>
                  <Form.Select
                    type="number"
                    value={selectedSeat.seatType_id}
                    onChange={(e) => setSelectedSeat({ ...selectedSeat, seatType_id: parseInt(e.target.value) })}
                    >
                    <option value={1}>NORMAL</option>
                    <option value={2}>VIP</option>                   
                  </Form.Select>
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSeatEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditSeat}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
  
        {/* Modal for Adding New Seat */}
        <Modal show={showSeatFormModal} onHide={() => setShowSeatFormModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Seat</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Seat Column</Form.Label>
                <Form.Control
                  type="text"
                  value={newSeat.seatColunm}
                  onChange={(e) => setNewSeat({ ...newSeat, seatColunm: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Seat Row</Form.Label>
                <Form.Control
                  type="number"
                  value={newSeat.seatRow}
                  onChange={(e) => setNewSeat({ ...newSeat, seatRow: parseInt(e.target.value) })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Seat Status</Form.Label>
                <Form.Select
                  value={newSeat.seatStatus}
                  onChange={(e) => setNewSeat({ ...newSeat, seatStatus: parseInt(e.target.value) })}
                >
                  <option value={0}>EMPTY</option>
                  <option value={1}>HOLD</option>
                  <option value={2}>SUCCESS</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Seat Type ID</Form.Label>
                <Form.Control
                  type="number"
                  value={newSeat.seatType_id}
                  onChange={(e) => setNewSeat({ ...newSeat, seatType_id: parseInt(e.target.value) })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSeatFormModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddSeat}>
              Add Seat
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  };
  
  export default AdminTheater;