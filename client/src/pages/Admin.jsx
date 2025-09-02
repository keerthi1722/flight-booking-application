import React, { useEffect, useState } from 'react';
import '../styles/Admin.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [bookingCount, setbookingCount] = useState(0);
  const [flightsCount, setFlightsCount] = useState(0);

  // ✅ Use deployed API base URL
  const BASE_URL = 'https://flight-finder-r7fx.onrender.com';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get(`${BASE_URL}/fetch-users`);
      setUserCount(usersRes.data.length - 1);
      setUsers(usersRes.data.filter(user => user.approval === 'not-approved'));

      const bookingsRes = await axios.get(`${BASE_URL}/fetch-bookings`);
      setbookingCount(bookingsRes.data.length);

      const flightsRes = await axios.get(`${BASE_URL}/fetch-flights`);
      setFlightsCount(flightsRes.data.length);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const approveRequest = async (id) => {
    try {
      await axios.post(`${BASE_URL}/approve-operator`, { id });
      alert("Operator approved!!");
      fetchData();
    } catch (err) {
      console.error("Error approving user", err);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.post(`${BASE_URL}/reject-operator`, { id });
      alert("Operator rejected!!");
      fetchData();
    } catch (err) {
      console.error("Error rejecting user", err);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-cards">
        <div className="card admin-card users-card">
          <div className="admin-card-top users-bg"><span role="img" aria-label="users">👥</span></div>
          <div className="admin-card-bottom">
            <h4>Users</h4>
            <p>{userCount}</p>
            <button className="btn btn-primary" onClick={() => navigate('/all-users')}>View all</button>
          </div>
        </div>

        <div className="card admin-card bookings-card">
          <div className="admin-card-top bookings-bg"><span role="img" aria-label="bookings">📑</span></div>
          <div className="admin-card-bottom">
            <h4>Bookings</h4>
            <p>{bookingCount}</p>
            <button className="btn btn-primary" onClick={() => navigate('/all-bookings')}>View all</button>
          </div>
        </div>

        <div className="card admin-card flights-card">
          <div className="admin-card-top flights-bg"><span role="img" aria-label="flights">✈️</span></div>
          <div className="admin-card-bottom">
            <h4>Flights</h4>
            <p>{flightsCount}</p>
            <button className="btn btn-primary" onClick={() => navigate('/all-flights')}>View all</button>
          </div>
        </div>
      </div>

      <div className="admin-requests-container">
        <h3>New Operator Applications</h3>
        <div className="admin-requests">
          {users.length === 0 ? (
            <p>No new requests..</p>
          ) : (
            users.map((user) => (
              <div className="admin-request" key={user._id}>
                <span><b>Operator name: </b>{user.username}</span>
                <span><b>Operator email: </b>{user.email}</span>
                <div className="admin-request-actions">
                  <button className='btn btn-primary' onClick={() => approveRequest(user._id)}>Approve</button>
                  <button className='btn btn-danger' onClick={() => rejectRequest(user._id)}>Reject</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
