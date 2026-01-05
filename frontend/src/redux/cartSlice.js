import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createInstance } from '../redux/interceptors';
import { loginSuccess } from '../redux/authSlice';
import {
  addCartItem as apiAddCartItem,
  getCart as apiGetCart,
  removeCartItem as apiRemoveCartItem,
  removeManyCartItem as apiRemoveManyCartItems,
  updateCartItem as apiUpdateCartItem
} from '~/api/apiCart';

//Async Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, dispatch }) => {
    const { auth } = getState();
    const instance = createInstance(auth.login.currentUser, dispatch, loginSuccess);
    const response = await apiGetCart(instance);
    return response;
  }
);

export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async ({ productId, quantity }, { getState, dispatch }) => {
    const { auth } = getState();
    const instance = createInstance(auth.login.currentUser, dispatch, loginSuccess);
    const response = await apiAddCartItem(instance, { productId, quantity });
    return response.data;
  }
);

// export const updateCartItemQuantity = createAsyncThunk(
//   'cart/updateCartItemQuantity',
//   async ({ productId, quantity }, { getState, dispatch }) => {
//     const { auth } = getState();
//     const instance = createInstance(auth.login.currentUser, dispatch, loginSuccess);
//     const response = await apiUpdateCartItem(instance, { productId, quantity });
//     return response.data;
//   }
// );

// export const deleteCartItem = createAsyncThunk(
//   'cart/deleteCartItem',
//   async (productId, { getState, dispatch }) => {
//     const { auth } = getState();
//     const instance = createInstance(auth.login.currentUser, dispatch, loginSuccess);
//     const response = await apiRemoveCartItem(instance, productId);
//     return response;
//   }
// );

// export const deleteMultipleCartItems = createAsyncThunk(
//   'cart/deleteMultipleCartItems',
//   async (productIds, { getState, dispatch }) => {
//     const { auth } = getState();
//     const instance = createInstance(auth.login.currentUser, dispatch, loginSuccess);
//     const response = await apiRemoveManyCartItems(instance, productIds);
//     return response;
//   }
// );

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastUpdated: null
  },
  reducers: {

    resetCart: (state) => {
      state.items = [];
      state.lastUpdated = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.data?.items || [];
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add Cart Item
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.items = action.payload.data?.items || [];
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

    // Update Cart Item Quantity
    // .addCase(updateCartItemQuantity.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
    //   state.items = action.payload.data?.items || [];
    //   state.loading = false;
    //   state.lastUpdated = new Date().toISOString();
    // })
    // .addCase(updateCartItemQuantity.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message;
    // })

    // // Delete Cart Item
    // .addCase(deleteCartItem.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(deleteCartItem.fulfilled, (state, action) => {
    //   state.items = action.payload.data?.items || [];
    //   state.loading = false;
    //   state.lastUpdated = new Date().toISOString();
    // })
    // .addCase(deleteCartItem.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message;
    // })

    // // Delete Multiple Cart Items
    // .addCase(deleteMultipleCartItems.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(deleteMultipleCartItems.fulfilled, (state, action) => {
    //   state.items = action.payload.data?.items || [];
    //   state.loading = false;
    //   state.lastUpdated = new Date().toISOString();
    // })
    // .addCase(deleteMultipleCartItems.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message;
    // });
  }
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
// export const selectCartLastUpdated = (state) => state.cart.lastUpdated;
export const selectCartTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotalPrice = (state) =>
  state.cart.items.reduce((total, item) =>
    total + (item.product?.price || 0) * item.quantity, 0);
export const selectCartItemById = (productId) => (state) =>
  state.cart.items.find(item => item.product?._id === productId);

// Actions
export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;