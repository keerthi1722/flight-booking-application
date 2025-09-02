import React, { useEffect, useState } from 'react';
import '../styles/NewFlight.css';
import axios from 'axios';

const NewFlight = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const id = localStorage.getItem('userId');
      const response = await axios.get(`https://flight-finder-r7fx.onrender.com/fetch-user/${id}`);
      setUserDetails(response.data);
    } catch (err) {
      console.error("Error fetching user data", err);
    }
  };

  const [flightName] = useState(localStorage.getItem('username') || '');
  const [flightId, setFlightId] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startTime, setStartTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [basePrice, setBasePrice] = useState('');

  const cityOptions = [
    'Chennai', 'Banglore', 'Hyderabad', 'Mumbai', 'Indore',
    'Delhi', 'Pune', 'Trivendrum', 'Bhopal', 'Kolkata',
    'varanasi', 'Jaipur'
  ];

  const handleSubmit = async () => {
    const seats = parseInt(totalSeats);
    const price = parseFloat(basePrice);

    // 🛑 Validation
    if (
      !flightId.trim() ||
      !origin ||
      !destination ||
      !startTime ||
      !arrivalTime ||
      isNaN(seats) ||
      isNaN(price)
    ) {
      alert('Please fill all required fields.');
      return;
    }

    if (origin === destination) {
      alert('Origin and destination cannot be the same.');
      return;
    }

    const depTime = new Date(`1970-01-01T${startTime}:00`);
    const arrTime = new Date(`1970-01-01T${arrivalTime}:00`);

    if (arrTime <= depTime) {
      alert('Arrival time must be after departure time.');
      return;
    }

    const inputs = {
      flightName,
      flightId,
      origin,
      destination,
      departureTime: startTime,
      arrivalTime,
      basePrice: price,
      totalSeats: seats
    };

    try {
      await axios.post('https://flight-finder-r7fx.onrender.com/add-flight', inputs);
      alert('✅ Flight added successfully!');
      setFlightId('');
      setOrigin('');
      setDestination('');
      setStartTime('');
      setArrivalTime('');
      setTotalSeats('');
      setBasePrice('');
    } catch (error) {
      console.error('Flight add error:', error);
      alert('Failed to add flight: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="NewFlightPage">
      {userDetails ? (
        userDetails.approval === 'not-approved' ? (
          <div className="notApproved-box">
            <h3>Approval Required!!</h3>
            <p>Your application is under processing. Please wait for admin approval.</p>
          </div>
        ) : userDetails.approval === 'approved' ? (
          <div className="NewFlightPageContainer">
            <h2>Add New Flight</h2>

            <span className="newFlightSpan1">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" value={flightName} disabled />
                <label>Flight Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={flightId}
                  onChange={(e) => setFlightId(e.target.value)}
                  placeholder="Flight ID"
                />
                <label>Flight ID</label>
              </div>
            </span>

            <span>
              <div className="form-floating mb-3">
                <select className="form-select" value={origin} onChange={(e) => setOrigin(e.target.value)}>
                  <option value="" disabled>Select</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <label>Departure City</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="time"
                  className="form-control"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <label>Departure Time</label>
              </div>
            </span>

            <span>
              <div className="form-floating mb-3">
                <select className="form-select" value={destination} onChange={(e) => setDestination(e.target.value)}>
                  <option value="" disabled>Select</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <label>Destination City</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="time"
                  className="form-control"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                />
                <label>Arrival Time</label>
              </div>
            </span>

            <span className="newFlightSpan2">
              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                />
                <label>Total Seats</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                />
                <label>Base Price</label>
              </div>
            </span>

            <button className="btn btn-primary" onClick={handleSubmit}>Add Now</button>
          </div>
        ) : null
      ) : null}
    </div>
  );
};

export default NewFlight;
