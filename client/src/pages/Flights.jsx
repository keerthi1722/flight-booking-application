import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AllFlights.css';

const Flights = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchUserData();
    fetchFlights();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://flight-finder-r7fx.onrender.com/fetch-user/${userId}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchFlights = async () => {
    try {
      const response = await axios.get('https://flight-finder-r7fx.onrender.com/fetch-flights');
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  return (
    <div className="allFlightsPage">
      {userDetails ? (
        <>
          {userDetails.approval === 'not-approved' ? (
            <div className="notApproved-box">
              <h3>Approval Required!!</h3>
              <p>
                Your application is under processing. It needs an approval from the administrator. Kindly please be patient!!
              </p>
            </div>
          ) : userDetails.approval === 'approved' ? (
            <>
              <h1>All Flights</h1>
              <div className="allFlights">
                {flights
                  .filter((flight) => flight.flightName === username)
                  .map((flight) => (
                    <div className="allFlights-Flight" key={flight._id}>
                      <p><b>ID:</b> {flight._id}</p>
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
                        <p><b>Base price:</b> ₹{flight.basePrice}</p>
                        <p><b>Total seats:</b> {flight.totalSeats}</p>
                      </span>
                      <div>
                        <button className="btn btn-primary" onClick={() => navigate(`/edit-flight/${flight._id}`)}>
                          Edit details
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : null}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Flights;
