import { Input, Modal, Select, notification, Upload, Button } from "antd";
import { useEffect, useState } from "react";
import { updateCake, getCakeById } from "~/api/apiCakes";
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const UpdateProductModal = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, fetchProducts } = props;
    const { TextArea } = Input;

    const [id, setId] = useState("");
    const [productName, setProductName] = useState("");
    const [imageFile, setImageFile] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [productType, setProductType] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Handle image upload
    const handleImageUpload = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.imageUrl) {
                setImageFile(response.data.imageUrl);
                notification.success({
                    message: "Thành công",
                    description: "Đã tải ảnh lên thành công.",
                });
            } else {
                throw new Error("Không nhận được URL hình ảnh từ server");
            }
        } catch (error) {
            notification.error({
                message: "Lỗi tải ảnh lên",
                description: error.message || "Không thể tải hình ảnh lên.",
            });
            console.error("Image upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    // Fetch data when modal opens
    useEffect(() => {
        const fetchCakeData = async () => {
            if (dataUpdate && dataUpdate._id) {
                try {
                    const res = await getCakeById(dataUpdate._id);
                    if (res && res.data) {
                        const { _id, productName, imageFile, price, quantity, description, productType } = res.data;
                        setId(_id);
                        setProductName(productName || "");
                        setImageFile(imageFile || "");
                        setPrice(price || "");
                        setQuantity(quantity || "");
                        setDescription(description || "");
                        setProductType(productType || null);
                    }
                } catch (error) {
                    console.error("Lỗi khi tải dữ liệu:", error);
                    notification.error({
                        message: "Lỗi tải dữ liệu",
                        description: "Không thể tải thông tin sản phẩm.",
                    });
                }
            }
        };

        if (isModalUpdateOpen) {
            fetchCakeData();
        } else {
            setId("");
            setProductName("");
            setImageFile("");
            setPrice("");
            setQuantity("");
            setDescription("");
            setProductType(null);
        }
    }, [isModalUpdateOpen, dataUpdate]);

    const handleSubmitBtn = async () => {
        if (!productName || !imageFile || !price || !quantity || !description || !productType) {
            notification.error({
                message: "Validation Error",
                description: "Vui lòng điền đầy đủ thông tin",
            });
            return;
        }

        try {
            const res = await updateCake(id, productName, imageFile, price, quantity, description, productType);
            if (res.code === 200) {
                notification.success({
                    message: "Cập nhật sản phẩm",
                    description: "Cập nhật bánh thành công",
                });
                resetAndCloseModal();
                await fetchProducts();
            } else {
                throw new Error("Cập nhật thất bại");
            }
        } catch (error) {
            notification.error({
                message: "Lỗi cập nhật sản phẩm",
                description: "Cập nhật thất bại",
            });
        }
    };

    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false);
        setId("");
        setProductName("");
        setImageFile("");
        setPrice("");
        setQuantity("");
        setDescription("");
        setProductType(null);
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Cập nhật sản phẩm"
            open={isModalUpdateOpen}
            onOk={handleSubmitBtn}
            onCancel={resetAndCloseModal}
            okButtonProps={{ style: { backgroundColor: "#664545" } }}
            maskClosable={false}
            okText="Cập nhật"
            cancelText="Hủy"
            width={1000}
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <div>
                    <span>Loại bánh</span>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn loại bánh"
                        options={[
                            { value: '67de79685a1a07a80a724780', label: 'Bánh sinh nhật' },
                            { value: '67de79685a1a07a80a724781', label: 'Bánh mỳ & Bánh khác' },
                            { value: '67de79685a1a07a80a724783', label: 'Cookies & Mini Cake' },
                            { value: '67de79685a1a07a80a724782', label: 'Bánh truyền thống' },
                        ]}
                        value={productType}
                        onChange={(value) => setProductType(value)}
                    />
                </div>

                <div>
                    <span>Sản phẩm</span>
                    <Input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </div>

                <div>
                    <span>Hình ảnh </span>
                    <Upload
                        customRequest={({ file }) => handleImageUpload(file)}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />} loading={uploading}>Tải ảnh lên</Button>
                    </Upload>
                </div>

                <div>
                    <span>Giá</span>
                    <Input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div>
                    <span>Số lượng</span>
                    <Input
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>

                <div>
                    <span>Description</span>
                    <TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default UpdateProductModal;
