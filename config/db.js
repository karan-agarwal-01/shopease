// const mongoose = require("mongoose");
// const dotenv = require('dotenv')

// dotenv.config();

// let isConnected = false;

// const connectDB = async () => {
//   if (isConnected) return;

//   if (mongoose.connection.readyState === 1) {
//     isConnected = true;
//     return;
//   }

//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       bufferCommands: false,
//     });

//     isConnected = true;
//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.error("Mongo Error:", error);
//   }
// };

// module.exports = connectDB;