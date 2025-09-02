import React, { useContext, useEffect, useState } from 'react';
import '../styles/BookFlight.css';
import { GeneralContext } from '../context/GeneralContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BookFlight = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ticketBookingDate } = useContext(GeneralContext);

  const [flightName, setFlightName] = useState('');
  const [flightId, setFlightId] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [StartCity, setStartCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [startTime, setStartTime] = useState('');

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [coachType, setCoachType] = useState('');
  const [journeyDate, setJourneyDate] = useState(ticketBookingDate);
  const [numberOfPassengers, setNumberOfPassengers] = useState(0);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const price = {
    'economy': 1,
    'premium-economy': 2,
    'business': 3,
    'first-class': 4
  };

  useEffect(() => {
    fetchFlightData();
  }, []);

  const fetchFlightData = async () => {
    try {
      const response = await axios.get(`https://flight-finder-r7fx.onrender.com/fetch-flight/${id}`);
      const data = response.data;
      setFlightName(data.flightName);
      setFlightId(data.flightId);
      setBasePrice(data.basePrice);
      setStartCity(data.origin);
      setDestinationCity(data.destination);
      setStartTime(data.departureTime);
    } catch (err) {
      console.error("Failed to fetch flight data", err);
    }
  };

  useEffect(() => {
    if (price[coachType] && basePrice && numberOfPassengers) {
      setTotalPrice(price[coachType] * basePrice * numberOfPassengers);
    }
  }, [numberOfPassengers, coachType, basePrice]);

  const handlePassengerChange = (event) => {
    const value = parseInt(event.target.value);
    setNumberOfPassengers(value);
  };

  const handlePassengerDetailsChange = (index, key, value) => {
    setPassengerDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index] = { ...updatedDetails[index], [key]: value };
      return updatedDetails;
    });
  };

  const bookFlight = async () => {
    const inputs = {
      user: localStorage.getItem('userId'),
      flight: id,
      flightName,
      flightId,
      departure: StartCity,
      destination: destinationCity,
      journeyTime: startTime,
      email,
      mobile,
      passengers: passengerDetails,
      totalPrice,
      journeyDate,
      seatClass: coachType,
    };

    try {
      await axios.post('https://flight-finder-r7fx.onrender.com/book-ticket', inputs);
      alert('Booking successful!');
      navigate('/bookings');
    } catch (err) {
      alert('Booking failed!');
      console.error(err);
    }
  };

  return (
    <div className='BookFlightPage'>
      <div className="BookingFlightPageContainer">
        <h2>Book ticket</h2>
        <span>
          <p><b>Flight Name:</b> {flightName}</p>
          <p><b>Flight No:</b> {flightId}</p>
        </span>
        <span>
          <p><b>Base price:</b> {basePrice}</p>
        </span>
        <span>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Email</label>
          </div>
          <div className="form-floating mb-3">
            <input type="text" className="form-control" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            <label>Mobile</label>
          </div>
        </span>
        <span className='span3'>
          <div className="no-of-passengers">
            <div className="form-floating mb-3">
              <input type="number" className="form-control" value={numberOfPassengers} onChange={handlePassengerChange} />
              <label>No of passengers</label>
            </div>
          </div>
          <div className="form-floating mb-3">
            <input type="date" className="form-control" value={journeyDate} onChange={(e) => setJourneyDate(e.target.value)} />
            <label>Journey date</label>
          </div>
          <div className="form-floating">
            <select className="form-select form-select-sm mb-3" value={coachType} onChange={(e) => setCoachType(e.target.value)}>
              <option value="" disabled>Select</option>
              <option value="economy">Economy class</option>
              <option value="premium-economy">Premium Economy</option>
              <option value="business">Business class</option>
              <option value="first-class">First class</option>
            </select>
            <label>Seat Class</label>
          </div>
        </span>

        <div className="new-passengers">
          {Array.from({ length: numberOfPassengers }).map((_, index) => (
            <div className='new-passenger' key={index}>
              <h4>Passenger {index + 1}</h4>
              <div className="new-passenger-inputs">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" value={passengerDetails[index]?.name || ''} onChange={(event) => handlePassengerDetailsChange(index, 'name', event.target.value)} />
                  <label>Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="number" className="form-control" value={passengerDetails[index]?.age || ''} onChange={(event) => handlePassengerDetailsChange(index, 'age', event.target.value)} />
                  <label>Age</label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h6><b>Total price:</b> {totalPrice}</h6>
        <button className='btn btn-primary' onClick={bookFlight}>Book now</button>
      </div>
    </div>
  );
};

export default BookFlight;
