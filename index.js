import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';  
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';  
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);  
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});


