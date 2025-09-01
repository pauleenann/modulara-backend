import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDb = () => {
  mongoose
    .connect(process.env.ATLAS_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err.message);
      process.exit(1); // Exit the app on DB failure
    });
};

export default connectDb;
