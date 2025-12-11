import newsfeed10 from '~/assets/images/newsfeed10.png';
import { Link } from 'react-router-dom';

function Newsfeed7() {
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
            Valentine Ngọt Ngào - Giảm Giá 50% Mừng Lễ Tình Nhân!
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
              <p>{handleDate('2025-02-01')}</p>
            </div>
          </div>
          <hr className="mx-auto my-5 h-[2px] w-full border border-t-2 border-gray-400 bg-gray-400 sm:w-[850px]" />
          <div class="text-black">
            <h2 class="mb-4 text-center text-2xl font-bold text-red-500">
              💝 Món Quà Ngọt Ngào Cho Ngày Valentine - Giảm Giá 50%! 💝
            </h2>
            <img
              src={newsfeed10}
              alt="Valentine - big sales"
              width="600px"
              class="mx-auto my-5 block w-full max-w-[600px]"
            />
            <p class="text-center text-lg">
              💌 Valentine này, gửi trọn yêu thương cùng những chiếc bánh ngọt ngào từ Dolciluxe!
            </p>

            <p class="mt-4">
              Ngày 14/02 - ngày của tình yêu, hãy dành tặng cho người thương những chiếc bánh thơm ngon như một lời yêu
              thương ngọt ngào. Dolciluxe hân hạnh mang đến chương trình ưu đãi hấp dẫn:
            </p>

            <div class="mt-6 rounded-lg bg-pink-100 p-4">
              <h3 class="text-center text-xl font-semibold text-pink-600">🎁 ƯU ĐÃI ĐẶC BIỆT - GIẢM GIÁ 50% 🎁</h3>
              <ul class="mt-3 space-y-2">
                <li>
                  💘 <span class="font-semibold">Giảm ngay 50%</span> cho tất cả sản phẩm bánh Valentine.
                </li>
                <li>
                  💘 Tặng kèm <span class="font-semibold">thiệp chúc mừng</span> miễn phí cho mỗi đơn hàng.
                </li>
                <li>
                  💘 Cơ hội nhận <span class="font-semibold">bánh mini miễn phí</span> cho hóa đơn từ 300.000đ.
                </li>
              </ul>
            </div>

            <p class="mt-6 text-center text-lg font-semibold">
              🎀 Đừng bỏ lỡ cơ hội thể hiện tình cảm với nửa kia của bạn bằng những chiếc bánh tình yêu từ Dolciluxe!
            </p>

            <div class="mt-6 text-center">
              <p class="text-lg font-semibold">
                📅 Thời gian: <span class="text-red-600">Từ 10/02 - 14/02</span>
              </p>
              <p class="text-lg font-semibold">
                📍 Địa điểm: <span class="text-red-600">Tất cả cửa hàng Dolciluxe & đặt hàng online</span>
              </p>
            </div>

            <p class="mt-6 text-center text-xl font-bold text-red-500">
              ❤️ Hãy để Dolciluxe cùng bạn tạo nên những khoảnh khắc ngọt ngào trong mùa Valentine này! ❤️{' '}
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
                <Link to="/news?mode=news8"> Dolciluxe - Tưng bừng khai trương chi nhánh Võ Văn Ngân.</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Newsfeed7;
