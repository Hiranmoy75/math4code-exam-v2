/**
 * ============================================================================
 * CASHFREE PAYMENT GATEWAY INTEGRATION
 * ============================================================================
 * Cashfree payment processing library
 * 
 * Features:
 * - Payment initiation
 * - Payment verification
 * - Webhook handling
 * - Multi-tenant support
 * ============================================================================
 */

export interface CashfreeConfig {
    appId: string;
    secretKey: string;
    environment: 'sandbox' | 'production';
}

export interface CashfreePaymentRequest {
    orderId: string;
    orderAmount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    returnUrl: string;
    notifyUrl: string;
}

export interface CashfreePaymentResponse {
    success: boolean;
    paymentSessionId?: string;
    paymentUrl?: string;
    error?: string;
    environment?: 'sandbox' | 'production'; // Added for frontend SDK init
}



/**
 * Cashfree Payment Gateway Class
 */
export class CashfreePayment {
    private config: CashfreeConfig;
    private baseUrl: string;

    constructor(config: CashfreeConfig) {
        this.config = config;
        // Sandbox বা Production URL
        this.baseUrl = config.environment === 'production'
            ? 'https://api.cashfree.com/pg'
            : 'https://sandbox.cashfree.com/pg';
    }

    /**
     * Initiate payment
     * Payment শুরু করার function
     */
    async initiatePayment(request: CashfreePaymentRequest): Promise<CashfreePaymentResponse> {
        try {
            // Trim credentials
            const appId = this.config.appId.trim();
            const secretKey = this.config.secretKey.trim();

            const isProduction = this.config.environment === 'production';
            const apiUrl = isProduction
                ? 'https://api.cashfree.com/pg/orders'
                : 'https://sandbox.cashfree.com/pg/orders';

            // Ensure phone is 10 digits
            // Default to '9999999999' if invalid (Cashfree requires valid phone)
            let phone = request.customerPhone.replace(/\D/g, '');
            if (phone.length > 10) phone = phone.slice(-10);
            if (phone.length < 10) phone = '9999999999';

            const payload = {
                order_id: request.orderId,
                order_amount: parseFloat(request.orderAmount.toString()),
                order_currency: 'INR',
                customer_details: {
                    customer_id: request.orderId,
                    customer_name: request.customerName,
                    customer_email: request.customerEmail,
                    customer_phone: phone,
                },
                order_meta: {
                    return_url: request.returnUrl,
                    notify_url: request.notifyUrl,
                },
            };

            console.log('📤 Cashfree Request:', { url: apiUrl, payload });

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'x-client-id': appId,
                    'x-client-secret': secretKey,
                    'x-api-version': '2025-01-01', // Updated to latest version as per user request
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            console.log('🔵 Cashfree API Response:', { status: response.status, data });

            if (!response.ok) {
                console.error('❌ Cashfree API Error:', data);
                return {
                    success: false,
                    error: data.message || data.code || 'Payment initiation failed',
                };
            }

            // ✅ Use payment_link directly if available (Standard in older versions)
            if (data.payment_link) {
                console.log('🔗 Used Direct API Payment Link:', data.payment_link);
                return {
                    success: true,
                    paymentSessionId: data.payment_session_id || '',
                    paymentUrl: data.payment_link,
                };
            }

            // Fallback for newer versions (manual construction)
            // Fallback for newer versions (manual construction)
            const paymentSessionId = data.payment_session_id ? data.payment_session_id.trim() : '';

            // We use the raw session ID, but ensuring it is URL encoded
            const encodedSessionId = encodeURIComponent(paymentSessionId);

            // Fallback URL (if payment_link missing)
            let checkoutUrl = "";
            if (this.config.environment === 'production') {
                checkoutUrl = `https://payments.cashfree.com/checkout?payment_session_id=${encodedSessionId}`;
            } else {
                checkoutUrl = `https://sandbox.cashfree.com/checkout?payment_session_id=${encodedSessionId}`;
            }

            console.log('🔗 Generated Fallback URL:', checkoutUrl);

            return {
                success: true,
                paymentSessionId: paymentSessionId,
                paymentUrl: checkoutUrl,
                environment: this.config.environment,
            };
        } catch (error: any) {
            console.error('Cashfree payment initiation error:', error);
            return {
                success: false,
                error: error.message || 'Payment initiation failed',
            };
        }
    }

