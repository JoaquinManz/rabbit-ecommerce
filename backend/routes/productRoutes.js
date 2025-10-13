const express = require("express");
const Product = require("../models/Product");
const {protect, admin} = require("../middleware/authMiddleware");


const router = express.Router();

// @route POST /api/products
// @desc Create a new product
// @access Private/Admin

router.post("/", protect, admin, async (req, res) => {
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

// @route PUT /api/products/:id
// @desc Update a product
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
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

        // Find product by id
        const product = await Product.findById(req.params.id);

        if (product) {
            // Update product fields
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            // Save updated product
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }   
});


//@route DELETE /api/products/:id
//@desc Delete a product
//@access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
    try {
        //find product by id
        const product = await Product.findById(req.params.id);

        if(product) {
            //Remove the product from DB
            await product.deleteOne();
            res.json({ message: "Product deleted successfully" })
        } else {
            res.status(404).json({message: "Product not found"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
})

// @route GET /api/products
// @desc Get all products with optional query filters
// @access Private/Admin

router.get("/", async (req, res) => {
    try {
        const {collection, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit} = req.query;

        let query = {};

        //filtering logic
        if (collection && collection.toLocaleLowerCase() !== "all") {
            query.collections = collection;
        } 

        if (category && category.toLocaleLowerCase() !== "all") {
            query.category = category;
        }

        if (material) {
            query.material = { $in: material.split(",") };// $ makes it so that you can select multiple materials
        }
        if (brand) {
            query.brand = { $in: brand.split(",") };
        }
        if (size) {
            query.sizes = { $in: size.split(",") };
        }

        if (color) {
            query.colors = {$in: [color]};
        }

        if(gender) {
            query.gender = gender;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.$or = [
                {name: { $regex: search, $options: "i" } }, 
                {description: { $regex: search, $options: "i" } },
            ]
        }

        // sort logic

        let sort = {}

        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = {price: 1};
                    break;
                case "priceDesc":
                    sort = { price: -1 };
                    break;
                case "popularity":
                    sort = { rating: -1 };
                    break;
                default:
                    break;
            }
        }

        // fetch products and apply sorting and limit
        let products = await Product.find(query)
        .sort(sort).limit(Number(limit) || 0);
        res.json(products)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route GET /api/products/:id
// @desc Get a single product by id
// @access Public
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product Not Found." })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });  
    }
})

module.exports = router;