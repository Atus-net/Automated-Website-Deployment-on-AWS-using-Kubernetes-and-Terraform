import React from 'react';
import { Modal, Card, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AddressListModal = ({
    open,
    onClose,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    setOpenNewAddressModal
}) => {
    return (
        <Modal
            title="Chọn địa chỉ giao hàng"
            open={open}
            onCancel={onClose}
            footer={[
                <Button
                    key="add"
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        onClose();
                        setOpenNewAddressModal(true);
                    }}
                >
                    Thêm địa chỉ mới
                </Button>,
                <Button key="cancel" onClick={onClose}>
                    Đóng
                </Button>
            ]}
        >
            <div className="max-h-96 overflow-y-auto">
                {addresses.length > 0 ? (
                    <div className="space-y-4">
                        {addresses.map(address => (
                            <Card
                                key={address._id}
                                hoverable
                                onClick={() => {
                                    setSelectedAddressId(address._id);
                                    onClose();
                                }}
                                className={`cursor-pointer ${selectedAddressId === address._id ? 'border-blue-500' : ''}`}
                            >
                                <div className="flex justify-between">
                                    <p className="font-medium">
                                        {address.fullName} | {address.phone}
                                    </p>
                                    {address.isDefault && <Tag color="blue">Mặc định</Tag>}
                                </div>
                                <p className="mt-2 text-gray-600">
                                    {address.detail}, {address.ward}, {address.district}, {address.province}
                                </p>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào</p>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                onClose();
                                setOpenNewAddressModal(true);
                            }}
                        >
                            Thêm địa chỉ mới
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AddressListModal;