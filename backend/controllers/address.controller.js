const addressService = require('../services/address.service');

const createAddress = async (req, res) => {
    try {
        const address = await addressService.createAddress(req.user.id, req.body);
        res.status(201).json(address);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllAddress = async (req, res) => {
    try {
        const addresses = await addressService.getAllAddress(req.user.id);
        res.status(200).json(addresses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateAddress = async (req, res) => {
    try {
        const address = await addressService.updateAddress(req.params.id, req.user.id, req.body);
        res.status(200).json(address);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAddress = async (req, res) => {
    try {
        await addressService.deleteAddress(req.params.id, req.user.id);
        res.status(200).json({ message: 'Delete success' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createAddress,
    getAllAddress,
    updateAddress,
    deleteAddress
};
