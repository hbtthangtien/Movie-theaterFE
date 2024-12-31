import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
    Alert,
    Checkbox,
    ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import EditIcon from '@mui/icons-material/Edit';
import { MdDelete } from "react-icons/md";
import debounce from 'lodash/debounce';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const MoviesAdmin = () => {
    const [moviesData, setMoviesData] = useState([]);
    const [status, setStatus] = useState("0");
    const [openModal, setOpenModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieTypes, setMovieTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    useEffect(() => {
        const fetchMovieTypes = async () => {
            try {
                const response = await axios.get("https://localhost:7127/api/manager/movies/movietype");
                setMovieTypes(response.data);
            } catch (error) {
                console.error("Error fetching movie types:", error);
                setError("Failed to fetch movie types.");
            }
        };
        fetchMovieTypes();
    }, []);

    const fetchData = async (search = "", statusFilter = "0", currentPage = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("https://localhost:7127/api/manager/movies/paged", {
                params: {
                    status: statusFilter,
                    search: search,
                    page: currentPage,
                    pageSize: pageSize,
                },
            });

            const { movies, totalPages } = response.data;
            setMoviesData(movies);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Error fetching movie data:", error);
            setError("Failed to fetch movies. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(searchTerm, status, page);
    }, [searchTerm, status, page]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setPage(1); // Reset to first page on status change
    };

    const handlePreviousPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handleDelete = (id) => {
        const movieToDelete = moviesData.find((m) => m.movieId === id);

        if (movieToDelete) {
            if (window.confirm("Do you want to delete this movie?")) {
                axios
                    .delete(`https://localhost:7127/api/manager/movies/deletemovie?id=${id}`)
                    .then(() => {
                        alert("Delete success. Movie: " + movieToDelete.movieNameEnglish);
                        setMoviesData(moviesData.filter((m) => m.movieId !== id));
                    })
                    .catch((error) => {
                        console.error("Error deleting movie:", error);
                        alert("Error deleting movie. Please try again.");
                    });
            }
        }
    };

    const openUpdateModal = (movie) => {
        setSelectedMovie(movie);
        setOpenModal(true);
    };

    const closeUpdateModal = () => {
        setSelectedMovie(null);
        setOpenModal(false);
    };

    const handleUpdateMovie = async () => {
        try {

            const formData = new FormData();
            formData.append("MovieId", selectedMovie.movieId);
            formData.append("Director", selectedMovie.director);
            formData.append("MovieProductionCompany", selectedMovie.movieProductionCompany);
            formData.append("Duration", selectedMovie.duration);
            formData.append("MovieNameEnglish", selectedMovie.movieNameEnglish);
            formData.append("Actor", selectedMovie.actor);
            formData.append("Version", selectedMovie.version);
            formData.append("Content", selectedMovie.content);
            formData.append("FromDate", (selectedMovie.fromDate || {}));
            formData.append("ToDate", (selectedMovie.toDate || {}));
            if (selectedMovie.types) {
                selectedMovie.types.forEach((type, index) => {
                    formData.append(`types[${index}].typeId`, type.typeId);
                    formData.append(`types[${index}].typeName`, type.typeName);
                });
            }
            if (selectedMovie.smallImageFile) {
                formData.append("smallImage", selectedMovie.smallImageFile);
            } else {
                formData.append("smallImage", selectedMovie.smallImage || "");
            }


            // Gửi yêu cầu API
            await axios.put(
                "https://localhost:7127/api/manager/movies/updatemovie",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            await fetchData(searchTerm, status, page);
            closeUpdateModal();
            alert("Movie updated successfully");
        } catch (error) {
            console.error("Error updating movie:", error.response?.data || error.message);
            alert("Error updating movie!");
        }
    };

    return (
        <Box sx={{ boxShadow: 3, borderRadius: 2, p: 3, bgcolor: 'background.paper', mt: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Movies Admin
                </Typography>
                <Button
                    variant="contained"
                    color="success"
                    component={Link}
                    to="/admin/movies/addMovies"
                >
                    Create New Movie
                </Button>
            </Box>

            <Box
                component="form"
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Search Movie"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ width: '60%' }}
                />
                <FormControl variant="outlined" sx={{ width: '35%', ml: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={status} onChange={handleStatusChange} label="Status">
                        <MenuItem value="0">All</MenuItem>
                        <MenuItem value="1">Incoming</MenuItem>
                        <MenuItem value="2">Upcoming</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Movie ID</StyledTableCell>
                                    <StyledTableCell>Image</StyledTableCell>
                                    <StyledTableCell>Title</StyledTableCell>
                                    <StyledTableCell>Version</StyledTableCell>
                                    <StyledTableCell>Type</StyledTableCell>
                                    <StyledTableCell>Director</StyledTableCell>
                                    <StyledTableCell>Duration</StyledTableCell>
                                    <StyledTableCell>Date Range</StyledTableCell>
                                    <StyledTableCell>Edit</StyledTableCell>
                                    <StyledTableCell>Delete</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {moviesData.map((m) => (
                                    <TableRow key={m.movieId} hover>
                                        <StyledTableCell>{m.movieId}</StyledTableCell>
                                        <StyledTableCell>
                                            <img width="50px" src={m.smallImage} alt={m.movieNameEnglish} />
                                        </StyledTableCell>
                                        <StyledTableCell>{m.movieNameEnglish}</StyledTableCell>
                                        <StyledTableCell>{m.version}</StyledTableCell>
                                        <StyledTableCell>
                                            {m.types.map((type) => type.typeName).join(", ")}
                                        </StyledTableCell>
                                        <StyledTableCell>{m.director}</StyledTableCell>
                                        <StyledTableCell>{m.duration} mins</StyledTableCell>
                                        <StyledTableCell>
                                            {new Date(m.fromDate).toLocaleDateString()} - {new Date(m.toDate).toLocaleDateString()}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <IconButton
                                                color="primary"
                                                aria-label="edit movie"
                                                onClick={() => openUpdateModal(m)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <IconButton
                                                onClick={() => handleDelete(m.movieId)}
                                                color="error"
                                                aria-label="delete movie"
                                            >
                                                <MdDelete />
                                            </IconButton>
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            mt: 3,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                            sx={{ mr: 2 }}
                        >
                            Prev
                        </Button>
                        <Typography variant="body1">Page {page} of {totalPages}</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNextPage}
                            disabled={page >= totalPages}
                            sx={{ ml: 2 }}
                        >
                            Next
                        </Button>
                    </Box>
                </>
            )}

            <Dialog open={openModal} onClose={closeUpdateModal} maxWidth="md" fullWidth>
                <DialogTitle>Edit Movie</DialogTitle>
                <DialogContent>
                    {selectedMovie && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                label="Movie Name (English)"
                                value={selectedMovie.movieNameEnglish || ""}
                                onChange={(e) => setSelectedMovie({ ...selectedMovie, movieNameEnglish: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Director"
                                value={selectedMovie.director || ""}
                                onChange={(e) => setSelectedMovie({ ...selectedMovie, director: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Duration (mins)"
                                value={selectedMovie.duration || ""}
                                onChange={(e) => setSelectedMovie({ ...selectedMovie, duration: e.target.value })}
                                fullWidth
                            />
                            <FormControl fullWidth>
                                <InputLabel>Version</InputLabel>
                                <Select
                                    value={selectedMovie.version || ""}
                                    onChange={(e) => setSelectedMovie({ ...selectedMovie, version: e.target.value })}
                                    label="Version"
                                >
                                    <MenuItem value="IMAX">IMAX</MenuItem>
                                    <MenuItem value="4DX">4DX</MenuItem>
                                    <MenuItem value="3D">3D</MenuItem>
                                    <MenuItem value="2D">2D</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Actors"
                                value={selectedMovie.actor || ""}
                                onChange={(e) => setSelectedMovie({ ...selectedMovie, actor: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Production Company"
                                value={selectedMovie.movieProductionCompany || ""}
                                onChange={(e) => setSelectedMovie({ ...selectedMovie, movieProductionCompany: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Content"
                                value={selectedMovie.content || ""}
                                onChange={(e) => setSelectedMovie({ ...selectedMovie, content: e.target.value })}
                                fullWidth
                            />
                            <FormControl fullWidth variant="outlined" className="mb-3">
                                <InputLabel>Type</InputLabel>
                                <Select
                                    multiple
                                    value={selectedMovie?.types?.map(type => type.typeId) || []}
                                    onChange={(e) => {
                                        const updatedTypes = e.target.value.map(typeId => {
                                            const selectedType = movieTypes.find(type => type.typeId === typeId);
                                            return { typeId: selectedType.typeId, typeName: selectedType.typeName };
                                        });
                                        setSelectedMovie({ ...selectedMovie, types: updatedTypes });
                                    }}
                                    renderValue={(selected) =>
                                        selected.map(
                                            typeId => movieTypes.find(type => type.typeId === typeId)?.typeName
                                        ).join(', ')
                                    }
                                    label="Type"
                                    name="type"
                                >
                                    {movieTypes.map((type) => (
                                        <MenuItem key={type.typeId} value={type.typeId}>
                                            {type.typeName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="From Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={
                                    selectedMovie.fromDate
                                        ? new Date(selectedMovie.fromDate).toISOString().substring(0, 10)
                                        : ""
                                }
                                onChange={(e) => setSelectedMovie({ ...selectedMovie, fromDate: e.target.value })}
                                fullWidth
                            />

                            <TextField
                                label="To Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={
                                    selectedMovie.toDate
                                        ? new Date(selectedMovie.toDate).toISOString().substring(0, 10)
                                        : ""
                                }
                                onChange={(e) => setSelectedMovie({ ...selectedMovie, toDate: e.target.value })}
                                fullWidth
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="subtitle1">Current Image:</Typography>
                                <img
                                    src={previewImage || selectedMovie.smallImage || ""}
                                    alt="Movie Preview"
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                />
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Upload New Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setSelectedMovie({ ...selectedMovie, smallImage: file });
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    setPreviewImage(reader.result);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </Button>
                            </Box>

                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeUpdateModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateMovie} variant="contained" color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MoviesAdmin;
