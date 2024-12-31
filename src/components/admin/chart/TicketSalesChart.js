import React, { useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TicketSalesChart = () => {
  const [ticketsData, setTicketsData] = useState([]);
  const [showingsData, setShowingsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketsRes = await axios.get('http://localhost:9999/tickets');
        const showingsRes = await axios.get('http://localhost:9999/showing');
        setTicketsData(ticketsRes.data);
        setShowingsData(showingsRes.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Process the data to get the total number of tickets sold by category
  const processData = (tickets) => {
    const salesByCategory = { VIP: 0, Classic: 0, SweetBox: 0 };

    tickets.forEach(ticket => {
      salesByCategory.VIP += ticket.seats.VIP || 0;
      salesByCategory.Classic += ticket.seats.Classic || 0;
      salesByCategory.SweetBox += ticket.seats.SweetBox || 0;
    });

    return salesByCategory;
  };

  const totalSales = processData(ticketsData);

  const data = {
    labels: ['VIP Tickets', 'Classic Tickets', 'SweetBox Tickets'],
    datasets: [
      {
        label: 'Tickets Sold',
        data: [totalSales.VIP, totalSales.Classic, totalSales.SweetBox],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container>
      <Box sx={{ boxShadow: 3, borderRadius: 2, p: 2, bgcolor: 'background.paper' }}>
        <h2>Total Ticket Sales by Category</h2>
        <Bar data={data} options={options} />
      </Box>
    </Container>
  );
};

export default TicketSalesChart;
