import React from 'react';
import { Card, Button, Tag } from 'antd';
import { EnvironmentOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const AddressSection = ({
    selectedAddress,
    addresses,
    setOpenAddressList,
    setOpenNewAddressModal
}) => (
    <Card
        title={<span><EnvironmentOutlined className="mr-2" /> Địa chỉ giao hàng</span>}
        className="w-full mb-6"
        extra={
            <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setOpenAddressList(true)}
                disabled={addresses.length === 0}
            >
                Thay đổi
            </Button>
        }
    >
        {selectedAddress ? (
            <div>
                <div className="flex justify-between">
                    <p className="font-medium">
                        {selectedAddress.fullName} | {selectedAddress.phone}
                    </p>
                    {selectedAddress.isDefault && <Tag color="blue">Mặc định</Tag>}
                </div>
                <p className="mt-2 text-gray-600">
                    {selectedAddress.detail}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}
                </p>
            </div>
        ) : (
            <div className="text-center py-4">
                <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào</p>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setOpenNewAddressModal(true)}
                >
                    Thêm địa chỉ mới
                </Button>
            </div>
        )}
    </Card>
);

export default AddressSection;