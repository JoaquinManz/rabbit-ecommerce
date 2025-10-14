const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {protect, admin} = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get the cart by userId or guestId

const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if(guestId) {
        return await Cart.findOne({ guestId });
    } 
    return null;
}

// @router POST /api/cart
// @desc Add a product to the cart for a guest or logged in user
// @access Public

router.post("/", async (req, res) => {
    const {productId, quantity, size, color, guestId, userId} = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });
        
        // Determine if user is logged in or guest
        let cart = await getCart(userId, guestId)

        // if the cart exists, update it
        if (cart) {
            const productIndex = cart.product.findIndex((p) => 
                p.productId.toString() === productId && 
                p.size === size && 
                p.color === color
            );

            if(productIndex > -1) {
                //If the product exists, update the quantity
                cart.product[productIndex].quantity += quantity;
            } else {
                //If the product doesnt exist, add a new product
                cart.product.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }
            // Recalculate the total price
            cart.totalPrice = cart.product.reduce((acc, item) => acc + item.price * quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // create a new cart for guest or user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                product: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity,
                    }
                ],
                totalPrice: product.price * quantity,
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

//@route PUT /api/cart
//@desc Update product quantity for a guest or logged in user
//@access Public

router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(user, guestId)

        if(!cart) return res.status(404).json({ message: "Cart not found" })

        const productIndex = cart.product.findIndex((p) => 
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        );

        if(productIndex > -1) {
            //update quantity
            if(quantity > 0) {
                cart.product[productIndex].quantity += quantity;
            } else {
                cart.product.splice(productIndex, 1); // Removes the product if the quantity is 0
            }
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save()
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" })
    }
})


module.exports = router;