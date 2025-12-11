import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { notification, Popconfirm, Table, Input } from 'antd';
import { useEffect, useState } from 'react';
import AddProductModal from '~/components/Layouts/components/AdminProduct/AddProduct';
import UpdateProductModal from '~/components/Layouts/components/AdminProduct/UpdateProduct';
import { deleteCake, getAllCakes, getCakeById } from '~/api/apiCakes';

const AdminProduct = () => {
  const [cakes, setCakes] = useState([]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  const fetchCakes = async () => {
    try {
      const res = await getAllCakes();
      if (res.code === 200) {
        setCakes(res.data || []);
      } else {
        notification.error({
          message: 'Lỗi',
          description: 'Không lấy được danh sách sản phẩm',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không lấy được danh sách sản phẩm',
      });
    }
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  useEffect(() => {
    const filtered = cakes.filter((cake) =>
      cake.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filtered);
  }, [searchTerm, cakes]);

  const handleDeleteCake = async (id) => {
    try {
      const res = await deleteCake(id); // Gọi API soft delete
      if (res.code === 200) {
        notification.success({
          message: 'Xóa sản phẩm',
          description: 'Xóa sản phẩm thành công',
        });
        fetchCakes(); // Tải lại danh sách sản phẩm
      } else {
        notification.error({
          message: 'Lỗi',
          description: 'Xóa sản phẩm thất bại',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Xóa sản phẩm thất bại',
      });
    }
  };

  const columns = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Ảnh sản phẩm',
      dataIndex: 'imageLink',
      render: (text) => (
        <img
          src={text}
          alt="product"
          style={{ width: '100px', height: '90px', objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'price',
      render: (price) => `${price} đ`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (quantity) => `${quantity}`,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 250,
      render: (text) => (
        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '20px' }}>
          <EditOutlined
            onClick={async () => {
              try {
                const res = await getCakeById(record._id); // Gọi API lấy chi tiết sản phẩm
                if (res.code === 200) {
                  setDataUpdate({
                    ...res.data,
                    productName: res.data.product_name,
                    imageLink: res.data.image_link,
                    description: res.data.description,
                    price: res.data.price,
                    quantity: res.data.quantity,
                    productTypeId: res.data.product_type_id,
                  });
                  setIsModalUpdateOpen(true);
                } else {
                  notification.error({
                    message: 'Lỗi',
                    description: 'Không lấy được chi tiết sản phẩm',
                  });
                }
              } catch (error) {
                notification.error({
                  message: 'Lỗi',
                  description: 'Không lấy được chi tiết sản phẩm',
                });
              }
            }}
            style={{ cursor: 'pointer', color: 'orange' }}
          />

          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn chắc chắn xóa sản phẩm này?"
            onConfirm={() => handleDeleteCake(record._id)}
            okText="Yes"
            cancelText="No"
            placement="left"
            okButtonProps={{ style: { backgroundColor: '#664545' } }}
            cancelButtonProps={{ style: { color: '#664545', borderColor: '#664545' } }}
          >
            <DeleteOutlined style={{ cursor: 'pointer', color: 'red' }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="p-3 flex justify-between items-end">
        <h1 className="text-[x-large] font-bold text-[#664545]">Quản lý sản phẩm</h1>
        <AddProductModal fetchProducts={fetchCakes} />
      </div>

      {/* Tìm kiếm */}
      <div className="mb-4 flex justify-end">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 250 }}
        />
      </div>

      {/* Bảng sản phẩm */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        pagination={{ pageSize: 8 }}
        scroll={{ x: true }}
      />

      {/* Modal Update */}
      <UpdateProductModal
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        fetchProducts={fetchCakes}
      />
    </div>
  );
};

export default AdminProduct;
