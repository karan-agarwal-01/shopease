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
const PORT = process.env.PORT;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());

app.use(express.json());

let isConnected = false;
async function connectDB() {
    if (isConnected) return;

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        isConnected = conn.connections[0].readyState === 1;
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("MongoDB Connection Error:", error);
    }
}

connectDB();

app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => {
    res.send('Hare Krishna')
})

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/payment', paymentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})
