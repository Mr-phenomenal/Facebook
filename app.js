import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);


app.use('/api/posts', postRoutes);

app.use('/api/users', userRoutes);

app.use('/api/friends', friendRoutes);
app.use('/api/posts', require('./routes/postRoutes'));

app.use('/api/notifications', require('./routes/notificationRoutes'));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
