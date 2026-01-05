import React from 'react';
import { Modal } from 'antd';

const CartModal = ({ open, onOk, onCancel, confirmLoading, modalText }) => {
    return (
        <Modal
            open={open}
            onOk={onOk}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
            okText="Có"
            cancelText="Quay lại"
        >
            <p>{modalText}</p>
        </Modal>
    );
};

export default CartModal;