import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Container, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Switch, TextField, Box } from "@mui/material";
import { duration } from "moment/moment";

const AddMovies = () => {
    const [movie, setMovie] = useState({
        movieId: '0',
        movieNameEnglish: '',
        version: '',
        typeIds: [],
        type: '',
        director: '',
        duration: '',
        fromDate: '',
        toDate: '',
        content: '',
        actor: '',
        onTheater: false,
        smallImageFile: null,
    });
    const navigate = useNavigate();
    const [types, setTypes] = useState([]);
    useEffect(() => {
        axios.get("https://localhost:7127/api/manager/movies/movietype")
            .then(response => setTypes(response.data))
            .catch(error => console.error("Error fetching types:", error));
    }, []);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMovie({
            ...movie,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setMovie({
            ...movie,
            [name]: files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('MovieId', movie.movieId || "0");
            formData.append("MovieNameEnglish", movie.movieNameEnglish || "");
            formData.append("MovieNameVn", movie.movieNameVn || "");
            formData.append("Director", movie.director || "");
            formData.append("Duration", movie.duration || "");
            formData.append("Version", movie.version || "");
            formData.append("Content", movie.content || "");
            formData.append("Actor", movie.actor || "");
            formData.append("MovieProductionCompany", movie.movieProductionCompany || "");
            formData.append("FromDate", (movie.fromDate || {}));
            formData.append("ToDate", (movie.toDate || {}));
            movie.typeIds.forEach((typeId, index) => {
                formData.append(`MovieTypes[${index}]`, typeId);
            });
            if (movie.smallImageFile) {
                formData.append("smallImage", movie.smallImageFile);
            }
            // Gửi yêu cầu API
            await axios.post("https://localhost:7127/api/manager/movies/moviecreate", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Movie added successfully");
            navigate("/admin/movies");
        } catch (error) {
            console.error("Error adding movie:", error.response?.data || error.message);
            alert("Error adding movie!");
        }
    };
    return (
        <Container sx={{ pt: 4 }}>
            <Box sx={{ p: 3, bgcolor: "background.paper", boxShadow: 3, borderRadius: 2 }}>
                <h3>Add New Movie</h3>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        className="mb-3"
                        name="movieNameEnglish"
                        value={movie.movieNameEnglish}
                        onChange={handleChange}
                        required
                    />
                    <FormControl fullWidth variant="outlined" className="mb-3">
                        <InputLabel>Version</InputLabel>
                        <Select
                            value={movie.version}
                            onChange={handleChange}
                            label="Version"
                            name="version"
                        >
                            <MenuItem value="2D">2D</MenuItem>
                            <MenuItem value="3D">3D</MenuItem>
                            <MenuItem value="4D">4D</MenuItem>
                            <MenuItem value="IMAX">IMAX</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth variant="outlined" className="mb-3">
                        <InputLabel>Type</InputLabel>
                        <Select
                            multiple
                            value={movie.typeIds} // Luôn đảm bảo value là một mảng
                            onChange={(e) => setMovie({ ...movie, typeIds: e.target.value })}
                            label="Type"
                            name="typeIds"
                            renderValue={(selected) =>
                                types
                                    .filter((type) => selected.includes(type.typeId))
                                    .map((type) => type.typeName)
                                    .join(", ")
                            }
                            required
                        >
                            {types.map((type) => (
                                <MenuItem key={type.typeId} value={type.typeId}>
                                    {type.typeName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Director"
                        variant="outlined"
                        className="mb-3"
                        name="director"
                        value={movie.director}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="MovieProductionCompany"
                        variant="outlined"
                        className="mb-3"
                        name="movieproductioncompany"
                        value={movie.MovieProductionCompany}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Duration (in minutes)"
                        variant="outlined"
                        className="mb-3"
                        type="number"
                        name="duration"
                        value={movie.duration}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Content"
                        variant="outlined"
                        className="mb-3"
                        name="content"
                        value={movie.content}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Actor"
                        variant="outlined"
                        className="mb-3"
                        name="actor"
                        value={movie.actor}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="From Date"
                        variant="outlined"
                        className="mb-3"
                        type="date"
                        name="fromDate"
                        InputLabelProps={{ shrink: true }}
                        value={movie.fromDate}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="To Date"
                        variant="outlined"
                        className="mb-3"
                        type="date"
                        name="toDate"
                        InputLabelProps={{ shrink: true }}
                        value={movie.toDate}
                        onChange={handleChange}
                        required
                    />
                    <Box className="mb-3">
                        <input
                            type="file"
                            name="smallImageFile"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Box>
                    <Button variant="contained" color="primary" type="submit">
                        Add Movie
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default AddMovies;
