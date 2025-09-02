import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User, Booking, Flight } from './schemas.js';

dotenv.config();
const app = express();

// ✅ Updated CORS to allow all vercel.app domains + localhost
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow tools like Postman or curl

    const allowed = origin.endsWith('.vercel.app') || origin.includes('localhost');
    if (allowed) return callback(null, true);

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

const PORT = process.env.PORT || 6002;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {

  // ---------------- USER ROUTES ----------------
  app.post('/register', async (req, res) => {
    const { username, email, usertype, password } = req.body;
    const approval = usertype === 'flight-operator' ? 'not-approved' : 'approved';

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, usertype, password: hashedPassword, approval });
      const userCreated = await newUser.save();

      res.status(201).json(userCreated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.post('/approve-operator', async (req, res) => {
    try {
      const user = await User.findById(req.body.id);
      user.approval = 'approved';
      await user.save();
      res.json({ message: 'approved!' });
    } catch (err) {
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.post('/reject-operator', async (req, res) => {
    try {
      const user = await User.findById(req.body.id);
      user.approval = 'rejected';
      await user.save();
      res.json({ message: 'rejected!' });
    } catch (err) {
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.get('/fetch-user/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (err) {
      console.error(err);
    }
  });

  app.get('/fetch-users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Error occurred' });
    }
  });

  // ---------------- FLIGHT ROUTES ----------------
  app.post('/add-flight', async (req, res) => {
    try {
      const flight = new Flight(req.body);
      await flight.save();
      res.json({ message: 'Flight added' });
    } catch (err) {
      res.status(400).json({ message: 'Validation failed', error: err.message });
    }
  });

  app.put('/update-flight', async (req, res) => {
    try {
      const { _id, ...rest } = req.body;
      await Flight.findByIdAndUpdate(_id, rest);
      res.json({ message: 'Flight updated' });
    } catch (err) {
      res.status(400).json({ message: 'Update failed', error: err.message });
    }
  });

  app.get('/fetch-flights', async (req, res) => {
    try {
      const flights = await Flight.find();
      res.json(flights);
    } catch (err) {
      console.error(err);
    }
  });

  app.get('/fetch-flight/:id', async (req, res) => {
    try {
      const flight = await Flight.findById(req.params.id);
      res.json(flight);
    } catch (err) {
      console.error(err);
    }
  });

  // ---------------- BOOKING ROUTES ----------------
  app.get('/fetch-bookings', async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.json(bookings);
    } catch (err) {
      console.error(err);
    }
  });

  app.post('/book-ticket', async (req, res) => {
    const { user, flight, seatClass, passengers } = req.body;
    try {
      const bookings = await Booking.find({ flight, seatClass });
      const numBookedSeats = bookings.reduce((acc, b) => acc + b.passengers.length, 0);

      const seatCode = { 'economy': 'E', 'premium-economy': 'P', 'business': 'B', 'first-class': 'A' };
      const coach = seatCode[seatClass];
      const seats = passengers.map((_, i) => `${coach}-${numBookedSeats + i + 1}`).join(', ');

      const booking = new Booking({ ...req.body, seats });
      await booking.save();

      res.json({ message: 'Booking successful!!' });
    } catch (err) {
      console.error(err);
    }
  });

  app.put('/cancel-ticket/:id', async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      booking.bookingStatus = 'cancelled';
      await booking.save();
      res.json({ message: 'Booking cancelled' });
    } catch (err) {
      console.error(err);
    }
  });

  // ---------------- START SERVER ----------------
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((e) => {
  console.log(`❌ MongoDB connection error: ${e}`);
});