    /**
     * Verify payment status
     * Payment verify করার function
     */
    async verifyPayment(orderId: string): Promise<{
        success: boolean;
        status?: string;
        amount?: number;
        error?: string;
    }> {
        try {
            const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-id': this.config.appId,
                    'x-client-secret': this.config.secretKey,
                    'x-api-version': '2025-01-01',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Payment verification failed',
                };
            }

            return {
                success: true,
                status: data.order_status,
                amount: data.order_amount,
            };
        } catch (error: any) {
            console.error('Cashfree payment verification error:', error);
            return {
                success: false,
                error: error.message || 'Payment verification failed',
            };
        }
    }

    /**
     * Test connection
     * API credentials test করার function
     */
    async testConnection(): Promise<{ success: boolean; error?: string }> {
        try {
            // Create a test order to verify credentials
            const testOrderId = `TEST_${Date.now()}`;
            const testOrderData = {
                order_id: testOrderId,
                order_amount: 1.00, // Must be number
                order_currency: 'INR',
                customer_details: {
                    customer_id: testOrderId, // ✅ Use orderId as customer_id
                    customer_name: 'Test User',
                    customer_email: 'hiranmoymandalucb@gmail.com',
                    customer_phone: '6297534924',
                },
                order_meta: {
                    return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.math4code.com'}/payment/verifymock`,
                    notify_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.math4code.com'}/api/payments/callbackmock`,
                },
            };

            const isProduction = this.config.environment === 'production';
            const apiUrl = isProduction
                ? 'https://api.cashfree.com/pg/orders'
                : 'https://sandbox.cashfree.com/pg/orders';

            console.log('🧪 Testing Cashfree connection...');
            console.log('📤 Test Request:', { url: apiUrl, data: testOrderData });

            // Trim credentials to avoid whitespace issues
            const appId = this.config.appId.trim();
            const secretKey = this.config.secretKey.trim();

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'x-client-id': appId,
                    'x-client-secret': secretKey,
                    'x-api-version': '2025-01-01',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(testOrderData),
            });

            const data = await response.json();

            console.log('📥 Test Response Status:', response.status);
            console.log('📥 Test Response:', JSON.stringify(data, null, 2));

            if (!response.ok) {
                console.error('❌ Cashfree Test Failed:', data);
                return {
                    success: false,
                    error: data.message || data.code || `API Error: ${response.status}`,
                };
            }

            // If we got a payment_session_id, credentials are valid
            if (data.payment_session_id) {
                let paymentSessionId = data.payment_session_id.trim();
                // Fix for duplicate suffix bug - DISABLED
                /* if (paymentSessionId.endsWith('paymentpayment')) {
                    paymentSessionId = paymentSessionId.replace(/paymentpayment$/, 'payment');
                    console.warn('⚠️ Fixed duplicate suffix in test connection.');
                } */

                console.log('✅ Cashfree credentials are valid!');
                return { success: true };
            }

            return {
                success: false,
                error: 'Invalid response from Cashfree API',
            };
        } catch (error: any) {
            console.error('❌ Cashfree connection test error:', error);
            return {
                success: false,
                error: error.message || 'Connection test failed',
            };
        }
    }
}

/**
 * ============================================================================
 * HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * Create Cashfree instance from config
 */
export function createCashfreeInstance(config: CashfreeConfig): CashfreePayment {
    return new CashfreePayment(config);
}

/**
 * Format amount for Cashfree (in rupees, not paise)
 */
export function formatCashfreeAmount(amount: number): number {
    return amount; // Cashfree uses rupees directly
}
