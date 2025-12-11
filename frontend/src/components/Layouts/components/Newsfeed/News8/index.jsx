import newsfeed7 from '~/assets/images/newsfeed7.png';
import { Link } from 'react-router-dom';

function Newsfeed8() {
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
            Dolciluxe - Tưng bừng khai trương chi nhánh Võ Văn Ngân.
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
              <p>{handleDate('2025-03-06')}</p>
            </div>
          </div>
          <hr className="mx-auto my-5 h-[2px] w-full border border-t-2 border-gray-400 bg-gray-400 sm:w-[850px]" />
          <div class="text-black">
            <h2 class="mb-4 text-center text-2xl font-bold text-red-600">
              🎉 Dolciluxe - Tưng Bừng Khai Trương Chi Nhánh Võ Văn Ngân! 🎉
            </h2>
            <p class="text-center text-lg">
              📍 <span class="font-semibold">Địa điểm mới - Trải nghiệm mới!</span>
            </p>
            <p class="mt-4">
              Chúng tôi vui mừng thông báo sự kiện{' '}
              <span class="font-semibold">khai trương chi nhánh mới tại Võ Văn Ngân</span>, đánh dấu một bước phát triển
              quan trọng trong hành trình mang đến những chiếc bánh thơm ngon và chất lượng nhất đến gần hơn với khách
              hàng.
            </p>
            <img
              src={newsfeed7}
              alt="Khai trương chi nhánh Võ Văn Ngân"
              width="600px"
              class="mx-auto my-5 block w-full max-w-[600px]"
            />
            <div class="mt-6 rounded-lg bg-yellow-100 p-4">
              <h3 class="text-center text-xl font-semibold text-yellow-700">💖 Sự Kiện Đặc Biệt - Ưu Đãi Hấp Dẫn 💖</h3>
              <ul class="mt-3 space-y-2">
                <li>
                  ✅ <span class="font-semibold">Giảm giá 20%</span> cho tất cả các loại bánh trong 3 ngày đầu tiên.
                </li>
                <li>
                  ✅ <span class="font-semibold">Tặng ngay 1 phần bánh miễn phí</span> cho 100 khách hàng đầu tiên.
                </li>
                <li>
                  ✅ Cơ hội tham gia <span class="font-semibold">bốc thăm trúng thưởng</span> với nhiều phần quà hấp
                  dẫn.
                </li>
              </ul>
            </div>

            <p class="mt-6 text-center text-lg font-semibold">
              🎈 Đừng bỏ lỡ cơ hội trải nghiệm không gian mới, hương vị mới và những ưu đãi tuyệt vời từ Dolciluxe!
            </p>

            <div class="mt-6 text-center">
              <p class="text-lg font-semibold">
                📅 Thời gian: <span class="text-blue-600">9 giờ - ngày 17/03/2025</span>
              </p>
              <p class="text-lg font-semibold">
                📍 Địa điểm:{' '}
                <span class="text-blue-600">123 Đường Võ Văn Ngân, Phường Bình Thọ, TP. Thủ Đức, TP. Hồ Chí Minh</span>
              </p>
            </div>

            <p class="mt-6 text-center text-xl font-bold text-red-500">
              📌 Hãy đến và cùng chúng tôi tạo nên những khoảnh khắc ngọt ngào nhé! ❤️🎂
            </p>
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Newsfeed8;
