import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AllFlights.css';

const AllFlights = () => {
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  // ✅ Use your deployed backend URL
  const BASE_URL = 'https://flight-finder-r7fx.onrender.com';

  const fetchFlights = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/fetch-flights`);
      setFlights(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch flights:', error);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <div className="allFlightsPage">
      <h1>All Flights</h1>

      <div className="allFlights">
        {flights.map((flight) => (
          <div className="allFlights-Flight" key={flight._id}>
            <p><b>_id:</b> {flight._id}</p>
            <span>
              <p><b>Flight Id:</b> {flight.flightId}</p>
              <p><b>Flight name:</b> {flight.flightName}</p>
            </span>
            <span>
              <p><b>Starting station:</b> {flight.origin}</p>
              <p><b>Departure time:</b> {flight.departureTime}</p>
            </span>
            <span>
              <p><b>Destination:</b> {flight.destination}</p>
              <p><b>Arrival time:</b> {flight.arrivalTime}</p>
            </span>
            <span>
              <p><b>Base price:</b> {flight.basePrice}</p>
              <p><b>Total seats:</b> {flight.totalSeats}</p>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllFlights;
