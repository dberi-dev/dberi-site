# DBeri Site (Customer App) Deployment Guide

## 🚀 Quick Deploy (Vercel - Recommended)

### One-Time Setup
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`

### Environment Variables
Configure in Vercel dashboard:

```bash
# Stripe (TEST MODE for initial launch)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_KEY

# For LIVE MODE (when ready):
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
```

### Deploy
```bash
# Preview
vercel

# Production
vercel --prod
```

---

## 🔧 Manual Deployment

### Build
```bash
npm install
npm run build
npm start
```

### Environment Variables Required
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (test or live)

---

## ✅ Post-Deployment Checklist

- [ ] Payment link page loads (`/pay/[id]`)
- [ ] Can enter card details
- [ ] Stripe checkout works
- [ ] Apple Pay button appears (on Safari/iOS)
- [ ] Google Pay button appears (on Chrome/Android)
- [ ] Success page displays after payment
- [ ] Email receipts sent
- [ ] Payments appear in merchant dashboard

---

## 🧪 Test Payment Links

Use Stripe test cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0027 6000 3184

---

## 🐛 Troubleshooting

### Stripe Not Loading
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check browser console for errors
- Ensure key matches test/live mode

### Payment Fails
- Check Stripe dashboard for error details
- Verify webhook secret configured in backend
- Test with known-good test card (4242...)
