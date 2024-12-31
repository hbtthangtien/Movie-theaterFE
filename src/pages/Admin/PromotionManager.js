import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Box, TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { debounce } from 'lodash';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [page,setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [checkPaging, setCheckPaging] = useState(false);
  const fetchPromotions = async (searchKey = '') => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://localhost:7127/api/Promotion?page=${page}&searchTerm=${searchKey || ''}`
      );
      if (Array.isArray(response.data.promotions) && response.data.promotions.length >0) {
        setPromotions(response.data.promotions);
        checkEnable(page+1,searchKey);
      } else {
        
        throw new Error("Data is not an array");
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      setCheckPaging(false)
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };
  const debouncedSearch = useCallback(
    debounce((key) => {
      fetchPromotions(key);
    }, 300),
    [] // Dependencies
  );

  const handleSearch = (e) => {
    const value = e.target.value || ''; // Fallback to an empty string
    setSearchKey(value); // Update state
    setPage(1);
    debouncedSearch(value); // Trigger search with valid value
  };

  useEffect(() => {
    fetchPromotions(''); // Fetch all promotions on mount
    return () => {
      debouncedSearch.cancel(); // Cleanup debounce on unmount
    };
  }, []);

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
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const openEditModal = (promotion) => {
    setSelectedPromotion(promotion);
    setOpenModal(true);
    setImagePreviewUrl(promotion.image || '');
  };

  const handleCloseModal = () => {
    setSelectedPromotion(null);
    setOpenModal(false);
  };

  const   handleUpdatePromotion = async () => {
    const formData = new FormData();
    formData.append("title", selectedPromotion.title);
    formData.append("detail", selectedPromotion.detail);
    formData.append("discountLevel", selectedPromotion.discountLevel);
    formData.append("startTime", selectedPromotion.startTime);
    formData.append("endTime", selectedPromotion.endTime);
    if (selectedPromotion.file) {
      formData.append("imageFile", selectedPromotion.file);
    }  
    try {
      const response = await axios.put(
        `https://localhost:7127/api/Promotion/${selectedPromotion.promotionId}`,
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log('Promotion Updated', response.data);
      fetchPromotions(); // Refresh the promotions list
      handleCloseModal();
    } catch (error) {
      alert('Error adding promotion: ' + (error.response?.data || error.message))
    }
  };
  
  const handleDeletePromotion = async (promotionId) => {
    // Confirm before deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return; // Exit if user cancels

    try {
      const response = await axios.delete(
        `https://localhost:7127/api/Promotion/${promotionId}`
      );      
      fetchPromotions();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "An error occurred while deleting the employee."
      );
    }
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedPromotion({ ...selectedPromotion, file: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {fetchPromotions();}, []);
  useEffect(() => {
    fetchPromotions(searchKey, page);
    checkEnable(page+1,searchKey);
  }, [searchKey, page]);

  const checkEnable = async (page,search)=>{
    try {
      const response = await axios.get(
        `https://localhost:7127/api/Promotion?page=${page}&searchTerm=${search || ''}`
      );
      if (Array.isArray(response.data.promotions) && response.data.promotions.length >0) {
          setCheckPaging(true);
      }else{
        setCheckPaging(false);
      }
    } catch (error) {
        setCheckPaging(false);
    } 
  }
  return (
    <>
      <Box sx={{ boxShadow: 3, borderRadius: 2, p: 2, bgcolor: 'background.paper', mt: 4 }}>
        <h3 style={{ textAlign: 'center' }}>Promotion Management</h3>
        <div className="actions-container">
          <Button variant="contained" color="success"
                  component={Link} to='/admin/addPromotion'
                  style={{ padding: "10px" }}>
            Create Promotion
          </Button>
          <TextField
            sx={{ my: 2, height: '35px' }}                    
            variant="outlined"
            placeholder="Enter search key"
            style={{ marginBottom: "30px" }}
            onChange={handleSearch}
          />
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Promotion Id</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>               
                <StyledTableCell>Start time</StyledTableCell>
                <StyledTableCell>End time</StyledTableCell>
                <StyledTableCell>Discount level</StyledTableCell>
                <StyledTableCell>Detail</StyledTableCell>                
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>            
            {promotions.length > 0 ? (
              <TableBody>
              {promotions.map((promotion) => (
                <StyledTableRow key={promotion.promotionId}>
                  <StyledTableCell>{promotion.promotionId}</StyledTableCell>
                  <StyledTableCell>{promotion.title}</StyledTableCell>                  
                  <StyledTableCell>{promotion.startTime}</StyledTableCell>
                  <StyledTableCell>{promotion.endTime}</StyledTableCell>
                  <StyledTableCell>{promotion.discountLevel}</StyledTableCell>
                  <StyledTableCell>{promotion.detail}</StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      onClick={() => openEditModal(promotion)}
                      color="primary"
                      aria-label="edit promotion"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeletePromotion(promotion.promotionId)}
                      color="warning"
                      aria-label="delete promotion"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
            ):(!loading && <p>No Promotions found</p>)}
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
            className={`pagination-btn ${checkPaging ? "" : "disabled"}`}
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!checkPaging}
          >
            Next 
          </button>
        </div>
      </Box>

      {/* Modal for updating promotion */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Edit Promotion</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="dense"
            value={selectedPromotion?.title || ''}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, title: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Detail"
            variant="outlined"
            margin="dense"
            value={selectedPromotion?.detail || ''}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, detail: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Discount Level"
            variant="outlined"
            margin="dense"
            value={selectedPromotion?.discountLevel || ''}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, discountLevel: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Start Time"
            variant="outlined"
            margin="dense"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            value={selectedPromotion?.startTime || ''}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, startTime: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="End Time"
            variant="outlined"
            margin="dense"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            value={selectedPromotion?.endTime || ''}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, endTime: e.target.value })}
            required
          />
        <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    style={{ display: 'block', marginBottom: 10 }}
  />
  {imagePreviewUrl && (
    <Box sx={{ mt: 2, mb: 2 }}>
      <img src={imagePreviewUrl} alt="Preview" style={{ width: 50, height: 50 }} />
    </Box>
  )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdatePromotion} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Promotions;
