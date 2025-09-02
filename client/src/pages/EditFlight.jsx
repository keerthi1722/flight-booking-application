import React, { useEffect, useState } from 'react';
import '../styles/NewFlight.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditFlight = () => {
  const [flightName, setFlightName] = useState('');
  const [flightId, setFlightId] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startTime, setStartTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [totalSeats, setTotalSeats] = useState(0);
  const [basePrice, setBasePrice] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    fetchFlightData();
  }, []);

  const fetchFlightData = async () => {
    try {
      const res = await axios.get(`https://flight-finder-r7fx.onrender.com/fetch-flight/${id}`);
      const data = res.data;

      setFlightName(data.flightName);
      setFlightId(data.flightId);
      setOrigin(data.origin);
      setDestination(data.destination);
      setTotalSeats(data.totalSeats);
      setBasePrice(data.basePrice);

      const formatTime = (time) => {
        const [hours, minutes] = time.split(":");
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      };

      setStartTime(formatTime(data.departureTime));
      setArrivalTime(formatTime(data.arrivalTime));
    } catch (err) {
      console.error("Failed to fetch flight data", err);
      alert("Failed to load flight data.");
    }
  };

  const handleSubmit = async () => {
    const inputs = {
      _id: id,
      flightName,
      flightId,
      origin,
      destination,
      departureTime: startTime,
      arrivalTime,
      basePrice,
      totalSeats
    };

    try {
      await axios.put('https://flight-finder-r7fx.onrender.com/update-flight', inputs);
      alert('Flight updated successfully!!');
    } catch (err) {
      alert("Failed to update flight!");
      console.error(err);
    }
  };

  return (
    <div className="NewFlightPage">
      <div className="NewFlightPageContainer">
        <h2>Edit Flight</h2>

        <span className="newFlightSpan1">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInputemail"
              value={flightName}
              disabled
            />
            <label htmlFor="floatingInputemail">Flight Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInputmobile"
              value={flightId}
              onChange={(e) => setFlightId(e.target.value)}
            />
            <label htmlFor="floatingInputmobile">Flight Id</label>
          </div>
        </span>

        <span>
          <div className="form-floating">
            <select
              className="form-select form-select-sm mb-3"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            >
              <option value="" disabled>Select</option>
              <option value="Chennai">Chennai</option>
              <option value="Banglore">Banglore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Indore">Indore</option>
              <option value="Delhi">Delhi</option>
              <option value="Pune">Pune</option>
              <option value="Trivendrum">Trivendrum</option>
              <option value="Bhopal">Bhopal</option>
              <option value="Kolkata">Kolkata</option>
              <option value="varanasi">Varanasi</option>
              <option value="Jaipur">Jaipur</option>
            </select>
            <label htmlFor="floatingSelect">Departure City</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="time"
              className="form-control"
              id="floatingInputStartTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <label htmlFor="floatingInputStartTime">Departure Time</label>
          </div>
        </span>

        <span>
          <div className="form-floating">
            <select
              className="form-select form-select-sm mb-3"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="" disabled>Select</option>
              <option value="Chennai">Chennai</option>
              <option value="Banglore">Banglore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Indore">Indore</option>
              <option value="Delhi">Delhi</option>
              <option value="Pune">Pune</option>
              <option value="Trivendrum">Trivendrum</option>
              <option value="Bhopal">Bhopal</option>
              <option value="Kolkata">Kolkata</option>
              <option value="varanasi">Varanasi</option>
              <option value="Jaipur">Jaipur</option>
            </select>
            <label htmlFor="floatingSelect">Destination City</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="time"
              className="form-control"
              id="floatingInputArrivalTime"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
            <label htmlFor="floatingInputArrivalTime">Arrival Time</label>
          </div>
        </span>

        <span className="newFlightSpan2">
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              id="floatingInputSeats"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
            />
            <label htmlFor="floatingInputSeats">Total Seats</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              id="floatingInputBasePrice"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
            <label htmlFor="floatingInputBasePrice">Base Price</label>
          </div>
        </span>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Update
        </button>
      </div>
    </div>
  );
};

export default EditFlight;
