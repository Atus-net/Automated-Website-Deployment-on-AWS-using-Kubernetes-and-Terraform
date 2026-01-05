import { Link } from 'react-router-dom';
import * as React from 'react';
import { useState } from 'react';
import { Pagination, Stack } from '@mui/material';
import newsfeed7 from '~/assets/images/newsfeed7.png';
import newsfeed8 from '~/assets/images/newsfeed8.png';
import newsfeed9 from '~/assets/images/newsfeed9.png';
import newsfeed10 from '~/assets/images/newsfeed10.png';
import newsfeed11 from '~/assets/images/newsfeed11.png';
import newsfeed12 from '~/assets/images/newsfeed12.png';
import newsfeed13 from '~/assets/images/newsfeed13.png';
import newsfeed14 from '~/assets/images/newsfeed14.png';

const newsItems = [
  {
    id: 'news8',
    title: 'Dolciluxe - Tưng Bừng Khai Trương Chi Nhánh...',
    desc: 'Dolciluxe xin chân thành cảm ơn sự quan tâm và ủng hộ từ quý khách hàng...',
    date: '2025-02-01',
    author: 'Dolciluxe',
    image: newsfeed7,
  },
  {
    id: 'news7',
    title: 'Valentine Ngọt Ngào - Giảm Giá 50% Mừng Lễ Tình Nh...',
    desc: 'Ngày 14/02 - ngày của tình nhân, hãy dành tặng cho người thương...',
    date: '2025-02-01',
    author: 'Gia Mẫn',
    image: newsfeed10,
  },
  {
    id: 'news1',
    title: 'Dolciluxe Thông Báo Lịch Nghỉ Tết Nguyên Đán...',
    desc: 'Dolciluxe: Thông Báo Lịch Nghỉ Tết Nguyên Đán 2025...',
    date: '2025-01-05',
    author: 'Dolciluxe',
    image: newsfeed8,
  },
  {
    id: 'news2',
    title: 'Mẫu bánh kem mừng 20/11 ngày Nhà Giáo...',
    desc: '"Không thầy đố mày làm nên" Ngày 20/11 là ngày lễ trọng đại...',
    date: '2024-11-02',
    author: 'Gia Mẫn',
    image: newsfeed9,
  },
  {
    id: 'news3',
    title: 'Happy women day - 20/10 Dành tặng cho những đóa hoa hồn...',
    desc: 'Happy women day - 20/10. Dành tặng cho những người phụ nữ tôi yêu...',
    date: '2024-10-01',
    author: 'Gia Mẫn',
    image: newsfeed14,
  },
  {
    id: 'news4',
    title: 'Tưng bừng đắm chìm vào không gian huyền ảo cùng...',
    desc: 'Bánh Passion Mousse Cheesecake là sự kết hợp tuyệt vời giữa vị chua ngọt...',
    date: '2024-07-29',
    author: 'Dolciluxe',
    image: newsfeed11,
  },
  {
    id: 'news5',
    title: 'Bầu trời châu âu được ra mắt hoành tráng với...',
    desc: 'Nhà Dolciluxe đã vô cùng tâm đắc và trau chuốt khi ra mắt bộ sưu tập mới...',
    date: '2024-04-12',
    author: 'Gia Mẫn',
    image: newsfeed12,
  },
  {
    id: 'news6',
    title: 'Dolciluxe - Đặt bánh teabreak cho sự kiện, hội thảo,...',
    desc: 'Dolciluxe cung cấp: Bánh sinh nhật, bánh minicake, bánh sự kiện...',
    date: '2024-01-03',
    author: 'Gia Mẫn',
    image: newsfeed13,
  },
];

function Newsfeed() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const handleChange = (event, value) => {
    setPage(value);
  };

  const totalPages = Math.ceil(newsItems.length / itemsPerPage);
  const paginatedItems = newsItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDate = (field) => {
    const date = new Date(field);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <div className="my-24 flex flex-col items-center justify-center px-7 text-black text-primary md:px-10 lg:px-28">
      {/* <div className="w-full text-left">
        <a href="/">Trang chủ </a>
        <span>&gt;&gt;</span>
        <a href="/news"> Tin tức </a>
      </div> */}
      <h1 className="font-inter mb-10 text-center text-4xl font-extrabold leading-none text-black">Tin tức</h1>

      <div className="grid w-full grid-cols-1 place-items-center items-stretch justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
        {paginatedItems.map((item) => (
          <div
            key={item.id}
            className="img-scale flex h-full w-full max-w-[354px] flex-col overflow-hidden rounded-xl border-2"
          >
            <Link to={`/news?mode=${item.id}`}>
              <img src={item.image} alt="" width="auto" />
            </Link>
            <div className="flex h-full flex-col justify-between bg-white pb-4 pt-2">
              <div className="mx-3">
                <div className="font-inter mt-3 flex items-center text-sm text-[#6D758F]">
                  <img src="./src/assets/images/Circle Avatar.svg" alt="" className="mr-1 inline-flex" />
                  <span>{item.author}</span>
                  <hr className="mx-4 mt-1 w-[24px] border border-gray-400" />
                  <img src="./src/assets/images/calendar.svg" alt="" className="mr-1 inline-flex" />
                  <p>{handleDate(item.date)}</p>
                </div>
                <Link to={`/news?mode=${item.id}`}>
                  <h2 className="mb-3 mt-3 min-h-[56px] text-xl font-bold text-[#6D758F] hover:text-slate-900">
                    {item.title}
                  </h2>
                </Link>
                <h3 className="mb-3 mt-3 min-h-[80px] text-base text-[#6D758F]">{item.desc}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Stack spacing={2} className="mt-6 items-center">
        <Pagination count={totalPages} page={page} onChange={handleChange} />
      </Stack>
    </div>
  );
}

export default Newsfeed;
