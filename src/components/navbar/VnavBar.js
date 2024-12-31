import React, { useState } from 'react';
import { Container, List, ListItem, ListItemIcon, ListItemText, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaHome, FaFilm, FaLandmark, FaUsers, FaPizzaSlice, FaGift } from 'react-icons/fa';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <Container maxWidth="xs" sx={{ bgcolor: 'background.paper', padding: '20px', boxShadow: 3, borderRadius: 1 }}>
      <Typography variant="h4" gutterBottom>Welcome Admin</Typography>
      <img style={{ width: '100px' }} src='/images/logo.png' alt='logo' />
      <hr style={{ margin: '20px 0' }} />
      <List component="nav" aria-label="main navigation">
        <ListItem button component={Link} to="/" selected={activeTab === 'home'} onClick={() => handleSetActiveTab('home')}>
          <ListItemIcon><FaHome /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/admin/movies" selected={activeTab === 'movies'} onClick={() => handleSetActiveTab('movies')}>
          <ListItemIcon><FaFilm /></ListItemIcon>
          <ListItemText primary="Movies" />
        </ListItem>
        <ListItem button component={Link} to="/admin/theaters" selected={activeTab === 'theaters'} onClick={() => handleSetActiveTab('theaters')}>
          <ListItemIcon><FaLandmark /></ListItemIcon>
          <ListItemText primary="Theaters" />
        </ListItem>
        <ListItem button component={Link} to="/admin/users" selected={activeTab === 'users'} onClick={() => handleSetActiveTab('users')}>
          <ListItemIcon><FaUsers /></ListItemIcon>
          <ListItemText primary="Employee" />
        </ListItem>
        <ListItem button component={Link} to="/admin/promotions" selected={activeTab === 'promotions'} onClick={() => handleSetActiveTab('promotions')}>
          <ListItemIcon><FaGift/></ListItemIcon>
          <ListItemText primary="Promotions" />
        </ListItem>
      </List>
      <Button onClick={handleLogout} variant='contained' color='error' fullWidth style={{ marginTop: '20px' }}>Log Out</Button>
    </Container>
  );
};

export default Sidebar;
