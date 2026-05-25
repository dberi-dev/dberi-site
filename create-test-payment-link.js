#!/usr/bin/env node

/**
 * Quick script to create a test payment link
 * Usage: node create-test-payment-link.js
 */

const API_BASE = 'https://api.dberi.com/v1';

// You'll need to replace this with a real user ID from your database
// You can get one by querying: SELECT id FROM users LIMIT 1;
const USER_ID = 'REPLACE_WITH_USER_ID';

async function createPaymentLink() {
  const payload = {
    amount: 5000, // $50.00 in cents
    description: 'Test payment for web checkout',
    expires_in_hours: 24,
  };

  console.log('Creating payment link...');
  console.log('API:', `${API_BASE}/users/${USER_ID}/payment-links`);
  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${API_BASE}/users/${USER_ID}/payment-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const data = await response.json();

    console.log('\n✅ Payment link created successfully!\n');
    console.log('Payment Link ID:', data.id);
    console.log('Amount:', `$${(data.amount / 100).toFixed(2)}`);
    console.log('Status:', data.status);
    console.log('Description:', data.description);
    console.log('\n📱 Share URL:', data.share_url);
    console.log('🔗 Deep Link:', data.deep_link);
    console.log('\n🧪 Test this URL:');
    console.log(`   http://localhost:3000/pay/${data.id}`);
    console.log('\n⏰ Expires:', data.expires_at);

    return data;
  } catch (error) {
    console.error('\n❌ Error creating payment link:', error.message);

    if (USER_ID === 'REPLACE_WITH_USER_ID') {
      console.log('\n💡 You need to replace USER_ID in this script with a real user ID.');
      console.log('   Run this query in your database:');
      console.log('   SELECT id FROM users LIMIT 1;');
    }

    process.exit(1);
  }
}

createPaymentLink();
