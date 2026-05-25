# How to Create Payment Links

## Overview
Payment links (`https://dberi.com/pay/{id}`) are different from charges (`dberi://charge/{id}`).

## API Endpoint for Creating Payment Links

Based on the backend structure, payment links should be created via:

```
POST /v1/users/:userId/payment-links
```

### Request Body
```json
{
  "amount": 5000,  // Amount in cents ($50.00)
  "description": "Invoice #1234 - Web Design Services",
  "expires_in_hours": 24  // Optional, defaults to 24 hours
}
```

### Response
```json
{
  "id": "3f2dd9f3-4c93-4a97-83e5-1697f0ea4b2d",
  "amount": 5000,
  "currency": "BSD",
  "description": "Invoice #1234 - Web Design Services",
  "status": "pending",
  "share_url": "https://dberi.com/pay/3f2dd9f3-4c93-4a97-83e5-1697f0ea4b2d",
  "deep_link": "dberi://pay/3f2dd9f3-4c93-4a97-83e5-1697f0ea4b2d",
  "expires_at": "2025-05-26T18:00:00Z",
  "created_at": "2025-05-25T18:00:00Z"
}
```

## Where to Add Payment Link Creation

### Option 1: Add to Merchant Dashboard
Add a new page in the merchant dashboard for creating payment links:

**Location**: `merchant-dashboard/src/app/(app)/store/[storeId]/payment-links/page.tsx`

**Features**:
- Form to enter amount and description
- Generate payment link
- Show QR code for the link
- Copy link button
- List of all created payment links
- See payment status

**Example UI**:
```
┌─────────────────────────────────────────┐
│ Create Payment Link                     │
├─────────────────────────────────────────┤
│ Amount:           [_$_____]             │
│ Description:      [____________]        │
│                                         │
│ [Generate Payment Link]                 │
└─────────────────────────────────────────┘

Recent Payment Links:
┌────────────────────────────────────────┐
│ $50.00 - Invoice #1234       [Pending] │
│ https://dberi.com/pay/abc123           │
│ [Copy Link] [QR Code] [Details]        │
├────────────────────────────────────────┤
│ $25.00 - Coffee order        [Paid]    │
│ https://dberi.com/pay/xyz789           │
│ [View Receipt]                         │
└────────────────────────────────────────┘
```

### Option 2: Add to Existing Scan Page (Quick Option)
Add a "Send Payment Link" button to the existing scan page as an alternative to showing QR code.

## Comparison: Charges vs Payment Links

| Feature | Charges (`dberi://charge/{id}`) | Payment Links (`/pay/{id}`) |
|---------|--------------------------------|----------------------------|
| **Created by** | Merchant dashboard | Merchant dashboard or API |
| **Used for** | In-person payments | Remote/online payments |
| **Requires app** | Yes | No (web fallback) |
| **Customer** | Must have dberi app | Works for anyone |
| **URL type** | Deep link | Web URL |
| **Best for** | Point of sale | Invoices, online orders |

## Example Use Cases

### Charge (What You Have Now)
```
Customer walks into coffee shop
→ Orders $5.00 coffee
→ Merchant enters $5.00 in dashboard
→ Shows QR code
→ Customer scans with dberi app
→ Customer approves payment
→ Done!
```

### Payment Link (Your New Feature)
```
Customer orders online for delivery
→ Merchant creates $25.00 payment link
→ Sends link via text message
→ Customer clicks link (no app needed)
→ Customer enters card details on web
→ Payment processes
→ Done!
```

## Implementation Priority

For MVP, you have two options:

### Option A: Manual Payment Link Creation (Quick)
1. Create payment links via backend API directly (Postman, curl, etc.)
2. Share URLs manually via text/email
3. No UI needed yet
4. Test the web payment flow

### Option B: Add to Dashboard (Better UX)
1. Add payment links page to merchant dashboard
2. Merchants can create links themselves
3. Copy/share functionality built-in
4. Better for production

## Next Steps

1. ✅ Frontend web payment page (DONE)
2. ⏳ Implement backend `/v1/payment-links/:id/pay-web` endpoint
3. ⏳ Test with Stripe test cards
4. ⏳ (Optional) Add payment link creation UI to dashboard

For MVP, you can create payment links manually via API and just share the URLs. The web payment flow will work perfectly!
