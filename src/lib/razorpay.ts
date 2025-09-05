import Razorpay from 'razorpay';

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export interface CreateOrderOptions {
  amount: number; // Amount in paise (multiply by 100)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

/**
 * Create Razorpay order
 */
export const createRazorpayOrder = async (options: CreateOrderOptions) => {
  try {
    const order = await razorpay.orders.create({
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt || `receipt_${Date.now()}`,
      notes: options.notes || {},
    });

    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};

/**
 * Verify Razorpay payment signature
 */
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};

/**
 * Get payment details
 */
export const getPaymentDetails = async (paymentId: string) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
};

/**
 * Refund payment
 */
export const refundPayment = async (paymentId: string, amount?: number) => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount, // Amount in paise, if not provided, full refund
    });
    return refund;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw new Error('Failed to process refund');
  }
};

/**
 * Get order details
 */
export const getOrderDetails = async (orderId: string) => {
  try {
    const order = await razorpay.orders.fetch(orderId);
    return order;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw new Error('Failed to fetch order details');
  }
};

/**
 * Create customer
 */
export const createCustomer = async (customerData: {
  name: string;
  email: string;
  contact?: string;
  notes?: Record<string, string>;
}) => {
  try {
    const customer = await razorpay.customers.create(customerData);
    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new Error('Failed to create customer');
  }
};

/**
 * Generate payment link
 */
export const createPaymentLink = async (linkData: {
  amount: number;
  currency?: string;
  description: string;
  customer: {
    name: string;
    email: string;
    contact?: string;
  };
  notify?: {
    sms?: boolean;
    email?: boolean;
  };
  reminder_enable?: boolean;
  notes?: Record<string, string>;
  callback_url?: string;
  callback_method?: string;
}) => {
  try {
    const paymentLink = await razorpay.paymentLink.create({
      amount: linkData.amount,
      currency: linkData.currency || 'INR',
      description: linkData.description,
      customer: linkData.customer,
      notify: linkData.notify || { sms: true, email: true },
      reminder_enable: linkData.reminder_enable || true,
      notes: linkData.notes || {},
      callback_url: linkData.callback_url,
      callback_method: linkData.callback_method || 'get',
    });

    return paymentLink;
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw new Error('Failed to create payment link');
  }
};

export default razorpay;
