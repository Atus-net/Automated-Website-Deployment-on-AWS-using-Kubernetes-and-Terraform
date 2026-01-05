import tessaCake from '~/assets/images/CakeBestSeller/tessacake.png';
import useCake from '~/hooks/useCake';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Card from '../Card';
import { FaLongArrowAltRight } from 'react-icons/fa';

function Seller({ params }) {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 600 },
      items: 2,
      slidesToSlide: 1,
      partialVisibilityGutter: 30, // Reduced gutter for tablets
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
      slidesToSlide: 1,
      partialVisibilityGutter: 15, // Minimal gutter for mobile
    },
  };
  
  const { cakes, categoryName } = useCake(params);
  return (
    <div className="best-seller w-full">
      {/* Heading Section - Responsive adjustments */}
      <div className="mx-4 my-6 flex flex-col items-center text-primary sm:mx-6 md:mx-8 lg:mx-28 lg:my-20 lg:flex-row">
        <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-3xl lg:basis-1/2 lg:text-4xl">Sản phẩm bán chạy...</h1>
        <div className="my-1 h-1 w-20 border-b-2 border-primary sm:w-24 md:w-28 lg:my-0 lg:rotate-90 lg:pr-8"></div>
        <p className="text-sm font-medium sm:text-base lg:basis-1/2 lg:text-lg">
          Chúng tôi tự hào giới thiệu những tác phẩm được yêu thích nhất của mình, được mọi người trên toàn thế giới yêu
          mến. Sự nhẹ nhàng và ngọt ngào tuyệt hảo của những chiếc bánh của chúng tôi sẽ khiến bạn không thể cưỡng lại
          được. Hãy khám phá các loại bánh, bánh mì và những món ngon khác mà chúng tôi mang đến.
        </p>
      </div>

      {/* Carousel Section - Responsive adjustments */}
      <div className="Our-product mx-auto w-full overflow-hidden">
      <Carousel
        responsive={responsive}
        additionalTransfrom={0}
        arrows
        centerMode={false}
        className="px-3 py-2 sm:px-4 md:px-6 lg:px-11 lg:py-4"
        containerClass="container-with-dots"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        swipeable
        itemClass="react-multi-carousel-item px-2 sm:px-2 md:px-3 lg:px-4" // Điều chỉnh padding giữa các card
      >
        {cakes.map((cake, index) => (
          <div className="transform transition duration-300 hover:scale-[1.02]" key={index}>
            <Card
              image_link={cake.imageLink}
              product_name={cake.productName}
              description={cake.description}
              id={cake._id}
              price={cake.price}
              categoryName={categoryName}
              cake={cake}
            />
          </div>
        ))}
      </Carousel>

      </div>

      {/* Introduction Section - Responsive adjustments */}
      <div className="Introduce mx-4 my-6 sm:mx-6 md:mx-8 lg:mx-24 lg:my-10 lg:flex">
        <img
          src={tessaCake}
          alt="Tessa Cake"
          width="100%"
          height="100%"
          className="mx-auto h-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px] rounded-br-[3rem] rounded-tl-[3rem] sm:rounded-br-[4rem] sm:rounded-tl-[4rem] lg:rounded-br-[5rem] lg:rounded-tl-[5rem] shadow-xl lg:shadow-2xl lg:max-w-[500px]"
        />
        <div className="my-6 justify-center gap-2 text-primary sm:gap-3 lg:my-0 lg:ml-20 lg:flex lg:flex-col lg:gap-4">
          <h2 className="text-xl font-bold sm:text-2xl md:text-2xl lg:text-4xl">
            Những món bánh nướng vừa ra lò, được làm riêng dành cho bạn.
          </h2>
          <p className="ml-2 text-base font-normal sm:ml-3 md:ml-4 md:text-lg lg:text-xl">
            Chúng tôi làm ra những món bánh thơm ngon từ những nguyên liệu hảo hạng nhất. Từ những chiếc bánh quy sô cô
            la ấm áp đến những chiếc bánh sừng bò giòn tan, mỗi miếng bánh đều tràn đầy sự ấm áp và hương vị. Hãy đến và
            trải nghiệm sự kỳ diệu tại tiệm bánh của chúng tôi.
          </p>
          <a href="/category" className="ml-2 flex items-center gap-1 sm:ml-3 md:ml-4 md:gap-2 text-sm sm:text-base">
            <span>Xem thêm</span>
            <FaLongArrowAltRight className="translate-y-1/6" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Seller;