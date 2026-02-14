import { logger } from './logger';

// --- CONFIGURATION ---
export interface PhonePeConfig {
  merchantId: string;
  clientId?: string;
  clientSecret: string;
  clientVersion?: number;
  environment: 'preprod' | 'production' | 'prod';
}

// Default Domain for redirects
const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "https://www.math4code.com";

/**
 * Get OAuth Token for Standard Checkout v2
 */
async function getOAuthToken(config: PhonePeConfig): Promise<string | null> {
  try {
    const isProd = config.environment === 'production' || config.environment === 'prod';
    const OAUTH_BASE = isProd
      ? 'https://api.phonepe.com/apis/identity-manager'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

    const url = `${OAUTH_BASE}/v1/oauth/token`;

    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.clientId || config.merchantId,
      client_secret: config.clientSecret,
      client_version: (config.clientVersion || 1).toString()
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params,
      // cache: "no-store" -- Not supported in Cloudflare Edge
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      logger.error("❌ Token Response Parse Error:", responseText);
      return null;
    }

    if (response.ok && data?.access_token) {
      return data.access_token;
    } else {
      logger.error(`❌ Token Generation Failed [${response.status}]:`, responseText);
      return null;
    }
  } catch (error: any) {
    logger.error("❌ Token Error:", error.message, error.stack);
    return null;
  }
}

/**
 * Initiate Payment using Standard Checkout v2
 */
export async function createPayment(
  config: PhonePeConfig,
  merchantTransactionId: string,
  amount: number,
  userId: string,
  isMobile: boolean = false
) {
  try {
    const isProd = config.environment === 'production' || config.environment === 'prod';
    const API_BASE = isProd
      ? 'https://api.phonepe.com/apis/pg'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

    // Get OAuth Token
    const token = await getOAuthToken(config);
    if (!token) {
      throw new Error("Failed to generate OAuth token");
    }

    const redirectUrl = `${DEFAULT_DOMAIN}/api/phonepe/redirect?transactionId=${merchantTransactionId}${isMobile ? '&source=mobile' : ''}`;
    const callbackUrl = `${DEFAULT_DOMAIN}/api/phonepe/callback`;

    // Build Payment Request for Standard Checkout v2
    const paymentPayload = {
      merchantOrderId: merchantTransactionId,
      amount: Math.round(amount * 100), // Convert to paise
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          redirectUrl: redirectUrl,
          callbackUrl: callbackUrl
        }
      }
    };

    const url = `${API_BASE}/checkout/v2/pay`;

    logger.log(`🚀 Initiating Payment: ${url}`);
    logger.log(`   Payload:`, JSON.stringify(paymentPayload, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `O-Bearer ${token}`
      },
      body: JSON.stringify(paymentPayload),
      // cache: "no-store" -- Not supported in Cloudflare Edge
    });

    const data = await response.json();

    logger.log(`   Response:`, JSON.stringify(data, null, 2));

    if (data?.redirectUrl) {
      return {
        success: true,
        data: {
          redirectUrl: data.redirectUrl
        }
      };
    } else {
      logger.error("❌ Payment Initiation Failed:", JSON.stringify(data));
      return {
        success: false,
        error: data?.message || "Payment initiation failed",
        details: data
      };
    }

  } catch (error: any) {
    logger.error("❌ PhonePe Payment Initiation Error:", error);
    return {
      success: false,
      error: error.message || "Payment initiation failed",
      details: error
    };
  }
}

/**
 * Check Payment Status using Standard Checkout v2 (OAuth Flow)
 */
export async function checkPaymentStatus(config: PhonePeConfig, merchantTransactionId: string) {
  logger.log(`🔄 Checking Payment Status (v2 OAuth) for: ${merchantTransactionId}`);

  try {
    const isProd = config.environment === 'production' || config.environment === 'prod';
    const API_BASE = isProd
      ? 'https://api.phonepe.com/apis/pg'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

    // Get OAuth Token
    const token = await getOAuthToken(config);
    if (!token) {
      throw new Error("Failed to generate OAuth token");
    }

    const url = `${API_BASE}/checkout/v2/order/${merchantTransactionId}/status`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `O-Bearer ${token}`
      },
      // cache: "no-store"
    });

    const data = await response.json();
    return data;

  } catch (error: any) {
    logger.error("❌ Status Check Error:", error.message);
    return {
      success: false,
      code: "FAILED",
      message: error.message
    };
  }
}

/**
 * Helper to compute SHA256 hash using Web Crypto API (Edge Runtime Compatible)
 */
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Initiate Refund using v1 API (checksum-based)
 */
export async function refundTransaction(
  config: PhonePeConfig,
  originalTransactionId: string,
  amount: number,
  userId: string
) {
  try {
    const isProd = config.environment === 'production' || config.environment === 'prod';
    const API_BASE = isProd
      ? 'https://api.phonepe.com/apis/pg'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

    const newRefundTxnId = `RF${Date.now()}`;

    const refundPayload = {
      merchantId: config.merchantId,
      merchantUserId: userId,
      originalTransactionId: originalTransactionId,
      merchantTransactionId: newRefundTxnId,
      amount: Math.round(amount * 100), // in paise
      callbackUrl: `${DEFAULT_DOMAIN}/api/phonepe/callback`
    };

    const payload = JSON.stringify(refundPayload);
    const payloadBase64 = btoa(payload);

    const saltKey = config.clientSecret;
    const saltIndex = config.clientVersion || 1;

    const apiPath = "/pg/v1/refund";
    const stringToHash = payloadBase64 + apiPath + saltKey;

    const sha256Hash = await sha256(stringToHash);
    const xVerify = `${sha256Hash}###${saltIndex}`;

    const url = `${API_BASE}${apiPath}`;

    logger.log(`💸 Initiating Refund for: ${originalTransactionId}, Amount: ${amount}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify
      },
      body: JSON.stringify({ request: payloadBase64 })
    });

    const resData = await response.json();

    if (resData.success) {
      return {
        success: true,
        data: resData.data,
        message: "Refund Initiated Successfully"
      };
    } else {
      return {
        success: false,
        message: resData.message || "Refund Failed"
      };
    }

  } catch (error: any) {
    logger.error("❌ Refund Error:", error.message);
    return {
      success: false,
      message: error.message
    };
  }
}
