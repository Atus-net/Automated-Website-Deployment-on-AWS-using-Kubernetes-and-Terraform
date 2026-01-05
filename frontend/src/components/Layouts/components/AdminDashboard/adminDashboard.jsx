import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import {
  PieChart,
  Pie,
  Tooltip as ReTooltip,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { getOrders } from '~/api/apiOrder';
import { getAllCakes } from '~/api/apiCakes';
import { getListUsers } from '~/api/apiUser';

const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#00C49F'];

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [roleChartData, setRoleChartData] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);
  const [orderStatusChartData, setOrderStatusChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, productRes, userRes] = await Promise.all([getOrders(), getAllCakes(), getListUsers()]);

        const orders = orderRes.data;
        const products = productRes.data;
        const users = userRes.data;

        setOrders(orders);
        setProducts(products);
        setUsers(users);

        // Thống kê trạng thái đơn hàng
        const statusData = orders.reduce((acc, order) => {
          acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
          return acc;
        }, {});
        const orderStatusChart = Object.entries(statusData).map(([name, value]) => ({
          name,
          value,
        }));
        setOrderStatusChartData(orderStatusChart);

        // Thống kê trạng thái thanh toán
        const paidCount = orders.filter((o) => o.paymentStatus === 'paid').length;
        const pendingCount = orders.length - paidCount;
        setOrderStatusData([
          { name: 'Đã thanh toán', value: paidCount },
          { name: 'Chưa thanh toán', value: pendingCount },
        ]);

        // Thống kê doanh thu theo tháng
        const monthlyRevenueMap = {};
        orders.forEach((order) => {
          if (order.paymentStatus === 'paid') {
            const month = new Date(order.createdAt).toLocaleString('vi-VN', { month: 'short', year: 'numeric' });
            monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + order.totalPrice;
          }
        });
        const revenueData = Object.entries(monthlyRevenueMap).map(([month, total]) => ({
          month,
          total,
        }));
        setMonthlyRevenue(revenueData.sort((a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`)));

        // Phân quyền người dùng
        const roleCount = users.reduce(
          (acc, user) => {
            user.isAdmin ? acc.admin++ : acc.user++;
            return acc;
          },
          { admin: 0, user: 0 },
        );
        setRoleChartData([
          { name: 'Admin', value: roleCount.admin },
          { name: 'User', value: roleCount.user },
        ]);

        // Trạng thái hoạt động người dùng
        const statusCount = users.reduce(
          (acc, user) => {
            user.isActive ? acc.active++ : acc.inactive++;
            return acc;
          },
          { active: 0, inactive: 0 },
        );
        setStatusChartData([
          { name: 'Đang hoạt động', value: statusCount.active },
          { name: 'Vô hiệu hóa', value: statusCount.inactive },
        ]);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-[x-large] font-bold text-[#664545]">Thống kê</h1>
      <Row gutter={24}>
        <Col span={8}>
          <Card title="Tổng số đơn hàng" bordered>
            <p style={{ fontSize: 24 }}>{orders.length}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tổng số sản phẩm" bordered>
            <p style={{ fontSize: 24 }}>{products.length}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tổng số người dùng" bordered>
            <p style={{ fontSize: 24 }}>{users.length}</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} className="mt-6">
        <Col span={12}>
          <Card title="Doanh thu theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Bar dataKey="total" fill="#82ca9d" name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} className="mt-6">
        <Col span={12}>
          <Card title="Tỷ lệ trạng thái đơn hàng">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {orderStatusChartData.map((entry, index) => (
                    <Cell key={`orderstatus-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Tỷ lệ trạng thái thanh toán">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`status-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} className="mt-6">
        <Col span={12}>
          <Card title="Phân quyền người dùng (User / Admin)">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={roleChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {roleChartData.map((entry, index) => (
                    <Cell key={`role-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Trạng thái hoạt động người dùng">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`status-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
