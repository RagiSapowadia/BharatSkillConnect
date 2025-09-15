const express = require("express");
const {
  createStripePaymentIntent,
  handleStripeWebhook,
  createStripeCheckoutSession,
  verifyStripeCheckoutSuccess,
} = require("../controllers/payment-controller");

const router = express.Router();

// Stripe routes only
router.post("/stripe/payment-intent", createStripePaymentIntent);
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Checkout session routes (no webhook required)
router.post("/stripe/checkout-session", createStripeCheckoutSession);
router.get("/stripe/checkout-success", verifyStripeCheckoutSuccess);

module.exports = router;
