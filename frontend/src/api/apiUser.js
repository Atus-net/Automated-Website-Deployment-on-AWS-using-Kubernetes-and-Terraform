import {response} from '~/services/axios';

//USERS
export const getCurrentUser = async () => {
  try {
    const res = await response.get(`/api/users/current-user`);
    return res;
  } catch (err) {
    console.error('Lỗi getCurrentUser:', err.response?.data || err.message);
    throw err;
  }
};

export const updateUser = async (data) => {
  try {
    const { id, ...updateData } = data;
    const res = await response.put(`/api/users/${id}`, updateData);
    return res;
  } catch (err) {
    console.error('Lỗi updateUser:', err.response?.data || err.message);
    throw err;
  }
};


export const updateImageUser = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await response.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res;
  } catch (err) {
    console.error('Lỗi updateImageUser:', err.response?.data || err.message);
    throw err;
  }
};
  

  export const requestPasswordUser = async (email) => {
    try {
      const res = await response.post('/api/auth/forgot-password', { email });
      return res.message;
    } catch (err) {
      console.error('Lỗi requestPasswordUser:', err.response?.data || err.message);
      throw err;
    }
  };

  export const changePasswordFromMail = async (data) => {
    try {
      const res = await response.post('/api/auth/reset-password', data);
      return res;
    } catch (err) {
      console.error('Lỗi changePasswordUserFromMail:', err.response?.data?.message || err.message);
      throw err;
    }
  };

export const changePasswordUser = async ( data ) => {
  try {
    const res = await response.put(`/api/users/current-user/update-password`,  data );
    return res;
  } catch (err) {
    console.error('Lỗi changePasswordUser:', err.response?.data?.message || err.message);
    throw err;
  }
};

export const getListUsers = async () => {
  try {
    const res = await response.get('/api/users/');
    return res;
  } catch (err) {
    console.error('Lỗi getListUsers:', err.response?.data || err.message);
    throw err;
  }
};


  export const softDeleteUser = async (id) => {
    try {
      const res = await response.delete(`/api/users/${id}`);
      return res;
    } catch (err) {
      console.error('Lỗi softDeleteUser:', err.response?.data || err.message);
      throw err;
    }
  };

  export const restoreUser = async (id) => {
    try {
      const res = await response.patch(`/api/users/${id}`);
      return res;
    } catch (err) {
      console.error('Lỗi restoreUser:', err.response?.data|| err.message);
      throw err;
    }
  };

  export const deleteUserPermanent = async (id) => {
    try {
      const res = await response.delete(`/api/users/permanent/${id}`);
      return res;
    } catch (err) {
      console.error('Lỗi deleteUserPermanent:',err.response?.data || err.message);
      throw err;
    }
  };

  export const toggleUserActive = async (id, isActive) => {
    try {
      const res = await response.patch(`/api/users/toggle-active/${id}`, {isActive});
      return res;
    } catch (err) {
      console.error('Lỗi toggleUserActive:', err.response?.data || err.message);
      throw err;
    }
  }

  export const updateUserRoleWithAuth = async (id, adminPassword, isAdmin) => {
    try {
      const res = await response.patch(`/api/users/role/${id}`,{
        adminPassword,
        isAdmin,
      });
      return res;
    } catch (err) {
      console.error('Lỗi updateUserRoleWithAuth:', err.response?.data || err.message);
      throw err;
    }
  }
//ADDRESS
  export const createAddress = async (data) => {
    try {
      const res = await response.post(`/api/address/`, data);
      return res;
    } catch (err) {
      console.error('Lỗi createAddress:', err.response?.data || err.message);
      throw err;
    }
  };

  export const getAllAddress = async () => {
    try {
      const res = await response.get(`/api/address/`);
      return res;
    } catch (err) {
      console.error('Lỗi getAllAddress:', err.response?.data || err.message );
      throw err;
    }
  };

  export const updateAddress = async (id, data) => {
    try {
      const res = await response.put(`/api/address/${id}`, data);
      return res;
    } catch (err) {
      console.error('Lỗi updateAddress:', err.response?.data || err.message);
      throw err;
    }
  };

  export const deleteAddress = async (id) => {
    try {
      const res =  await response.delete(`/api/address/${id}`);
      return res;
    } catch (err) {
        console.error('Lỗi deleteAddress:', err.response?.data || err.message);
        throw err;
    }
  };