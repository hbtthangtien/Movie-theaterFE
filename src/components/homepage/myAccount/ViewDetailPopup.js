import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material";

const TicketDetailPopup = ({ open, onClose, ticket, userInfo }) => {
  if (!ticket) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.25rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        View Detail
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {/* Phần hiển thị thông tin vé */}
        <Box display="flex" gap={2} mb={3}>
          <Box
            width="80px"
            height="80px"
            sx={{ 
              backgroundColor: "#f0f0f0", 
              borderRadius: "8px",
              overflow: "hidden"
            }}
          >
            {/* Hiển thị ảnh từ ticket.image nếu có */}
            <img
              src={ticket.image || "https://via.placeholder.com/80"}
              alt="Movie"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              {ticket.movieName || "Movie name"}
            </Typography>
          </Box>
        </Box>

        {/* Thông tin vé */}
        <Box
          sx={{
            backgroundColor: "#fafafa",
            p: 2,
            borderRadius: 2,
            mb: 3,
            border: "1px solid #eee",
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            <strong>Room:</strong> {ticket.cinema_room_name || "N/A"}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Date:</strong> {ticket.bookingDate ? new Date(ticket.bookingDate).toLocaleDateString() : "N/A"}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Time:</strong> {ticket.scheduleShowTime || "N/A"}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Seat:</strong> {ticket.seat || "N/A"}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Use Score:</strong> {ticket.useScore ?? 0}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Add Score:</strong> {ticket.addScore ?? 0}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Status:</strong> {ticket.status || "N/A"}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Total:</strong> {ticket.totalMoney ? ticket.totalMoney.toLocaleString("en-US") : "N/A"} VNĐ
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: "#f9f9f9",
            p: 2,
            borderRadius: 2,
            border: "1px solid #eee",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Member
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Username:</strong> {userInfo.username || "N/A"}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Fullname:</strong> {userInfo.fullname || "N/A"}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Phone:</strong> {userInfo.phoneNumber || "N/A"}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Identity Card:</strong> {userInfo.identityCard || "N/A"}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: "1px solid #ddd" }}>
        <Button variant="contained" color="primary" onClick={onClose} sx={{ textTransform: "none", fontWeight: "bold" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketDetailPopup;
