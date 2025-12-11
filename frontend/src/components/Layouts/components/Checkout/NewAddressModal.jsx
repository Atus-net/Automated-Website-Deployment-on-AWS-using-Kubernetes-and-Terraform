import React from 'react';
import { Modal, Form, Input, Checkbox, Button, Space } from 'antd';
import AddressSelector from '../Account/contents/AddressSelector';

const NewAddressModal = ({
    open,
    onClose,
    form,
    userData,
    loading,
    handleAddressSubmit
}) => {
    return (
        <Modal
            title="Thêm địa chỉ mới"
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    fullName: userData?.name || '',
                    phone: userData?.phone || '',
                    isDefault: false
                }}
                onFinish={handleAddressSubmit}
            >
                <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                    <Input />
                </Form.Item>

                <AddressSelector form={form} />

                <Form.Item name="isDefault" valuePropName="checked">
                    <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
                </Form.Item>

                <Form.Item className="text-right">
                    <Space>
                        <Button onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lưu địa chỉ
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewAddressModal;