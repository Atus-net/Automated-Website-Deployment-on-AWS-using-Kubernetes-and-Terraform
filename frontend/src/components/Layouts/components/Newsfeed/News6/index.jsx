import { Link } from 'react-router-dom';

function Newsfeed6() {
  const handleDate = (field) => {
    const date = new Date(field);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return formattedDate;
  };
  return (
    <div className="mx-4 my-28 items-center text-black text-primary sm:mx-10 lg:mx-28">
      <div>
        <a href="/">Trang chủ </a>
        <span>&gt;&gt;</span>
        <a href="/news"> Tin tức </a>
        <span>&gt;&gt;</span>
        <span> Nội dung</span>
      </div>
      <div className="flex justify-center text-lg">
        <div className="font-inter my-5 flex h-auto max-w-[900px] flex-col space-y-2 overflow-hidden break-words rounded-xl border-2 bg-[#E8E1E1] px-5 py-5">
          <h1 className="font-inter mb-10 text-center text-2xl font-extrabold leading-none text-black sm:text-3xl lg:text-4xl">
            Dolciluxe - Đặt bánh teabreak cho sự kiện, hội thảo, hội nghị... Tại TP.Hồ Chí Minh.
          </h1>
          <div className="inline-flex space-x-4 sm:space-x-8">
            <div className="flex items-center">
              <img
                src="./src/assets/images/Circle Avatar.svg"
                alt=""
                className="mr-1 inline-flex h-6 w-6 sm:h-8 sm:w-8"
              />
              <span>Gia Mẫn</span>
            </div>
            <div className="flex items-center">
              <img src="./src/assets/images/calendar.svg" alt="" className="mr-1 inline-flex h-6 w-6 sm:h-8 sm:w-8" />
              <p>{handleDate('2024-04-12')}</p>
            </div>
          </div>
          <hr className="mx-auto my-5 h-[2px] w-full border border-t-2 border-gray-400 bg-gray-400 sm:w-[850px]" />
          <div className="text-black">
            <div className="my-5 font-bold">
              Dolciluxe cung cấp: Bánh sinh nhật, bánh minicake, bánh sự kiện, tiệc buffet bánh ngọt, tiệc bánh ngọt khai
              trương, bánh coockies,... liên hệ hotline để được tư vấn: 0912476521
            </div>
            <div>
              Tiệc teabreak là loại tiệc nhẹ thường được phục vụ trong các buổi họp, hội thảo, hội nghị hoặc sự kiện
              ngắn. Tiệc này tạo ra không gian thoải mái để khách mời thư giãn, giao lưu trong thời gian nghỉ giải lao.
              Tiệc teabreak được tổ chức với rất nhiều những loại bánh ngọt, trà, nước trái cây và hoa quả tươi.{' '}
            </div>
            <img
              src="./src/assets/images/newsfeed13.png"
              alt=""
              width="600px"
              className="mx-auto my-5 block w-full max-w-[600px]"
            />
            <div className="my-5">
              Nếu bạn cần tìm những loại bánh ngọt phù hợp cho tiệc teabreak tại công ty hay sự kiện khai trương cửa
              hàng,... Bạn là đơn vị tổ chức sự kiện. Bạn cần tham khảo những dòng bánh ngọt trong bữa tiệc sắp tới.
            </div>
            <div className="my-5">
              Dolciluxe xin gửi đến quý khách hàng thực đơn tiệc teabreak vô cùng đa dạng và phong phú. Mong quý khách
              hàng có thể lựa chọn những loại bánh phù hợp nhất cho mình.
            </div>
            <img
              src="./src/assets/images/mini_1.png"
              alt=""
              width="600px"
              className="mx-auto my-5 block w-full max-w-[600px]"
            />
            <img
              src="./src/assets/images/mini_2.png"
              alt=""
              width="600px"
              className="mx-auto my-5 block w-full max-w-[600px]"
            />
            <img
              src="./src/assets/images/mini_3.png"
              alt=""
              width="600px"
              className="mx-auto my-5 block w-full max-w-[600px]"
            />
            <img
              src="./src/assets/images/mini_4.png"
              alt=""
              width="600px"
              className="mx-auto my-5 block w-full max-w-[600px]"
            />
            <img
              src="./src/assets/images/mini_5.png"
              alt=""
              width="600px"
              className="mx-auto my-5 block w-full max-w-[600px]"
            />
            <img
              src="./src/assets/images/mini_6.png"
              alt=""
              width="600px"
              className="mx-auto my-5 block w-full max-w-[600px]"
            />
            <div className="my-5">
              Nhà Dolciluxe cung cấp đầy đủ các loại bánh như su kem, coockie, macaron, socola, tiramisu,...
            </div>
          </div>
          <div>
            <h1 className="font-inter mb-10 mb-3 mt-5 text-left text-2xl font-extrabold leading-none text-black sm:text-3xl lg:text-4xl">
              CÁC BÀI VIẾT LIÊN QUAN
            </h1>
            <ul className="ml-4 list-disc sm:ml-10">
              <li className="hover:text-slate-900 hover:underline">
                <Link to="/news?mode=news1">Dolciluxe Thông Báo Lịch Nghỉ Tết Nguyên Đán 2024.</Link>
              </li>
              <li className="hover:text-slate-900 hover:underline">
                <Link to="/news?mode=news2">Mẫu bánh kem mừng 20/11 ngày Nhà Giáo Việt Nam.</Link>
              </li>
              <li className="hover:text-slate-900 hover:underline">
                <Link to="/news?mode=news3">
                  Happy women day - 20/10 Dành tặng cho những đóa hoa hồng rực rỡ - rạng ngời - quý phái.
                </Link>
              </li>
              <li className="hover:text-slate-900 hover:underline">
                <Link to="/news?mode=news4">
                  Tưng bừng đắm chìm vào không gian huyền ảo cùng Passion Mousse Cheesecake.
                </Link>
              </li>
              <li className="hover:text-slate-900 hover:underline">
                <Link to="/news?mode=news5">
                  {' '}
                  Bầu trời châu âu được ra mắt hoành tráng với sự kết hợp đa văn hòa từ nhà Dolciluxe.
                </Link>
              </li>
              <li className="hover:text-slate-900 hover:underline">
                <Link to="/news?mode=news7"> Valentine Ngọt Ngào - Giảm Giá 50% Mừng Lễ Tình Nhân!</Link>
              </li>
              <li className="hover:text-slate-900 hover:underline">
                <Link to="/news?mode=news8"> Dolciluxe - Tưng bừng khai trương chi nhánh Võ Văn Ngân.</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Newsfeed6;
