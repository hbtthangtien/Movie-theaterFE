import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Form,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { Box, Typography } from "@mui/material";

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // For search functionality
  const [page, setPage] = useState(1);
  const pageSize = 5; // As per API request
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for selected movie and its schedules
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://localhost:7127/api/manager/schdule/movieincoming`,
          {
            params: {
              search: searchQuery,
              page: page,
              pageSize: pageSize,
            },
          }
        );
        setMovies(response.data.movies);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch movies. Please try again later.");
        setLoading(false);
      }
    };
    fetchMovies();
  }, [searchQuery, page]);

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when a new search is made
  };

  // Function to handle movie click
  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);
    setShowScheduleModal(true);
    setSchedules([]);
    setScheduleLoading(true);
    setScheduleError(null);

    try {
      const response = await axios.get(
        `https://localhost:7127/api/manager/schdule/schedulebymovieid`,
        {
          params: {
            movieid: movie.movieId,
          },
        }
      );
      setSchedules(response.data);
      setScheduleLoading(false);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setScheduleError("Failed to fetch schedules. Please try again later.");
      setScheduleLoading(false);
    }
  };

  // Function to handle schedule deletion
  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await axios.delete(
          `https://localhost:7127/api/manager/schdule/scheduleremove`,
          {
            params: {
              scheduleid: scheduleId,
            },
          }
        );
        // Remove the deleted schedule from the state
        setSchedules((prevSchedules) =>
          prevSchedules.filter((s) => s.scheduleId !== scheduleId)
        );
        alert("Schedule deleted successfully.");
      } catch (error) {
        console.error("Error deleting schedule:", error);
        alert("Failed to delete schedule. Please try again later.");
      }
    }
  };

  return (
    <Box
      sx={{ boxShadow: 3, borderRadius: 2, p: 2, bgcolor: "background.paper", mt: 3 }}
    >
      {/* Header with Title and Create Showing Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Incoming Movies
        </Typography>
      </Box>

      {/* Search Form and Create Showing Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Form onSubmit={handleSearch} style={{ flexGrow: 1 }}>
          <Row className="align-items-center">
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search movies"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
          </Row>
        </Form>
        <Link to="/createShowing">
          <Button variant="success">Create Showing</Button>
        </Link>
      </Box>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Movie ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Version</th>
                <th>Type</th>
                <th>Director</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr
                  key={movie.movieId}
                  onClick={() => handleMovieClick(movie)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{movie.movieId}</td>
                  <td>
                    <img
                      style={{ width: "50px" }}
                      src={movie.smallImage}
                      alt={movie.movieNameEnglish}
                    />
                  </td>
                  <td>{movie.movieNameEnglish}</td>
                  <td>{movie.version}</td>
                  <td>{movie.types.map((type) => type.typeName).join(", ")}</td>
                  <td>{movie.director}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Centered Pagination Controls */}
          <div className="pagination">
            <Button
              variant="primary"
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="me-2"
            >
              Prev
            </Button>
            <span className="pagination-page">Page {page}</span>
            <Button
              variant="primary"
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className="ms-2"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Modal to display schedules */}
      <Modal
        show={showScheduleModal}
        onHide={() => setShowScheduleModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Schedules for {selectedMovie?.movieNameEnglish}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {scheduleLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <Spinner animation="border" variant="primary" />
            </div>
          ) : scheduleError ? (
            <Alert variant="danger">{scheduleError}</Alert>
          ) : schedules.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Schedule ID</th>
                  <th>Show Date</th>
                  <th>Show Time</th>
                  <th>Theater</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.scheduleId}>
                    <td>{schedule.scheduleId}</td>
                    <td>{schedule.movieScheduleDate}</td>
                    <td>{schedule.scheduleTime}</td>
                    <td>{schedule.cinemeRoomName}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule.scheduleId)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No schedules available for this movie.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Box>
  );
};

export default AdminDashboard;
