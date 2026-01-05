import { useState, useEffect } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Pagination } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '../Card';
import useCake from '~/hooks/useCake';
import usePagination from '~/hooks/usePagination';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#CDB0A9',
    },
  },
});

function Categories() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const { cakes = [], categoryName } = useCake(mode || 'default');
  const [sortOption, setSortOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { list } = useSelector((state) => state.cart);

  // Lọc theo tên sản phẩm
  const filteredCakes = cakes.filter((cake) => cake.productName.toLowerCase().includes(searchTerm.toLowerCase()));

  // Sắp xếp theo giá
  const sortedCakes = [...filteredCakes].sort((a, b) => {
    if (sortOption === 'Giá từ thấp đến cao') {
      return a.price - b.price;
    } else if (sortOption === 'Giá từ cao đến thấp') {
      return b.price - a.price;
    }
    return 0;
  });

  // Phân trang
  const sortedCakesPerPage = usePagination(sortedCakes);

  // Đặt lại trang hiện tại về 1 khi searchTerm hoặc sortOption thay đổi
  useEffect(() => {
    sortedCakesPerPage.jump(1); // Reset to the first page
  }, [searchTerm, sortOption]);

  return (
    <div className="mt-16 w-full bg-white">
    <div className="w-full">
    {/* Đường dẫn breadcrumb */}
    {/* <div className="ml-4 sm:ml-8 lg:ml-16 flex h-11 items-center pt-[43px] text-primary">
      <div>
        <a href="/">Trang chủ </a>
        <span>&gt;&gt;</span>
        <a href="/category"> Menu Bánh </a>
        {categoryName !== 'Tất cả sản phẩm' && (
          <>
            <span>&gt;&gt;</span>
            <NavLink to="/" className="capitalize">
              {' '}
              {categoryName}{' '}
            </NavLink>
          </>
        )}
      </div> */}
    </div>
    <br></br>
    {/* Tiêu đề */}
    <h1 className="text-center text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold md:font-bold capitalize leading-snug md:leading-[72px]">
      {categoryName}
    </h1>
    <br></br>

    <div className="mx-4 mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">
      <input
        type="text"
        placeholder="Tìm theo tên bánh..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-[250px] md:w-[300px] px-4 py-3 rounded-lg border border-gray-300 text-sm bg-gradient-to-r from-white to-[#e7e1e1] focus:outline-none focus:ring-2 focus:ring-primary transition-all"
      />
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="w-full sm:w-[200px] px-4 py-3 rounded-lg border border-gray-300 text-sm bg-gradient-to-r from-[#e7e1e1] to-white hover:bg-[#f5f5f5] transition-all cursor-pointer"
      >
        <option value="">Chọn bộ lọc</option>
        <option value="Giá từ thấp đến cao">Giá từ thấp đến cao</option>
        <option value="Giá từ cao đến thấp">Giá từ cao đến thấp</option>
      </select>
    </div>

    {/* Danh sách bánh */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {sortedCakesPerPage.currentData().map((cake, index) => (
        <div key={index} className="flex justify-center">
          <Card
            id={cake._id}
            image_link={cake.imageLink}
            description={cake.description}
            product_name={cake.productName}
            categoryName={categoryName}
            price={cake.price}
            cake={cake}
          />
        </div>
      ))}
    </div>

    {/* Phân trang */}
    <div className="flex items-center justify-center py-4">
      <ThemeProvider theme={theme}>
        <Pagination
          count={sortedCakesPerPage.maxPage}
          size="large"
          page={sortedCakesPerPage.currentPage}
          color="secondary"
          onChange={(e, value) => sortedCakesPerPage.jump(value)}
        />
      </ThemeProvider>
    </div>
  </div>
  );
}

export default Categories;
