import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Sidebar from "../../sidebar/sidebar";
import TicketDetailPopup from "./ViewDetailPopup";

const BookingHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null); // Chứa dữ liệu chi tiết vé

  // Styled components for table
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7127/api/member/accounts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setUserInfo(response.data);
      } catch (err) {
        setError("Failed to fetch user information.");
      }
    };
    fetchUserInfo();
  }, []);

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Fetch booking tickets
  const fetchTickets = async (search, page) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://localhost:7127/api/member/tickets",
        {
          params: { movieName: search, page },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Check if the next page exists
      let hasNextPage = true;
      try {
        const nextPageResponse = await axios.get(
          "https://localhost:7127/api/member/tickets",
          {
            params: { movieName: search, page: page + 1 },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (nextPageResponse.data.length === 0) {
          hasNextPage = false;
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          hasNextPage = false;
        }
      }

      setHasMore(hasNextPage);
      setTickets(response.data);
    } catch (err) {
      let hasNextPage = false;
      setHasMore(hasNextPage);
      if (err.response?.status === 404) {
        setTickets([]); // Clear list
        setError(err.response.data);
      } else {
        setError("Failed to fetch booking history.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(search, page);
  }, [search, page]);

  const handleViewClick = async (ticketId) => {
    // Gọi API để lấy chi tiết vé
    try {
      const response = await axios.get(
        `https://localhost:7127/api/member/tickets/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setSelectedTicket(response.data);
    } catch (err) {
      console.error("Failed to fetch ticket detail:", err);
    }
  };

  const handleCloseDialog = () => {
    setSelectedTicket(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        padding: "20px",
        gap: "20px",
      }}
    >
      <Sidebar userInfo={userInfo} />
      <Box sx={{ flex: 1, backgroundColor: "background.paper", padding: 2 }}>
        <h2>Booking History</h2>
        <TextField
          fullWidth
          label="Search movie"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          margin="normal"
        />
        {error && <Alert severity="error">{error}</Alert>}
        {loading && <p>Loading tickets...</p>}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>Movie Name</StyledTableCell>
                <StyledTableCell>Booking Date</StyledTableCell>
                <StyledTableCell>Total Amount</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket, index) => (
                <StyledTableRow key={ticket.invoiceId}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{ticket.movieName}</StyledTableCell>
                  <StyledTableCell>
                    {ticket.bookingDate
                      ? new Date(ticket.bookingDate).toLocaleDateString()
                      : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {ticket.totalMoney
                      ? ticket.totalMoney.toLocaleString("en-US")
                      : "N/A"}{" "}
                    VNĐ
                  </StyledTableCell>
                  <StyledTableCell>{ticket.status || "N/A"}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewClick(ticket.invoiceId)}
                    >
                      View
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="pagination">
          <Button
            variant="primary"
            color="secondary"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </Button>
          <span className="pagination-page">Page {page}</span>
          <Button
            variant="primary"
            color="secondary"
            disabled={!hasMore}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
          </div>
      </Box>

      <TicketDetailPopup
        open={!!selectedTicket}
        onClose={handleCloseDialog}
        ticket={selectedTicket}
        userInfo={userInfo}
      />
    </Box>
  );
};

export default BookingHistory;
