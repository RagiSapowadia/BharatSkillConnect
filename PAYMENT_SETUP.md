# Payment Setup Guide

## Current Issue
The "Buy Now" button is showing "Payment error occurred. Please try again." This is likely due to missing environment variables or server configuration.

## Quick Fix Options

### Option 1: Use PayPal (Recommended for Testing)
1. **Set up PayPal Sandbox credentials:**
   - Go to https://developer.paypal.com/
   - Create a sandbox account
   - Get your Client ID and Secret

2. **Add to server/.env file:**
   ```
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_SECRET_ID=your_paypal_secret
   CLIENT_URL=http://localhost:5173
   ```

### Option 2: Use Stripe
1. **Set up Stripe account:**
   - Go to https://stripe.com/
   - Get your publishable and secret keys

2. **Add to server/.env file:**
   ```
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   CLIENT_URL=http://localhost:5173
   ```

3. **Add to client/.env.local file:**
   ```
   VITE_PAYMENT_PROVIDER=stripe
   VITE_API_BASE_URL=http://localhost:5000
   ```

### Option 3: Test Without Payment (Demo Mode)
If you just want to test the UI without real payments, you can modify the payment function to simulate success.

## Current Status
- ✅ Payment UI is working
- ✅ Error handling is implemented
- ✅ Currency is set to INR (₹)
- ⚠️ Payment gateways need configuration
- ⚠️ Server needs to be running

## Next Steps
1. Choose a payment provider (PayPal or Stripe)
2. Set up the credentials
3. Restart the server
4. Test the payment flow
