import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Bookings.css';

const FlightBookings = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [bookings, setBookings] = useState([]);

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchUserData();
    fetchBookings();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://flight-finder-r7fx.onrender.com/fetch-user/${userId}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://flight-finder-r7fx.onrender.com/fetch-bookings');
      setBookings(response.data.reverse());
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const cancelTicket = async (id) => {
    try {
      await axios.put(`https://flight-finder-r7fx.onrender.com/cancel-ticket/${id}`);
      alert('Ticket cancelled!');
      fetchBookings();
    } catch (error) {
      alert('Failed to cancel ticket.');
      console.error('Error cancelling ticket:', error);
    }
  };

  return (
    <div className="user-bookingsPage">
      {userDetails ? (
        <>
          {userDetails.approval === 'not-approved' ? (
            <div className="notApproved-box">
              <h3>Approval Required!!</h3>
              <p>
                Your application is under processing. It needs approval from the administrator. Kindly please be patient!
              </p>
            </div>
          ) : userDetails.approval === 'approved' ? (
            <>
              <h1>Bookings</h1>
              <div className="user-bookings">
                {bookings
                  .filter((booking) => booking.flightName === username)
                  .map((booking) => (
                    <div className="user-booking" key={booking._id}>
                      <p><b>Booking ID:</b> {booking._id}</p>
                      <span>
                        <p><b>Mobile:</b> {booking.mobile}</p>
                        <p><b>Email:</b> {booking.email}</p>
                      </span>
                      <span>
                        <p><b>Flight Id:</b> {booking.flightId}</p>
                        <p><b>Flight name:</b> {booking.flightName}</p>
                      </span>
                      <span>
                        <p><b>On-boarding:</b> {booking.departure}</p>
                        <p><b>Destination:</b> {booking.destination}</p>
                      </span>
                      <span>
                        <div>
                          <p><b>Passengers:</b></p>
                          <ol>
                            {booking.passengers.map((passenger, i) => (
                              <li key={i}>
                                <p><b>Name:</b> {passenger.name}, <b>Age:</b> {passenger.age}</p>
                              </li>
                            ))}
                          </ol>
                        </div>
                        {booking.bookingStatus === 'confirmed' && (
                          <p><b>Seats:</b> {booking.seats}</p>
                        )}
                      </span>
                      <span>
                        <p><b>Booking date:</b> {booking.bookingDate.slice(0, 10)}</p>
                        <p><b>Journey date:</b> {booking.journeyDate.slice(0, 10)}</p>
                      </span>
                      <span>
                        <p><b>Journey Time:</b> {booking.journeyTime}</p>
                        <p><b>Total price:</b> ₹{booking.totalPrice}</p>
                      </span>
                      <p style={{ color: booking.bookingStatus === 'cancelled' ? 'red' : 'black' }}>
                        <b>Booking status:</b> {booking.bookingStatus}
                      </p>
                      {booking.bookingStatus === 'confirmed' && (
                        <button className="btn btn-danger" onClick={() => cancelTicket(booking._id)}>
                          Cancel Ticket
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </>
          ) : null}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FlightBookings;
