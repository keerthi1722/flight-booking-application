import React, { useContext, useEffect, useState } from 'react';
import '../styles/LandingPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContext';

const LandingPage = () => {
  const [error, setError] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [Flights, setFlights] = useState([]);

  const navigate = useNavigate();
  const { setTicketBookingDate } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    if (userType === 'admin') navigate('/admin');
    else if (userType === 'flight-operator') navigate('/flight-admin');
  }, []);

  const fetchFlights = async () => {
    const current = new Date();
    current.setHours(0, 0, 0, 0);

    const depDate = new Date(departureDate);
    depDate.setHours(0, 0, 0, 0);

    const retDate = new Date(returnDate);
    retDate.setHours(0, 0, 0, 0);

    if (!departure || !destination || !departureDate || (checkBox && !returnDate)) {
      return setError('Please fill all the inputs');
    }

    if (departure === destination) {
      return setError("Departure and destination can't be the same.");
    }

    if (checkBox && (depDate < current || retDate <= depDate)) {
      return setError('Please check the dates');
    }

    if (!checkBox && depDate < current) {
      return setError('Please check the dates');
    }

    setError('');
    try {
      const response = await axios.get('https://flight-finder-r7fx.onrender.com/fetch-flights');
      console.log('Fetched flights:', response.data);
      setFlights(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch flights.');
    }
  };

  const handleTicketBooking = (id, origin, destination) => {
    if (!userId) return navigate('/auth');

    if (origin === departure) setTicketBookingDate(departureDate);
    else if (destination === departure) setTicketBookingDate(returnDate);

    navigate(`/book-flight/${id}`);
  };

  const cityOptions = [
    'Chennai', 'Banglore', 'Hyderabad', 'Mumbai', 'Indore',
    'Delhi', 'Pune', 'Trivendrum', 'Bhopal', 'Kolkata',
    'Varanasi', 'Jaipur'
  ];

  const matchingFlights = Flights.filter(f => {
    const origin = f.origin.toLowerCase();
    const dest = f.destination.toLowerCase();
    const dep = departure.toLowerCase();
    const des = destination.toLowerCase();

    return checkBox
      ? (origin === dep && dest === des) || (origin === des && dest === dep)
      : origin === dep && dest === des;
  });

  return (
    <div className="landingPage">
      <div className="landingHero">
        <div className="landingHero-title">
          <h1 className="banner-h1">Soar to New Heights – Book Your Next Flight with Ease!</h1>
          <p className="banner-p">Discover seamless journeys and explore the world with MD Flights – your adventure begins here.</p>
        </div>

        <div className="Flight-search-container input-container mb-4">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onChange={(e) => setCheckBox(e.target.checked)} />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Return journey</label>
          </div>

          <div className="Flight-search-container-body">
            <div className="form-floating">
              <select className="form-select form-select-sm mb-3" value={departure} onChange={(e) => setDeparture(e.target.value)}>
                <option value="" disabled>Select</option>
                {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              <label>Departure City</label>
            </div>

            <div className="form-floating">
              <select className="form-select form-select-sm mb-3" value={destination} onChange={(e) => setDestination(e.target.value)}>
                <option value="" disabled>Select</option>
                {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              <label>Destination City</label>
            </div>

            <div className="form-floating mb-3">
              <input type="date" className="form-control" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
              <label>Journey date</label>
            </div>

            {checkBox && (
              <div className="form-floating mb-3">
                <input type="date" className="form-control" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                <label>Return date</label>
              </div>
            )}

            <div>
              <button className="btn btn-primary" onClick={fetchFlights}>Search</button>
            </div>
          </div>
          <p className="text-danger">{error}</p>
        </div>

        {Flights.length > 0 && (
          <div className="availableFlightsContainer">
            <h1>Available Flights</h1>
            <div className="Flights">
              {matchingFlights.length > 0 ? (
                matchingFlights.map(flight => (
                  <div className="Flight" key={flight._id}>
                    <div>
                      <p><b>{flight.flightName}</b></p>
                      <p><b>Flight Number:</b> {flight.flightId}</p>
                    </div>
                    <div>
                      <p><b>Start :</b> {flight.origin}</p>
                      <p><b>Departure Time:</b> {flight.departureTime}</p>
                    </div>
                    <div>
                      <p><b>Destination :</b> {flight.destination}</p>
                      <p><b>Arrival Time:</b> {flight.arrivalTime}</p>
                    </div>
                    <div>
                      <p><b>Starting Price:</b> ₹{flight.basePrice}</p>
                      <p><b>Available Seats:</b> {flight.totalSeats}</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleTicketBooking(flight._id, flight.origin, flight.destination)}>Book Now</button>
                  </div>
                ))
              ) : (
                <h4 className="mt-3">No Flights Found</h4>
              )}
            </div>
          </div>
        )}
      </div>

      <section id="about" className="section-about p-4">
        <div className="container">
          <h2 className="section-title">About MD Flights</h2>
          <p className="section-description">✈️ Welcome to <b>MD Flights</b> – your gateway to the skies!</p>
          <p className="section-description">🌍 Compare fares, discover deals, and book instantly.</p>
          <p className="section-description">🛫 Customize your journey and manage everything in one place.</p>
          <p className="section-description">Ready to take off? Join thousands of happy travelers today!</p>

          <div className="about-cards-grid">
            {[
              { emoji: '🛫', title: 'Easy Booking', desc: 'Book your flights in just a few clicks.', label: 'Booking' },
              { emoji: '💬', title: '24/7 Support', desc: 'We’re here for you anytime.', label: 'Support' },
              { emoji: '💸', title: 'Best Deals', desc: 'Find the best fares and offers.', label: 'Deals' },
              { emoji: '🛬', title: 'Flexible Options', desc: 'Choose your preferences freely.', label: 'Options' },
              { emoji: '🔒', title: 'Secure Payments', desc: 'Safe & secure checkout guaranteed.', label: 'Security' },
              { emoji: '⏰', title: 'Real-Time Updates', desc: 'Flight updates right when you need them.', label: 'Updates' },
              { emoji: '🌍', title: 'Travel Insights', desc: 'Smart tips for better trips.', label: 'Insights' },
              { emoji: '🗺️', title: 'Global Destinations', desc: 'Explore worldwide destinations.', label: 'Destinations' },
            ].map((card, i) => (
              <div className={`about-card card${i + 1}`} key={i}>
                <div className="about-card-top"><span>{card.emoji}</span></div>
                <div className="about-card-bottom">
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                  <span className={`about-card-label label${i + 1}`}>{card.label}</span>
                </div>
              </div>
            ))}
          </div>

          <span><h5>2020 MD FlightConnect - &copy; All rights reserved</h5></span>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
