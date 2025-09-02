import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/allUsers.css';
import axios from 'axios';

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://flight-finder-r7fx.onrender.com/fetch-users');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="all-users-page">
        <h2>All Users</h2>
        <div className="all-users">
          {users
            .filter((user) => user.usertype === 'customer')
            .map((user) => (
              <div className="user" key={user._id}>
                <p><b>UserId:</b> {user._id}</p>
                <p><b>Username:</b> {user.username}</p>
                <p><b>Email:</b> {user.email}</p>
              </div>
            ))}
        </div>

        <h2>Flight Operators</h2>
        <div className="all-users">
          {users
            .filter((user) => user.usertype === 'flight-operator')
            .map((user) => (
              <div className="user" key={user._id}>
                <p><b>Id:</b> {user._id}</p>
                <p><b>Flight Name:</b> {user.username}</p>
                <p><b>Email:</b> {user.email}</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default AllUsers;
