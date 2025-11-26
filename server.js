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
const { stripeWebhook } = require('./controllers/payment.controllers');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: true,
    credentials: true
}));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

connectDB();

app.use(cookieParser());

app.post('/api/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

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

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});