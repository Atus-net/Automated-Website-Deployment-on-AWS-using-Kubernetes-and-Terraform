const Address = require('../models/address.model');

const createAddress = async (userId, data) => {
    const countAddress = await Address.countDocuments({ user: userId });
    if (countAddress === 0) {
        data.isDefault = true;
    }
    data.user = userId;
    const address = await Address.create(data);
    return address;
};

const getAllAddress = async (userId) => {
    return await Address.find({ user: userId });
};

const updateAddress = async (addressId, userId, data) => {
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) throw new Error('Address not found');

    if (data.isDefault === true) {
        await Address.updateMany({ user: userId }, { isDefault: false });
    }
    return await Address.findByIdAndUpdate(addressId, data, { new: true });
};

const deleteAddress = async (addressId, userId) => {
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
        throw new Error('Address not found');
    }

    // Không cho xóa nếu là address default
    if (address.isDefault) {
        throw new Error('Cannot delete default address. Please change default address before delete.');
    }

    await Address.deleteOne({ _id: addressId });

    return {
        code: 200,
        message: 'Delete address successfully',
    };
}

module.exports = {
    createAddress,
    getAllAddress,
    updateAddress,
    deleteAddress
};
