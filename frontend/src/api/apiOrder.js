import { response } from '~/services/axios'


export const getOrders = async () => {
  try {
    const res = await response.get(`/api/orders/`);
    return res;
  } catch (err) {
    console.error('Lỗi getOrder:', err.response?.data || err.message);
    throw err;
  }
}


export const deleteOrders = async (id) => {
  try {
    const res = await response.delete(`/api/orders/${id}`);
    return res;
  } catch (err) {
    console.error('Lỗi deleteOrders:', err.response?.data || err.message);
    throw err;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const res = await response.patch(`/api/orders/status/${id}`, { status });
    return res;
  } catch (err) {
    console.error('Lỗi updateOrderStatus:', err.response?.data || err.message);
    throw err;
  }
};

export const getOrderDetail = async (id) => {
  try {
    const res = await response.get(`/api/orders/${id}`);
    return res;
  } catch (err) {
    console.error('Lỗi getOrderDetail:', err.response?.data || err.message);
    throw err;
  }
};

export const createOrder = async (instance, invoice) => {
  try {

    const res = await instance.post(`/api/orders`, invoice, {});
    return res.data;
  } catch (err) {
    console.error('Lỗi createOrder:', err.response?.data || err.message);
    throw err;
  }
};
