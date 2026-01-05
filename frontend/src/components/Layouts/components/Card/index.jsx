import { Card as AntdCard, Rate, Button, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, StarFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AddToCartContext } from '~/components/Layouts/DefaultLayout';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCartItem, fetchCart } from '~/redux/cartSlice';

const { Meta } = AntdCard;

function Card({ image_link, product_name, description, price, index, id, categoryName, cake }) {
  const { triggerSuccessPopup } = useContext(AddToCartContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login.currentUser);

  const handleAddToCart = async (cake) => {
    if (!user) {
      navigate('/auth?mode=signin');
      return;
    }

    try {
      await dispatch(
        addCartItem({
          productId: cake._id,
          quantity: 1
        })
      ).unwrap();
      await dispatch(fetchCart()).unwrap();
      triggerSuccessPopup();
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      message.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  return (
    <AntdCard
      key={index}
      hoverable
      className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px] mx-auto transform transition-transform duration-300"
      style={{
        transform: 'scale(0.9)',
      }}
      cover={
        <Link to={`/detailed/${id}`} state={{ categoryName }}>
          <img
            alt={product_name}
            src={image_link}
            className="h-[200px] sm:h-[250px] md:h-[300px] object-cover rounded-t-lg w-full"
          />
        </Link>
      }
    >
      <Meta
        title={
          <span className="text-base md:text-lg lg:text-xl">
            {product_name}
          </span>
        }
        description={
          <>
            <Rate
              disabled
              defaultValue={5}
              character={<StarFilled />}
              className="text-sm md:text-base"
            />
            <p className="line-clamp-2 text-sm md:text-base">
              {description}
            </p>
            <span className="text-primary font-bold text-sm md:text-base lg:text-lg block mb-2">
              Giá: {Number(price).toLocaleString('vi-VN')}₫
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to={`/detailed/${id}`} state={{ categoryName }} className="w-full sm:w-auto">
                <Button type="text" icon={<EyeOutlined />} className="w-full sm:w-auto">
                  Xem chi tiết
                </Button>
              </Link>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => handleAddToCart(cake)}
                className="w-full sm:w-auto"
              >
                Thêm vào giỏ
              </Button>
            </div>
          </>
        }
      />
    </AntdCard>

  );
}

export default Card;



