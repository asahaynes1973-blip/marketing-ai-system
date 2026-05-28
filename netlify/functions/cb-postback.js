// netlify/functions/cb-postback.js
// ClickBank Instant Notification (postback) handler
//
// Environment variables (set in Netlify dashboard → Site settings → Environment variables):
//   CB_SECRET_KEY    - Your ClickBank secret key for signature verification (optional but recommended)
//   FB_ACCESS_TOKEN  - (optional) Facebook Conversions API token for server-side events
//   FB_PIXEL_ID      - (optional) 182003375661868

const crypto = require('crypto');

exports.handler = async function(event, context) {
  let params;

  if (event.httpMethod === 'POST') {
    try {
      params = JSON.parse(event.body);
    } catch (e) {
      params = Object.fromEntries(new URLSearchParams(event.body));
    }
  } else if (event.httpMethod === 'GET') {
    params = event.queryStringParameters || {};
  } else {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Extract key fields from ClickBank postback
  const transactionType = params.ctransaction || '';
  const receipt        = params.creceipt || '';
  const amount         = params.ctransamount || '0';
  const tid            = params.ctid || '';
  const item           = params.cproditem || '';
  const vendorName     = params.cvendor || '';
  const affiliateId    = params.caffitid || '';
  const timestamp      = new Date().toISOString();

  // Log the postback (visible in Netlify → Functions → cb-postback → Logs)
  console.log(JSON.stringify({
    event: 'clickbank_postback',
    timestamp,
    transactionType,
    receipt,
    amount,
    tid,
    item,
    vendorName,
    affiliateId,
    raw: params
  }));

  // Optional: signature verification using CB_SECRET_KEY
  if (process.env.CB_SECRET_KEY) {
    const secretKey = process.env.CB_SECRET_KEY;
    const receivedSig = params.cverify || '';
    if (receivedSig) {
      const dataToVerify = `${receipt}|${amount}|${secretKey}`;
      const expectedSig = crypto
        .createHash('sha1')
        .update(dataToVerify)
        .digest('hex')
        .substring(0, 8)
        .toUpperCase();
      if (receivedSig.toUpperCase() !== expectedSig) {
        console.error('Postback signature mismatch — possible spoofed request');
        return { statusCode: 401, body: 'Unauthorized' };
      }
    }
  }

  // Optional: Facebook Conversions API (server-side Purchase event)
  // Uncomment and configure once FB_ACCESS_TOKEN is set in Netlify env vars
  /*
  if (transactionType === 'SALE' && process.env.FB_ACCESS_TOKEN) {
    const pixelId = process.env.FB_PIXEL_ID || '182003375661868';
    const capiPayload = {
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: `https://heartfelt-kleicha-5421e5.netlify.app`,
        action_source: 'website',
        custom_data: {
          currency: 'USD',
          value: parseFloat(amount),
          order_id: receipt,
          content_ids: [item],
          content_type: 'product'
        }
      }]
    };
    try {
      const fetch = require('node-fetch');
      await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${process.env.FB_ACCESS_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capiPayload)
      });
    } catch (err) {
      console.error('CAPI error:', err.message);
    }
  }
  */

  return {
    statusCode: 200,
    body: 'OK'
  };
};
