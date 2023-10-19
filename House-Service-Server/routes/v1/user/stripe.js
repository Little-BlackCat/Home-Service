import { Router } from "express";
import stripe from "stripe";
import dotenv from "dotenv";
    
const stripeSecretKey = process.env.SECRET_KEY;
const stripeClient = stripe(stripeSecretKey);
const router = Router();

router.post("/", async (req, res) => {
  try {
    const price = req.body.price;

    console.log("Received request with price:", price);

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: price * 100,
      currency: "thb",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
