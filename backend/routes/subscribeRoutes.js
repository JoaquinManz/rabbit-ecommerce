const express = require('express');
const Subscriber = require('../models/Subscriber');


const router = express.Router();

// @route POST /api/subscribe
// @desc Handle newsletter subscription
// @access Public
router.post('/subscribe', async (req, res) => {
    const {email} = req.body;

    if(!email) {
        return res.status(400).json({ message: "Email is required!" });
    }

    try {
        //check if email is subscribed already
        let subscriber = await Subscriber.findOne({ email });
        if(subscriber) {
            return res.status(400).json({ message: "You are already subscribed!" });
        }

        // Create a new subscriber
        subscriber = new Subscriber({ email });
        await subscriber.save();

        res.status(201).json({ message: "Subscribed successfully to our newsletter!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;