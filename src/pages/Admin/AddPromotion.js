import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const AddPromotion = () => {
    const navigate = useNavigate();
    const [promotion, setPromotion] = useState({
        title: '',
        startTime: '',
        endTime: '',
        discountLevel: '',
        detail: '',
        imageFile: null
    });
    const [imageUrl, setImageUrl] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPromotion({
            ...promotion,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPromotion({
                ...promotion,
                imageFile: file
            });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation checks
        if (!promotion.title.trim()) {
            alert("Title is required.");
            return;
        }
        if (!promotion.startTime.trim()) {
            alert("Start Time is required.");
            return;
        }
        if (!promotion.endTime.trim()) {
            alert("End Time is required.");
            return;
        }
        if (!promotion.discountLevel.trim()) {
            alert("Discount Level is required.");
            return;
        }
        if (!promotion.detail.trim()) {
            alert("Detail is required.");
            return;
        }
        if (!promotion.imageFile) {
            alert("Image file is required.");
            return;
        }

        const formData = new FormData();
        Object.keys(promotion).forEach(key => {
            formData.append(key, promotion[key]);
        });
        try {
            const response = await axios.post(
              `https://localhost:7127/api/Promotion`,
              formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            );
            alert('Promotion Add success', response.data);
            navigate('/admin/promotions');
            
          } catch (error) {
            console.log(error);
            alert('Error adding promotion: ' + (error.response?.data || error.message))
          }
    };

    return (
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <h2>Add promotion</h2>
            <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                autoComplete="title"
                autoFocus
                value={promotion.title}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="startTime"
                label="Start Time"
                name="startTime"
                type="datetime-local"
                InputLabelProps={{
                    shrink: true,
                }}
                value={promotion.startTime}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="endTime"
                label="End Time"
                name="endTime"
                type="datetime-local"
                InputLabelProps={{
                    shrink: true,
                }}
                value={promotion.endTime}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="discountLevel"
                label="Discount Level"
                name="discountLevel"
                autoComplete="discountLevel"
                value={promotion.discountLevel}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="detail"
                label="Detail"
                name="detail"
                autoComplete="detail"
                multiline
                rows={4}
                value={promotion.detail}
                onChange={handleChange}
            />
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
                <Button variant="contained" component="span" sx={{ mt: 2, mb: 2 }}>
                    Upload Image
                </Button>
            </label>
            {imageUrl && (
                <Box sx={{ mt: 2 }}>
                    <img src={imageUrl} alt="Preview" style={{ width: 100, height: 100 }} />
                </Box>
            )}
            <div>
                <Button
                    type="submit"
                    
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Add
                </Button>
                <Button
                    variant="outlined"
                    component={Link}
                    to="/admin/promotions"                    
                    sx={{ mt: 3, mb: 2 }}
                >
                    Back
                </Button>
            </div>
        </Box>
    );
};

export default AddPromotion;
