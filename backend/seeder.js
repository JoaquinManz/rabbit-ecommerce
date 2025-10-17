const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");

const products = require("./data/products");

dotenv.config();

// connect to mongodb
mongoose.connect(process.env.MONGO_URI);

// seed data

const seedData = async () => {
    try {
        // clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // create a default admin user
        const createdUser = await User.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: "admin",
        });

        // assign the default user id to each product 
        const userID = createdUser._id;

        const sampleProducts = products.map((product) => {
            return {...product, user: userID};
        })

        // insert the products in the db
        await Product.insertMany(sampleProducts);

        console.log("Product data seeded successfully!");
        process.exit();
        
    } catch (error) {
        console.error("Error seeding the data", error);
        process.exit(1);
    }
};

seedData();