import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Box, Button, Modal, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const FoodList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newFood, setNewFood] = useState({
    name: "",
    img: "",
    desc: "",
    price: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9999/popCorns");
      setFoodItems(response.data);
    } catch (error) {
      console.log("Error fetching food data:", error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewFood({
      name: "",
      img: "",
      desc: "",
      price: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood((prevFood) => ({
      ...prevFood,
      [name]: value,
    }));
  };

  const handleAddFood = async () => {
    try {
      const response = await axios.post("http://localhost:9999/popCorns", newFood);
      if (response.status === 201) {
        setFoodItems([...foodItems, response.data]);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

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
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <>
      <Box sx={{ boxShadow: 3, borderRadius: 2, p: 2, bgcolor: "background.paper" }}>
        <h2>Food Items</h2>
        <Button variant="contained" color="secondary" onClick={handleOpenModal} sx={{ mb: 4 }}>
          Add New Food
        </Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="food items table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {foodItems.map((food) => (
                <StyledTableRow key={food.id}>
                  <StyledTableCell>{food.name}</StyledTableCell>
                  <StyledTableCell>
                    <img src={food.img} alt={food.name} style={{ width: "50px" }} />
                  </StyledTableCell>
                  <StyledTableCell>{food.desc}</StyledTableCell>
                  <StyledTableCell>{food.price.toLocaleString("vi-VN")} VND</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal for adding new food item */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", boxShadow: 24, p: 4, minWidth: 400 }}>
          <h2>Add New Food</h2>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newFood.name}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Image URL"
            name="img"
            value={newFood.img}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            name="desc"
            value={newFood.desc}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={newFood.price}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddFood}>
            Add Food
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default FoodList;
