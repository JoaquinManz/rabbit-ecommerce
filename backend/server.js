const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes')
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');

//Admin routes
const adminRoutes = require('./routes/adminRoutes');
const productAdminRoutes = require('./routes/productAdminRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');

const app = express();

// cors configuration

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://rabbit-ecommerce-liart.vercel.app', // Production
      'http://localhost:3000', // Local development
      'http://localhost:5173'  // Local Vite
    ];
    
    // Allow any vercel.app subdomain for your project
    if (origin.includes('joaquinmanzs-projects.vercel.app') || 
        origin.includes('rabbit-ecommerce') && origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));

dotenv.config();

const PORT = process.env.PORT || 3000;

//connect to mongodb
connectDB();

app.get("/", (req, res) => {
    res.send("WELCOME TO RABBIT API!")
});

//API Routes here
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscribeRoutes);

//Admin routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on https://rabbit-ecommerce-liart.vercel.app`);
})