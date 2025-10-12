const express = require("express");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");


const router = express.Router();

// @route POST /api/products
// @desc Create a new product
// @access Private/Admin

router.post("/", protect, async (req, res) => {
    try {
        
        const {
            name, 
            description, 
            price, 
            discountPrice, 
            countInStock, 
            category, 
            brand, 
            sizes, 
            colors, 
            collections, 
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        const product = new Product({
            name, 
            description, 
            price, 
            discountPrice, 
            countInStock, 
            category, 
            brand, 
            sizes, 
            colors, 
            collections, 
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id, // reference to the admin user who created it
        });

        const createProduct = await product.save();
        res.status(201).json(createProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;