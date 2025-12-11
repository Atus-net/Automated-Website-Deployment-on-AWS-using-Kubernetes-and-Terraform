import React, { useEffect, useState } from 'react';
import { getAllAddress, createAddress, updateAddress, deleteAddress } from '~/api/apiUser';
import AddressSelector from './AddressSelector';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  List,
  Tag,
  Popconfirm,
  message,
  Space,
  Typography
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const initialForm = {
  fullName: '',
  phone: '',
  province: '',
  district: '',
  ward: '',
  detail: '',
  full_address: '',
  isDefault: false,
};

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await getAllAddress();
      setAddresses(res || []);
    } catch (err) {
      message.error('Lỗi khi tải danh sách địa chỉ');
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpen = (address = null) => {
    if (address) {
      form.setFieldsValue(address);
      setEditId(address._id);
    } else {
      form.resetFields();
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
    setEditId(null);
  };

  const handleSetDefault = async (id) => {
    try {
      await Promise.all(
        addresses.map((addr) =>
          addr._id !== id && addr.isDefault
            ? updateAddress(addr._id, { ...addr, isDefault: false })
            : Promise.resolve(),
        ),
      );
      await updateAddress(id, { isDefault: true });
      message.success('Đã cập nhật địa chỉ mặc định');
      fetchAddresses();
    } catch (err) {
      message.error('Không thể cập nhật địa chỉ mặc định');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (values.isDefault) {
        await Promise.all(
          addresses.map((addr) => addr.isDefault && updateAddress(addr._id, { ...addr, isDefault: false })),
        );
      }

      if (editId) {
        await updateAddress(editId, values);
        message.success('Cập nhật địa chỉ thành công');
      } else {
        await createAddress(values);
        message.success('Thêm địa chỉ mới thành công');
      }

      fetchAddresses();
      handleClose();
    } catch (err) {
      console.error(err);
      if (!err.errorFields) {
        message.error('Lỗi khi lưu địa chỉ');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setConfirmLoading(true);
    try {
      await deleteAddress(id);
      message.success('Đã xóa địa chỉ');
      fetchAddresses();
    } catch (err) {
      message.error('Không thể xóa địa chỉ mặc định');
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="w-full">
        <div className="flex flex-col w-full">
            <div className="flex items-center justify-between mb-6">
                <Text strong className="text-xl">Địa chỉ giao hàng</Text>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpen()}
                >
                    Thêm địa chỉ
                </Button>
            </div>

            {addresses.length === 0 ? (
                <Card>
                    <Text className="text-gray-500">Chưa có địa chỉ nào.</Text>
                </Card>
            ) : (
                <List
                    dataSource={[...addresses].sort((a, b) => b.isDefault - a.isDefault)}
                    renderItem={(addr) => (
                        <List.Item className="!p-0 !border-b">
                            <div className={`flex items-center w-full p-4 hover:bg-gray-50 ${addr.isDefault ? 'bg-blue-50' : ''}`}>
                                <div className="flex items-center flex-1 min-w-0">
                                    <EnvironmentOutlined className={`mr-3 ${addr.isDefault ? 'text-blue-500' : 'text-gray-500'}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 truncate">
                                            <Text strong className="truncate max-w-[120px]">
                                                {addr.fullName}
                                            </Text>
                                            <Text type="secondary">|</Text>
                                            <Text className="text-gray-600 truncate max-w-[100px]">
                                                {addr.phone}
                                            </Text>
                                            {addr.isDefault && (
                                                <Tag color="blue" className="ml-2 flex-shrink-0">
                                                    Mặc định
                                                </Tag>
                                            )}
                                        </div>
                                        <Text ellipsis className="text-gray-600 mt-1">
                                            {addr.full_address || `${addr.detail}, ${addr.ward}, ${addr.district}, ${addr.province}`}
                                        </Text>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                    {!addr.isDefault && (
                                        <Button size="small" variant="outlined" onClick={() => handleSetDefault(addr._id)} className="mt-2">
                                            Đặt làm địa chỉ mặc định
                                        </Button>
                                    )}

                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => handleOpen(addr)}
                                        className="text-gray-500 hover:text-primary"
                                    />

                                    <Popconfirm
                                        title="Xóa địa chỉ này?"
                                        onConfirm={() => handleDelete(addr._id)}
                                        okText="Xóa"
                                        cancelText="Hủy"
                                        disabled={addr.isDefault}
                                    >
                                        <Button
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            className={`text-gray-500 hover:text-red-500 ${addr.isDefault ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            danger
                                            disabled={addr.isDefault}
                                        />
                                    </Popconfirm>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            )}

            <Modal
                title={editId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
                open={open}
                onCancel={handleClose}
                footer={[
                    <Button key="back" onClick={handleClose}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        Lưu
                    </Button>,
                ]}
                width={900}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialForm}
                    className="w-full"
                >
                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input />
                    </Form.Item>

                    <AddressSelector form={form} />

                    <Form.Item
                        name="isDefault"
                        valuePropName="checked"
                    >
                        <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    </div>
);
}