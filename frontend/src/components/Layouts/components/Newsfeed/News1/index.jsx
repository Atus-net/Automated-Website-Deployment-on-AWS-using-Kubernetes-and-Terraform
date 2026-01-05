import newsfeed8 from '~/assets/images/newsfeed8.png';
import { Link } from 'react-router-dom';

function Newsfeed1() {
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
    <div className="mx-4 my-24 items-center text-black sm:mx-10 lg:mx-28">
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
            Dolciluxe Thông Báo Lịch Nghỉ Tết Nguyên Đán 2024.
          </h1>
          <div className="inline-flex space-x-4 sm:space-x-8">
            <div className="flex items-center">
              <img
                src="./src/assets/images/Circle Avatar.svg"
                alt=""
                className="mr-1 inline-flex h-6 w-6 sm:h-8 sm:w-8"
              />
              <span>Dolciluxe</span>
            </div>
            <div className="flex items-center">
              <img src="./src/assets/images/calendar.svg" alt="" className="mr-1 inline-flex h-6 w-6 sm:h-8 sm:w-8" />
              <p>{handleDate('2025-01-05')}</p>
            </div>
          </div>
          <hr className="mx-auto my-5 h-[2px] w-full border border-t-2 border-gray-400 bg-gray-400 sm:w-[850px]" />
          <div className="text-center text-black">
            <div className="my-5">Dolciluxe: Thông Báo Lịch Nghỉ Tết Nguyên Đán 2025.</div>
            <div>Kính Chúc Quý Khách Hàng Năm Mới An Khang Và Thịnh Vượng.</div>
            <div> Cảm Ơn Quý Khách Hàng Đã Luôn Ủng Hộ Dolciluxe và đồng hành trong suốt thời gian vừa qua.</div>
            <img src={newsfeed8} alt="" className="mx-auto my-5 block w-full max-w-[600px]" />
          </div>
          <div>
            <h1 className="font-inter mb-10 mb-3 mt-5 text-left text-2xl font-extrabold leading-none text-black sm:text-3xl lg:text-4xl">
              CÁC BÀI VIẾT LIÊN QUAN
            </h1>
            <ul className="ml-4 list-disc sm:ml-10">
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
                  Bầu trời châu âu được ra mắt hoành tráng với sự kết hợp đa văn hòa từ nhà Dolciluxe.
                </Link>
              </li>
              <li className="hover:text-slate-900 hover:underline">
                <Link to="/news?mode=news6">
                  {' '}
                  Dolciluxe - Đặt bánh teabreak cho sự kiện, hội thảo, hội nghị... Tại TP.Hồ Chí Minh.
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

export default Newsfeed1;
