import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Input,
  MenuItem,
  Select,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import dayjs from 'dayjs';

const CreateShowing = () => {
  const [moviesData, setMoviesData] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedTheaterSeats, setSelectedTheaterSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(''); // Single time input
  const [selectedTimes, setSelectedTimes] = useState([]); // Array of times
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const onTheaterMoviesData = await axios.get("https://localhost:7127/api/manager/movies/allmovies");
        setMoviesData(onTheaterMoviesData.data);
        const response = await axios.get('https://localhost:7127/api/manager/cinemarooms/listcinemaroom');
        setTheaters(response.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleMovieChange = (event) => {
    setSelectedMovie(event.target.value);
  };

  const handleTheaterChange = async (event) => {
    setSelectedTheater(event.target.value);

    // Fetch seating data for the selected theater
    try {
      const theater = theaters.find(theater => theater.cinemeRoomName === event.target.value);
      if (theater) {
        const response = await axios.get(`https://localhost:7127/api/manager/cinemarooms/listcinemaroom`);
        setSelectedTheaterSeats(response.data.seat);
      }
    } catch (error) {
      console.error('Error fetching theater seats:', error);
    }
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleAddTime = () => {
    if (selectedTime.trim() !== '') {
      setSelectedTimes([...selectedTimes, selectedTime.trim()]);
      setSelectedTime('');
    }
  };

  const handleRemoveTime = (index) => {
    const newTimes = [...selectedTimes];
    newTimes.splice(index, 1);
    setSelectedTimes(newTimes);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleCreateShowing = async () => {
    // Basic validation
    if (!selectedMovie || !selectedTheater || !selectedDate || selectedTimes.length === 0) {
      window.alert('Please fill out all fields and add at least one show time.');
      return;
    }

    // Prepare data to be saved
    const theater = theaters.find(theater => theater.cinemeRoomName === selectedTheater);
    const cinemaRoomID = theater ? theater.cinemaRoomId : 0;

    const schedules = selectedTimes.map((time) => {
      const date = selectedDate.toDate();
      return {
        scheduleId: 0,      
        scheduleTime: time,
        movieScheduleDate: selectedDate.format('YYYY-MM-DD'),
        cinemaRoomID: cinemaRoomID,
        movieID: selectedMovie,
      };
    });

    try {
      // Send POST request to save the showing information
      const response = await axios.post(
        'https://localhost:7127/api/manager/schdule/moviesettime',
        schedules,
        {
          headers: {
            'Content-Type': 'application/json-patch+json',
          },
        }
      );
      console.log('Showing created:', response.data);
      // Optionally reset the form or provide feedback to the user
      setSelectedMovie('');
      setSelectedTheater('');
      setSelectedTimes([]);
      setSelectedTime('');
      setSelectedDate(dayjs());
      setSelectedTheaterSeats([]);
      window.alert('Showing created successfully!');
    } catch (error) {
      console.error('Error creating showing:', error);
      window.alert('Error creating showing. Please try again later.');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Box sx={{ boxShadow: 3, borderRadius: 2, p: 2, bgcolor: 'background.paper', mt: 4 }}>
          <Typography variant="h2" gutterBottom>CREATE NEW SHOWING</Typography>
          <Row>
            {selectedMovie ? (
              <Col md={1}>
                <img
                  className="p-2"
                  style={{ width: "100px" }}
                  src={moviesData.find(m => m.movieId === selectedMovie)?.smallImage}
                  alt="Movie Poster"
                />
              </Col>
            ) : null}
            <Col md={11}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="movie-select">Choose Movie for Showing</InputLabel>
                <Select
                  value={selectedMovie}
                  onChange={handleMovieChange}
                  fullWidth
                  label="Choose Movie for Showing"
                  id="movie-select"
                >
                  <MenuItem value="">Select a movie</MenuItem>
                  {moviesData.map((movie) => (
                    <MenuItem key={movie.movieId} value={movie.movieId}>
                      {movie.movieNameEnglish}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Col>
          </Row>

          <FormControl required fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel htmlFor="theater-select">Choose Theater to Show</InputLabel>
            <Select
              value={selectedTheater}
              onChange={handleTheaterChange}
              fullWidth
              label="Choose Theater to Show"
              id="theater-select"
            >
              <MenuItem value="">Select a theater</MenuItem>
              {theaters.map((theater) => (
                <MenuItem key={theater.cinemaRoomId} value={theater.cinemeRoomName}>
                  {theater.cinemeRoomName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl required fullWidth sx={{ mb: 2, mt: 1 }}>
            <DatePicker
              label="Select Show Date"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => <Input {...params} />}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel htmlFor="time-input">Enter Show Time</InputLabel>
            <Input
              id="time-input"
              value={selectedTime}
              onChange={handleTimeChange}
              fullWidth
              placeholder="e.g., 6 AM : 9 AM"
            />
          </FormControl>

          <Button onClick={handleAddTime} variant="contained" sx={{ mt: 1, mb: 2 }}>
            Add Time
          </Button>

          {selectedTimes.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Added Show Times:</Typography>
              <ul>
                {selectedTimes.map((time, index) => (
                  <li key={index}>
                    {time}{' '}
                    <Button size="small" onClick={() => handleRemoveTime(index)}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          <Button onClick={handleCreateShowing} variant="contained" sx={{ mt: 2 }}>
            Create
          </Button>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default CreateShowing;
