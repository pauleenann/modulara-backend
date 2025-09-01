import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db.js';
import useragent from 'express-useragent';
import cookieParser from 'cookie-parser';
// routes
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'

dotenv.config();

const app = express();

// connect to DB
connectDb()

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(useragent.express())
app.use(cookieParser())

const PORT = process.env.PORT || 5000;

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes)


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})
