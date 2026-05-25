# Backend API Endpoint Needed for Web Payments

## Overview
To enable web-based card payments for users without the app, we need a new endpoint in `dberi-backend`.

## Required Endpoint

### POST `/v1/payment-links/:id/pay-web`

Process a web payment for a payment link using a Stripe payment method.

#### Request Body
```json
{
  "payment_method_id": "pm_xxxxxxxxxxxxx",
  "phone_number": "+1 (242) 555-0123",
  "email": "user@example.com" // optional
}
```

#### Response (Success)
```json
{
  "status": "succeeded",
  "payment_link_id": "uuid",
  "transaction_id": "uuid"
}
```

#### Response (Requires 3D Secure)
```json
{
  "requires_action": true,
  "client_secret": "pi_xxxxx_secret_xxxxx",
  "payment_intent_id": "pi_xxxxxxxxxxxxx"
}
```

#### Response (Error)
```json
{
  "message": "Payment failed: insufficient funds"
}
```

## Implementation Notes

### Steps:
1. Validate the payment link exists and is in `pending` status
2. Get the payment link amount and merchant info
3. Create or find user by phone number (create guest user if not exists)
4. Create a Stripe PaymentIntent with:
   - Amount from payment link
   - Payment method ID from request
   - Customer info (phone, email)
   - Metadata (payment_link_id, merchant_id, phone_number)
5. Confirm the PaymentIntent
6. If requires 3D Secure, return `client_secret` for frontend confirmation
7. If payment succeeds:
   - Mark payment link as `paid`
   - Credit merchant's wallet
   - Create transaction record
   - Save payment method for future use (optional)
8. Return success/error response

### Example Rust Implementation Outline

```rust
// In src/routes/payment_requests.rs
.route(
    "/payment-links/:id/pay-web",
    post(payment_requests::pay_web),
)

// In src/handlers/payment_requests.rs or relevant handler
pub async fn pay_web(
    State(pool): State<DbPool>,
    Path(payment_link_id): Path<Uuid>,
    Json(payload): Json<PayWebRequest>,
) -> Result<Json<PayWebResponse>, AppError> {
    // 1. Get payment link
    let payment_link = get_payment_link(&pool, payment_link_id).await?;

    if payment_link.status != "pending" {
        return Err(AppError::BadRequest("Payment link is not pending".into()));
    }

    // 2. Find or create user by phone
    let user = find_or_create_user_by_phone(&pool, &payload.phone_number).await?;

    // 3. Create Stripe PaymentIntent
    let stripe = StripeService::new(get_stripe_key()?);

    let mut metadata = HashMap::new();
    metadata.insert("payment_link_id".to_string(), payment_link_id.to_string());
    metadata.insert("user_id".to_string(), user.id.to_string());
    metadata.insert("phone_number".to_string(), payload.phone_number.clone());

    let payment_intent = stripe.create_payment_intent_with_method(
        payment_link.amount,
        &payload.payment_method_id,
        Some(metadata),
    ).await?;

    // 4. Confirm payment intent
    let confirmed = stripe.confirm_payment_intent(&payment_intent.id).await?;

    // 5. Check if requires action (3D Secure)
    if confirmed.status == "requires_action" {
        return Ok(Json(PayWebResponse {
            requires_action: true,
            client_secret: confirmed.client_secret,
            payment_intent_id: confirmed.id,
            status: "requires_action".to_string(),
        }));
    }

    // 6. If succeeded, update database
    if confirmed.status == "succeeded" {
        // Mark payment link as paid
        mark_payment_link_paid(&pool, payment_link_id, user.id).await?;

        // Credit merchant wallet
        credit_merchant_wallet(&pool, payment_link.merchant_id, payment_link.amount).await?;

        // Create transaction
        let transaction_id = create_transaction(&pool, user.id, payment_link).await?;

        return Ok(Json(PayWebResponse {
            requires_action: false,
            status: "succeeded".to_string(),
            payment_link_id,
            transaction_id: Some(transaction_id),
            ..Default::default()
        }));
    }

    Err(AppError::PaymentFailed("Payment failed".into()))
}
```

### DTO Structs Needed

```rust
#[derive(Debug, Deserialize)]
pub struct PayWebRequest {
    pub payment_method_id: String,
    pub phone_number: String,
    pub email: Option<String>,
}

#[derive(Debug, Serialize, Default)]
pub struct PayWebResponse {
    pub status: String,
    pub requires_action: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub client_secret: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub payment_intent_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub payment_link_id: Option<Uuid>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub transaction_id: Option<Uuid>,
}
```

## Testing

### Test with Stripe Test Cards:
- Success: `4242 4242 4242 4242`
- Requires 3D Secure: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 9995`

### Test Flow:
1. Create a payment link from merchant dashboard
2. Scan QR code or visit payment link URL
3. Click "Pay with Card"
4. Enter test card details
5. Verify payment completes and merchant receives funds
