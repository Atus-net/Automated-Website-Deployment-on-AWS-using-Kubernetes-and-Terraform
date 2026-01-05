import { Button, Input, Modal, Select, notification, Upload } from "antd";
import { useState } from "react";
import { createCake } from "~/api/apiCakes";
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const AddProductModal = ({ fetchProducts }) => {
    const { TextArea } = Input;

    const [productName, setProductName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [description, setDescription] = useState("");
    const [productType, setProductType] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Hàm tải hình ảnh lên server
    const handleImageUpload = async (options) => {
        const { file, onSuccess, onError } = options;
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
                onSuccess("ok", file);
                notification.success({
                    message: "Thành công",
                    description: "Đã tải ảnh lên thành công.",
                });
            } else {
                throw new Error("Không nhận được URL hình ảnh từ server");
            }
        } catch (error) {
            onError(error);
            notification.error({
                message: "Lỗi tải ảnh lên",
                description: error.message || "Không thể tải hình ảnh lên.",
            });
            console.error("Image upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmitBtn = async () => {
        if (
            !productName.trim() ||
            !description.trim() ||
            !productType ||
            quantity === "" || price === ""
        ) {
            notification.error({
                message: "Thiếu thông tin",
                description: "Vui lòng điền đầy đủ thông tin",
            });
            return;
        }

        if (quantity < 0 || price < 0) {
            notification.error({
                message: "Giá trị không hợp lệ",
                description: "Giá và số lượng phải lớn hơn hoặc bằng 0",
            });
            return;
        }

        // Cho phép imageLink là null hoặc chuỗi rỗng
        const newProduct = {
            productName: productName.trim(),
            imageLink: imageFile || "", // Sử dụng chuỗi rỗng nếu không có ảnh
            description: description.trim(),
            productType,
            quantity: Number(quantity),
            price: Number(price),
        };

        try {
            const res = await createCake(newProduct);
            if (res.data) {
                notification.success({
                    message: "Thành công",
                    description: "Đã thêm sản phẩm mới",
                });
                resetAndCloseModal();
                await fetchProducts();
            } else {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể thêm sản phẩm",
                });
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Lỗi không xác định";
            notification.error({
                message: "Lỗi khi thêm sản phẩm",
                description: message.includes("ProductType not found")
                    ? "Loại sản phẩm không hợp lệ"
                    : message,
            });
            console.error("Error adding product:", error);
        }
    };

    const resetAndCloseModal = () => {
        setIsModalOpen(false);
        setProductName("");
        setImageFile(null);
        setDescription("");
        setProductType(null);
        setQuantity("");
        setPrice("");
    };

    return (
        <>
            <Button
                onClick={() => setIsModalOpen(true)}
                type="primary"
                style={{ backgroundColor: "#664545" }}
            >
                Thêm sản phẩm
            </Button>

            <Modal
                title="Thêm sản phẩm"
                open={isModalOpen}
                onOk={handleSubmitBtn}
                onCancel={resetAndCloseModal}
                okButtonProps={{ style: { backgroundColor: "#664545" }, loading: uploading }}
                maskClosable={false}
                okText="Thêm"
                width={1000}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
                        <span>Tên sản phẩm</span>
                        <Input
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>

                    <div>
                        <span>Hình ảnh <span style={{ color: '#888', fontStyle: 'italic' }}>(Tùy chọn)</span></span>
                        <Upload
                            customRequest={handleImageUpload}
                            showUploadList={true}
                            maxCount={1}
                        >
                            <Button 
                                icon={<UploadOutlined />} 
                                disabled={uploading || imageFile}
                            >
                                {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
                            </Button>
                        </Upload>
                        {imageFile && (
                            <div style={{ marginTop: '10px' }}>
                                <img 
                                    src={imageFile} 
                                    alt="Uploaded product" 
                                    style={{ maxWidth: '100%', maxHeight: '150px' }} 
                                />
                                <Button 
                                    type="text" 
                                    danger 
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => setImageFile(null)}
                                >
                                    Xóa ảnh
                                </Button>
                            </div>
                        )}
                    </div>

                    <div>
                        <span>Giá</span>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div>
                        <span>Số lượng</span>
                        <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    <div>
                        <span>Mô tả</span>
                        <TextArea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AddProductModal;