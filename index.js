const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const categoryRoutes = require('./routes/category.routes');
const uploadRoutes = require('./routes/upload.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://shopease-frontend-smoky.vercel.app"
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log(error));

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => res.send('Hare Krishna'))

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/payment', paymentRoutes);

module.exports = app;