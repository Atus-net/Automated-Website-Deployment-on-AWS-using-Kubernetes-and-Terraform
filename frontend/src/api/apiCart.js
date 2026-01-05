import { response } from '~/services/axios'

export const getCart = async (instance) => {
    try {
        const res = await instance.get('/api/cart');
        return res; // instance đã tự data hóa rồi, khỏi .data
    }
    catch (err) {
        if (err.response)
            console.error('Server error: ', err.response.message, err.response.status);
        else
            console.error('Request error: ', err.message);
    }
}

export const updateCartItem = async (instance, item) => {
    try {
        const res = await instance.put(`/api/cart`, item, {

        })
        console.log('Update OK!')
        return res
    }
    catch (err) {
        if (err.response)
            console.error('Server error: ', err.response.message, err.response.status)
        else
            console.error('Request error: ', err.message)
    }
}

export const removeCartItem = async (instance, id) => {
    try {
        await instance.delete(`/api/cart/${id}`, {
        })
    }
    catch (err) {
        if (err.response)
            console.error('Server error: ', err.response.message, err.response.status)
        else
            console.error('Request error: ', err.message)
    }
}
export const removeManyCartItem = async (instance, productIds) => {
    debugger
    try {
        await instance.delete(`/api/cart/delete-many`, {
            data: { productIds: productIds }
        })
    }
    catch (err) {
        if (err.response)
            console.error('Server error: ', err.response.message, err.response.status)
        else
            console.error('Request error: ', err.message)
    }
}

export const addCartItem = async (instance, item) => {
    try {
        const res = await instance.post('/api/cart', item, {
        })
        console.log(res)
        return res
    }
    catch (err) {
        if (err.response) {
            console.log(err)
            console.log(err.response)
            console.error('Server error: ', err.response.message, err.response.status)
        }
        else
            console.error('Request error: ', err.message)
    }
}

export const createOrder = async (instance, invoice) => {
    try {
        const res = await instance.post('/api/order', invoice, {})
        return res.data
    }
    catch (err) {
        if (err.response)
            console.error('Server error: ', err.response.message, err.response.status)
        else
            console.error('Request error: ', err.message)
    }

}

