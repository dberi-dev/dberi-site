# Web Payment Implementation - Setup Guide

## Overview
This implementation enables users without the dberi app to pay via QR codes from the merchant dashboard by entering their card details directly on the web.

## What Was Implemented

### Frontend (dberi-site)

1. **Enhanced Payment Page** (`src/pages/pay/[id].tsx`)
   - Device detection (iOS, Android, Desktop)
   - Platform-specific UI and messaging
   - Stripe Elements integration for secure card input
   - Two-step flow: Main page → Card payment form
   - Support for 3D Secure authentication
   - Phone number and email collection
   - Success/error handling

2. **Platform-Specific Features**
   - **iOS**: Shows "Open in dberi App" button + deep link, download link to App Store
   - **Android**: Shows "Coming Soon on Google Play" (disabled), web payment as primary option
   - **Desktop/Other**: Web payment as primary option with iOS download info

3. **Payment Flow**
   - User scans QR code from merchant dashboard
   - Sees payment amount and description
   - Clicks "Pay with Card"
   - Enters phone number, email (optional), and card details
   - Payment processes via Stripe
   - Shows success confirmation

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

Get your Stripe publishable key from:
https://dashboard.stripe.com/apikeys

For production, use `pk_live_...` instead of `pk_test_...`

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `@stripe/stripe-js` - Stripe.js library
- `@stripe/react-stripe-js` - React components for Stripe Elements

### 3. Backend API Implementation

**IMPORTANT**: The backend needs to implement the `/v1/payment-links/:id/pay-web` endpoint.

See `BACKEND_API_NEEDED.md` for detailed implementation instructions.

The endpoint should:
1. Validate the payment link
2. Create/find user by phone number
3. Create and confirm Stripe PaymentIntent
4. Handle 3D Secure if required
5. Update database (mark payment link as paid, credit merchant, create transaction)
6. Return success/error response

### 4. Run Development Server

```bash
npm run dev
```

The site will be available at http://localhost:3000

### 5. Test the Payment Flow

#### Using Stripe Test Cards:

- **Successful payment**: `4242 4242 4242 4242`
- **Requires 3D Secure**: `4000 0025 0000 3155`
- **Declined card**: `4000 0000 0000 9995`
- **Insufficient funds**: `4000 0000 0000 9995`

Any future expiry date and any 3-digit CVC works for test cards.

#### Test Steps:

1. Create a payment link from the merchant dashboard
2. Get the payment link URL (e.g., `https://dberi.com/pay/abc123`)
3. Open on different devices/browsers to test platform detection:
   - iPhone/iPad Safari - Should show iOS app option
   - Android Chrome - Should show "Coming Soon" for Android
   - Desktop - Should show web payment as primary
4. Click "Pay with Card"
5. Enter test phone number (e.g., `+1 (242) 555-0123`)
6. Enter test card: `4242 4242 4242 4242`
7. Expiry: Any future date (e.g., `12/25`)
8. CVC: Any 3 digits (e.g., `123`)
9. Click "Pay $X.XX"
10. Verify payment success screen appears

## Features

### Security
- Card details never touch our servers (handled by Stripe)
- PCI-DSS compliant via Stripe Elements
- 3D Secure support for additional authentication
- HTTPS required for production

### User Experience
- Platform-aware UI (different experience for iOS/Android/Desktop)
- Loading states and error handling
- Mobile-responsive design
- Clean, modern interface matching dberi branding
- Clear payment confirmation

### Developer Experience
- TypeScript for type safety
- Inline styles for simplicity (no CSS file dependencies)
- Clear error messages
- Modular component structure

## Deployment

### Environment Variables

Add to your production environment:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
```

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable in Vercel dashboard
4. Deploy

### Other Platforms

Standard Next.js deployment:
```bash
npm run build
npm start
```

## Architecture

```
User Scans QR Code
       ↓
/pay/[id] Page
       ↓
Fetch Payment Link (GET /v1/payment-links/:id)
       ↓
Show Amount + Platform-Specific Options
       ↓
User Clicks "Pay with Card"
       ↓
Show Stripe Card Form
       ↓
User Enters Card Details
       ↓
Create Payment Method (Stripe.js - client side)
       ↓
Send to Backend (POST /v1/payment-links/:id/pay-web)
       ↓
Backend Processes Payment (Stripe API)
       ↓
If 3D Secure Required: Return client_secret
       ↓
Frontend Confirms with Stripe.confirmCardPayment
       ↓
Show Success Screen
```

## Troubleshooting

### "Payment failed" error
- Check if backend endpoint is implemented
- Verify Stripe secret key is set in backend
- Check backend logs for detailed error

### Card input not showing
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check browser console for errors
- Ensure Stripe.js loaded successfully

### Platform detection not working
- Clear browser cache
- Check user agent in browser dev tools
- Test on actual devices, not just emulators

### 3D Secure not triggering
- Use test card `4000 0025 0000 3155`
- Ensure client_secret is returned from backend
- Check for JavaScript errors in console

## Next Steps

1. Implement backend `/pay-web` endpoint (see `BACKEND_API_NEEDED.md`)
2. Add Stripe publishable key to `.env.local`
3. Test payment flow end-to-end
4. Configure Stripe webhook for payment events (optional but recommended)
5. Add analytics/tracking (optional)
6. Consider adding:
   - Save card for future payments
   - Payment method selection (if multiple saved)
   - Currency conversion for international payments

## Support

For Stripe documentation:
- https://stripe.com/docs/payments/accept-a-payment
- https://stripe.com/docs/js

For Next.js documentation:
- https://nextjs.org/docs
