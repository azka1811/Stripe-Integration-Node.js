const express = require('express');

const bodyParser = require('body-parser');
//dotenv 
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Stripe Payment');
});

// Route to handle payment
app.post('/payment', async (req, res) => {
  try {
    const { amount, currency, source, description } = req.body;

    // Create a charge
    const charge = await stripe.charges.create({
      amount: amount,
      currency: currency,
      source: source, // obtained with Stripe.js or Checkout
      description: description
    });

    // Handle successful payment
    res.status(200).json({ message: 'Payment successful', charge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
