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

const HistoryScore = () => {
  const [scores, setScores] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [historyType, setHistoryType] = useState("adding");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Fetch history scores
  const fetchScores = async () => {
    setLoading(true);
    setError("");
    try {
      let hasNextPage = true;
      const response = await axios.get(
        "https://localhost:7127/api/member/scores",
        {
          params: { fromDate, toDate, historyType, page },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Check if the next page exists
       
      try {
        const nextPageResponse = await axios.get(
          "https://localhost:7127/api/member/scores",
          {
            params: { fromDate, toDate, historyType, page: page + 1 },
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
      setScores(response.data);
    } catch (err) {
       let hasNextPage = false;
       setHasMore(hasNextPage);
      if (err.response?.status === 404) {
        setScores([]); // Clear list
        setError("No scores found for the specified criteria.");
      } else {
        setError("Failed to fetch history scores.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever filters or page changes
  useEffect(() => {
    fetchScores();
  }, [fromDate, toDate, historyType, page]);

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
        <h2>History of Scores</h2>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <TextField
            label="From Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <TextField
            label="To Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <Button
            variant={historyType === "adding" ? "contained" : "outlined"}
            onClick={() => {
              setHistoryType("adding");
              setPage(1);
            }}
          >
            History of Score Adding
          </Button>
          <Button
            variant={historyType === "using" ? "contained" : "outlined"}
            onClick={() => {
              setHistoryType("using");
              setPage(1);
            }}
          >
            History of Score Using
          </Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        {loading && <p>Loading scores...</p>}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>Date Created</StyledTableCell>
                <StyledTableCell>Movie Name</StyledTableCell>
                <StyledTableCell>Added Score</StyledTableCell>
                <StyledTableCell>Used Score</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scores.map((score, index) => (
                <StyledTableRow key={score.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>
                    {score.bookingDate
                      ? new Date(score.bookingDate).toLocaleString()
                      : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>{score.movieName || "N/A"}</StyledTableCell>
                  <StyledTableCell>{score.addScore || "0.0"}</StyledTableCell>
                  <StyledTableCell>{score.useScore || "0.0"}</StyledTableCell>
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
    </Box>
  );
};

export default HistoryScore;
