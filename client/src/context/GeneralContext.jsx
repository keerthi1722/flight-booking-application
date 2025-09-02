import React, { createContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');
  const [ticketBookingDate, setTicketBookingDate] = useState();

  const navigate = useNavigate();
  const BASE_URL = 'https://flight-finder-r7fx.onrender.com';

  const login = async () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const data = res.data;
      console.log('✅ Login successful:', data);

      localStorage.setItem('userId', data._id);
      localStorage.setItem('userType', data.usertype);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email);

      if (data.usertype === 'customer') {
        navigate('/');
      } else if (data.usertype === 'admin') {
        navigate('/admin');
      } else if (data.usertype === 'flight-operator') {
        navigate('/flight-admin');
      }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed!');
    }
  };

  const register = async () => {
    if (!username || !email || !password || !usertype) {
      alert('All fields are required for registration.');
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/register`,
        { username, email, usertype, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const data = res.data;
      console.log('✅ Registration successful:', data);

      localStorage.setItem('userId', data._id);
      localStorage.setItem('userType', data.usertype);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email);

      if (data.usertype === 'customer') {
        navigate('/');
      } else if (data.usertype === 'admin') {
        navigate('/admin');
      } else if (data.usertype === 'flight-operator') {
        navigate('/flight-admin');
      }
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Registration failed!');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <GeneralContext.Provider
      value={{
        login,
        register,
        logout,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        usertype,
        setUsertype,
        ticketBookingDate,
        setTicketBookingDate
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
