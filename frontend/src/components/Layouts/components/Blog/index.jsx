import tessaCake from '~/assets/images/CakeBestSeller/tessacake.png';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import newsfeed7 from '~/assets/images/newsfeed7.png';
import newsfeed10 from '~/assets/images/newsfeed10.png';
import newsfeed8 from '~/assets/images/newsfeed8.png';
// import newsfeed12 from '~/assets/images/newsfeed12.png';

function Blog() {
  const handleDate = (field) => {
    const date = new Date(field);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return formattedDate;
  };

  // Danh sách newsfeed đã có, chỉ cần lấy 3 bài đầu tiên
  const newsfeed = [
    {
      id: 'news8',
      author: 'Dolciluxe',
      date: '2025-02-01',
      title: 'Dolciluxe - Tưng Bừng Khai Trương Chi Nhánh...',
      desc: 'Dolciluxe xin chân thành cảm ơn sự quan tâm và ủng hộ từ quý khách hàng...',
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
    // {
    //   id: 'news12',
    //   title: 'Hương vị trời Tây - Dolciluxe mang đến một trải nghiệm vị giác mới lạ',
    //   desc: 'Những chiếc bánh mang phong cách phương tây sắp được...',
    //   date: '2025-04-05',
    //   author: 'Thiên Phúc',
    //   image: newsfeed12,
    // }
  ];

  return (
    <div className="Hot-event pb-[20rem] pt-4">
      <h1 className="text-center text-3xl font-bold text-primary lg:text-5xl">Sự kiện nổi bật</h1>
      <div className="Our-product lg:grid-custom-3 md:grid-custom-2 grid-custom-1 relative grid w-full justify-center gap-16 lg:gap-24">
        {newsfeed.slice(0, 4).map((blog, index) => (
          <div className="img-scale my-10 h-[400px] w-[340px]" key={index}>
            <Link to={`/news?mode=${blog.id}`}>
              <img
                src={blog.image}
                alt={blog.title}
                width="100%"
                height="100%"
                className="h-auto w-full rounded-t-xl"
              />
            </Link>
            <div className="rounded-b-xl bg-slate-100">
              <div className="mx-6 flex h-[200px] flex-col justify-between py-5">
                <div className="flex items-center">
                  <div className="flex gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="24px"
                      height="24px"
                      viewBox="0 0 48 48"
                    >
                      <path d="M 24 4 C 12.972066 4 4 12.972074 4 24 C 4 35.027926 12.972066 44 24 44 C 35.027934 44 44 35.027926 44 24 C 44 12.972074 35.027934 4 24 4 z M 24 7 C 33.406615 7 41 14.593391 41 24 C 41 33.406609 33.406615 41 24 41 C 14.593385 41 7 33.406609 7 24 C 7 14.593391 14.593385 7 24 7 z M 24 12 C 22.125 12 20.528815 12.757133 19.503906 13.910156 C 18.478997 15.063179 18 16.541667 18 18 C 18 19.458333 18.478997 20.936821 19.503906 22.089844 C 20.528815 23.242867 22.125 24 24 24 C 25.875 24 27.471185 23.242867 28.496094 22.089844 C 29.521003 20.936821 30 19.458333 30 18 C 30 16.541667 29.521003 15.063179 28.496094 13.910156 C 27.471185 12.757133 25.875 12 24 12 z M 24 15 C 25.124999 15 25.778816 15.367867 26.253906 15.902344 C 26.728997 16.436821 27 17.208333 27 18 C 27 18.791667 26.728997 19.563179 26.253906 20.097656 C 25.778816 20.632133 25.124999 21 24 21 C 22.875001 21 22.221184 20.632133 21.746094 20.097656 C 21.271003 19.563179 21 18.791667 21 18 C 21 17.208333 21.271003 16.436821 21.746094 15.902344 C 22.221184 15.367867 22.875001 15 24 15 z M 17.259766 26 C 15.478261 26 14 27.477066 14 29.259766 L 14 30.341797 C 14 32.32976 15.256514 34.057405 17.046875 35.199219 C 18.837236 36.341033 21.229275 37.001953 24 37.001953 C 26.770725 37.001953 29.162764 36.341033 30.953125 35.199219 C 32.743486 34.057405 34 32.32976 34 30.341797 L 34 29.259766 C 34 27.478261 32.522934 26 30.740234 26 L 17.259766 26 z M 17.259766 29 L 30.740234 29 C 30.901535 29 31 29.09927 31 29.259766 L 31 30.341797 C 31 31.053834 30.535733 31.907236 29.339844 32.669922 C 28.143954 33.432608 26.284275 34.001953 24 34.001953 C 21.715725 34.001953 19.856046 33.432608 18.660156 32.669922 C 17.464267 31.907236 17 31.053834 17 30.341797 L 17 29.259766 C 17 29.098465 17.09927 29 17.259766 29 z"></path>
                    </svg>
                    <span className="text-sm font-medium">{blog.author}</span>
                  </div>
                  <hr className="mx-4 w-[24px] border border-gray-400" />
                  <p>{handleDate(blog.date)}</p>
                </div>
                <Link className="line-clamp-2 text-xl font-semibold leading-6" to={`/news?mode=${blog.id}`}>
                  {blog.title}
                </Link>
                <p className="line-clamp-3 text-lg font-normal leading-6">{blog.desc}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute left-5 top-[50%] hidden -translate-x-0 translate-y-[50%] cursor-pointer rounded-full bg-black/20 p-2 text-2xl text-white">
          <BsChevronCompactLeft size={30} />
        </div>
        <div className="absolute right-5 top-[50%] hidden -translate-x-0 translate-y-[50%] cursor-pointer rounded-full bg-black/20 p-2 text-2xl text-white">
          <BsChevronCompactRight size={30} />
        </div>
      </div>
    </div>
  );
}

export default Blog;
