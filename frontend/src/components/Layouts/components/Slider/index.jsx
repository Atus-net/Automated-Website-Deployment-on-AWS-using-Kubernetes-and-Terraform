import { useEffect, useState, useRef } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import cake4 from '~/assets/images/Slidecake/cake4.jpg';
import cake5 from '~/assets/images/Slidecake/cake5.jpg';
import cake6 from '~/assets/images/Slidecake/cake6.jpg';
import cake7 from '~/assets/images/Slidecake/cake7.png';

function Slider() {
  const sliders = [
    {
      image: cake4,
      heading: 'Mang đến niềm hạnh phúc qua từng chiếc bánh kem',
      text: 'Liên hệ với chúng tôi để đặt bánh hoặc tìm hiểu thêm về thực đơn phong phú của chúng tôi. Chúng tôi sẵn sàng giúp bạn tạo nên những kỷ niệm ngọt ngào đáng nhớ.',
      buttonText: 'Khám Phá Thực Đơn',
      path: '/category?mode=cookie'
    },
    {
      image: cake5,
      heading: 'Trải nghiệm sự kỳ diệu từ những chiếc bánh tươi mới',
      text: 'Những chiếc bánh của chúng tôi được làm từ những nguyên liệu tốt nhất để mang đến cho bạn một trải nghiệm khó quên.',
      buttonText: 'Đặt Hàng Ngay',
      path: '/category?mode=bread'
    },
    {
      image: cake6,
      heading: 'Thưởng thức sự ngọt ngào qua từng miếng bánh',
      text: 'Mỗi miếng bánh được làm bằng tình yêu và sự tận tâm để biến khoảnh khắc của bạn trở nên đặc biệt.',
      buttonText: 'Xem Thực Đơn',
      path: '/category?mode=birthday'
    },
    {
      image: cake7,
      heading: 'Hãy để những chiếc bánh mì làm ngọt ngào từng phút giây',
      text: 'Hoàn hảo cho sinh nhật, kỷ niệm hoặc chỉ đơn giản là một ngày bình thường – bánh mì của chúng tôi sẽ làm cho mọi khoảnh khắc trở nên ngọt ngào hơn.',
      buttonText: 'Mua Ngay',
      path: '/category?mode=tradition'
    },
  ];

  const [slider, setSlider] = useState(0);
  const sliderRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slider]);

  const prevSlide = () => {
    setSlider(slider === 0 ? sliders.length - 1 : slider - 1);
  };

  const nextSlide = () => {
    setSlider(slider === sliders.length - 1 ? 0 : slider + 1);
  };

  const goToSlide = (index) => {
    setSlider(index);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX || e.touches[0].pageX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.pageX || e.touches[0].pageX;
    const diff = currentX - startX;

    if (diff > 50) {
      prevSlide();
      setIsDragging(false);
    } else if (diff < -50) {
      nextSlide();
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div
      className="slider relative mt-16 w-full"
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Image */}
      <div
        style={{ backgroundImage: `url(${sliders[slider].image})` }}
        className="relative w-full bg-cover bg-center pt-[65%] sm:pt-[50%] md:pt-[40%] lg:pt-[30%] duration-500"
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Text Content */}
      <div className="absolute left-1/2 top-[60%] w-[90%] max-w-[800px] -translate-x-1/2 -translate-y-1/2 space-y-3 text-center text-slate-100 sm:top-[55%] md:top-[50%] lg:top-[45%]">
        <h2 className="text-base font-bold sm:text-lg md:text-2xl lg:text-4xl">{sliders[slider].heading}</h2>
        <p className="mx-auto w-[90%] text-xs font-medium sm:text-sm md:text-base lg:text-lg line-clamp-3">
          {sliders[slider].text}
        </p>
        <button
          onClick={() => handleNavigate(sliders[slider].path)}
          className="rounded-md bg-slate-200 px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white sm:text-sm md:text-base lg:text-lg"
        >
          {sliders[slider].buttonText}
        </button>
      </div>

      {/* Left Arrow */}
      <div
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-2 text-white md:block"
        onClick={prevSlide}
      >
        <BsChevronCompactLeft size={28} />
      </div>

      {/* Right Arrow */}
      <div
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-2 text-white md:block"
        onClick={nextSlide}
      >
        <BsChevronCompactRight size={28} />
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
        {sliders.map((_, index) => (
          <div
            key={index}
            className={`cursor-pointer text-xl sm:text-2xl ${
              index === slider ? 'text-yellow-400' : 'text-white'
            }`}
            onClick={() => goToSlide(index)}
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Slider;
