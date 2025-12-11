import { response } from '~/services/axios';

export const getPaymentReturn = async (queryString) => {
  try {
    const res = await response.get(`/api/payment/payment-return${queryString}`);
    return res;
  } catch (err) {
    console.error('Lỗi getPaymentReturn:', err.response?.data || err.message);
    throw err;
  }
};


export const createPaymentUrl = async (orderId) => {
  try {
    const res = await response.post('/api/payment/create-payment-url', { orderId });
    console.log(res);
    return res;
  } catch (err) {
    console.error('Lỗi createPaymentUrl:', err.response?.data || err.message);
    throw err;
  }
};