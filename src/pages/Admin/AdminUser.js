import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
const UsersList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setOpenModal(false);
  };
  const handleUpdateEmployee = async () => {
    try {
      await axios.put(
        `https://localhost:7127/api/admin/employees?employeeId=${selectedEmployee.employeeId}`,
        selectedEmployee
      );
      setEmployees(
        employees.map((e) =>
          e.employeeId === selectedEmployee.employeeId ? selectedEmployee : e
        )
      );
      handleCloseModal();
      alert("Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };
  useEffect(() => {
    setPage(1);
  }, [search]);

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  const fetchEmployees = async (search, page) => {
    setLoading(true);
    setError("");
    setEmployees([]);
    try {
      const response = await axios.get(
        `https://localhost:7127/api/admin/emloyees`,
        {
          params: { search, page },
        }
      );

      let hasNextPage = true;

      // Fetch dữ liệu của trang tiếp theo
      try {
        await axios.get(
          `https://localhost:7127/api/admin/emloyees`,
          {
            params: { search, page: page + 1 },
          }
        );
      } catch (err) {
        if (err.response && err.response.status === 404) {
          hasNextPage = false; // Không có dữ liệu ở trang tiếp theo
        } else {
          throw err; // Các lỗi khác
        }
      }
      setHasMore(hasNextPage);
      setEmployees(response.data);
    } catch (err) {
      setError(
        err.response?.data || "An error occurred while fetching employees."
      );
    } finally {
      setLoading(false);
    }
  };
  const deleteEmployee = async (employeeId) => {
    // Confirm before deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return; // Exit if user cancels

    try {
      const response = await axios.delete(
        `https://localhost:7127/api/admin/emoloyees?employeeId=${employeeId}`
      );
      // alert(response.data.message); // Show success message
      fetchEmployees(search, page); // Refresh the employee list
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "An error occurred while deleting the employee."
      );
    }
  };

  useEffect(() => {
    fetchEmployees(search, page);
  }, [search, page]);

  return (
    <>
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        <div className="header-actions">
          <h2>Employee List</h2>
          <div className="actions-container">
            <Link to="/admin/users/add" className="add-btn">
              Add New Employee
            </Link>
            <input
              type="text"
              className="search-bar"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {loading && <p>Loading employees...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Account</StyledTableCell>
                <StyledTableCell>Full Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone Number</StyledTableCell>
                <StyledTableCell>Gender</StyledTableCell>
                <StyledTableCell>Date of Birth</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>Identity Card</StyledTableCell>
                <StyledTableCell>Register Date</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            {employees.length > 0 ? (
              <TableBody>
                {employees.map((employee) => (
                  <StyledTableRow key={employee.employeeId}>
                    <StyledTableCell>{employee.username}</StyledTableCell>
                    <StyledTableCell>{employee.fullname}</StyledTableCell>
                    <StyledTableCell>{employee.email}</StyledTableCell>
                    <StyledTableCell>{employee.phoneNumber}</StyledTableCell>
                    <StyledTableCell>{employee.gender}</StyledTableCell>
                    <StyledTableCell>{employee.dateOfBirth}</StyledTableCell>
                    <StyledTableCell>{employee.address}</StyledTableCell>
                    <StyledTableCell>{employee.identityCard}</StyledTableCell>
                    <StyledTableCell>{employee.registerDate}</StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        onClick={() => openEditModal(employee)}
                        color="primary"
                        aria-label="edit employee"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteEmployee(employee.employeeId)}
                        color="warning"
                        aria-label="delete employee"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            ) : (
              !loading && <p>No employees found</p>
            )}
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            className={`pagination-btn ${page <= 1 ? "disabled" : ""}`}
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </button>
          <span className="pagination-page">Page {page}</span>
          <button
            className={`pagination-btn ${!hasMore ? "disabled" : ""}`}
            disabled={!hasMore}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </Box>

      {/* Edit Employee Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            name="fullname"
            value={selectedEmployee?.fullname || ""}
            onChange={(e) =>
              setSelectedEmployee({
                ...selectedEmployee,
                fullname: e.target.value,
              })
            }
            className="mb-3"
            required
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={selectedEmployee?.email || ""}
            onChange={(e) =>
              setSelectedEmployee({
                ...selectedEmployee,
                email: e.target.value,
              })
            }
            className="mb-3"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            name="phoneNumber"
            value={selectedEmployee?.phoneNumber || ""}
            onChange={(e) =>
              setSelectedEmployee({
                ...selectedEmployee,
                phoneNumber: e.target.value,
              })
            }
            className="mb-3"
            required
          />
          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            name="address"
            value={selectedEmployee?.address || ""}
            onChange={(e) =>
              setSelectedEmployee({
                ...selectedEmployee,
                address: e.target.value,
              })
            }
            className="mb-3"
            required
          />
          <TextField
            fullWidth
            label="Date of Birth"
            variant="outlined"
            type="date"
            name="dateOfBirth"
            value={selectedEmployee?.dateOfBirth || ""}
            onChange={(e) =>
              setSelectedEmployee({
                ...selectedEmployee,
                dateOfBirth: e.target.value,
              })
            }
            className="mb-3"
            InputLabelProps={{ shrink: true }}
            required
          />
          <div className="gender-selection">
            <label>
              <input
                type="checkbox"
                checked={selectedEmployee?.gender === "Nam"}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    gender: e.target.checked ? "Nam" : "Nữ", // Nếu chọn Male thì lưu là "Nam", ngược lại là "Nữ"
                  })
                }
              />
              Male
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedEmployee?.gender === "Nữ"}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    gender: e.target.checked ? "Nữ" : "Nam", // Nếu chọn Female thì lưu là "Nữ", ngược lại là "Nam"
                  })
                }
              />
              Female
            </label>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateEmployee}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersList;
