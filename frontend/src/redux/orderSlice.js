import { createAsyncThunk } from '@reduxjs/toolkit';
import { createInstance } from '../redux/interceptors';
import { loginSuccess } from '../redux/authSlice';

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async ({ cartItemIds, addressId, paymentMethod }, { getState, dispatch }) => {
        const { auth } = getState();
        const instance = createInstance(auth.login.currentUser, dispatch, loginSuccess);

        try {
            const response = await createOrder(instance, { cartItemIds, addressId, paymentMethod });
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Tạo đơn hàng thất bại');
        }
    }
);