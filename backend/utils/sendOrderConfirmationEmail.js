const sendMail = require('./sendMail');
const Order = require('../models/order.model');

const sendOrderConfirmationEmail = async (orderId, transactionId) => {
    const order = await Order.findById(orderId)
        .populate({ path: 'user', select: 'name email' })
        .populate({ path: 'items.product', select: 'productName' })
        .populate({ path: 'address', select: 'fullName province district ward detail' })
    console.log(order)
    if (!order) throw new Error('Không tìm thấy đơn hàng');
    const customerName = order.user?.name || 'Quý khách';
    const toEmail = order.user?.email;
    const subject = 'Xác nhận đơn hàng - Đặt hàng thành công tại DolciLuxe';

    const orderDate = new Date(order.createdAt).toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
    });

    const shippingInfo = order.address;
    const shippingName = shippingInfo.fullName;
    const shippingAddress = `${shippingInfo.detail}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.province}`;

    const estimatedDeliveryDate = new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
    ).toLocaleDateString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
    });

    const storeName = 'DolciLuxe';
    const supportPhone = '0123 456 789';
    const storeWebsite = 'https://dolciluxe.vn';
    const storeAddress = '123 Đường Bánh Ngọt, Quận Kem, TP.HCM';
    const supportEmail = 'dolciluxevn@gmail.com';

    const totalPrice = Number(order.totalPrice).toLocaleString('vi-VN');
    const shippingFee = '0';

    const productRows = order.items.map((item) => {
        const name = item.product.productName;
        const quantity = item.quantity;
        const price = item.price.toLocaleString('vi-VN');
        const total = (item.quantity * item.price).toLocaleString('vi-VN');

        return `<tr>
        <td>${name}</td>
        <td>${quantity}</td>
        <td>${price} VND</td>
        <td>${total} VND</td>
      </tr>`;
    })
        .join('');

    const htmlContent = `
   <!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng</title>
    <style type="text/css">
        body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 1px solid #eeeeee;
        }
        .header h2 {
            color: #664545;
            margin-bottom: 0;
        }
        .order-info {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #dddddd;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .footer {
            font-size: 12px;
            color: #777777;
            text-align: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eeeeee;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Cảm ơn Quý khách đã đặt hàng tại ${storeName}</h2>
    </div>

    <p>Kính gửi <strong>${customerName}</strong>,</p>
    <p>Đơn hàng của Quý khách đã được thanh toán thành công qua VNPAY. Dưới đây là thông tin chi tiết:</p>

    <div class="order-info">
        <h3>Thông tin đơn hàng</h3>
        <ul style="padding-left: 20px; margin: 10px 0;">
            <li><strong>Mã đơn hàng:</strong> ${order._id}</li>
            <li><strong>Ngày đặt:</strong> ${orderDate}</li>
            <li><strong>Mã giao dịch VNPAY:</strong> ${transactionId}</li>
            <li><strong>Phí vận chuyển:</strong> ${shippingFee} VND</li>
            <li><strong>Tổng thanh toán:</strong> ${totalPrice} VND</li>
        </ul>
    </div>

    <h3>Sản phẩm</h3>
    <table>
        <thead>
            <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
            </tr>
        </thead>
        <tbody>
            ${productRows}
        </tbody>
    </table>

    <h3>Giao hàng tới</h3>
    <p><strong>${shippingName}</strong><br>
    ${shippingAddress}</p>
    <p><strong>Dự kiến giao hàng:</strong> ${estimatedDeliveryDate}</p>

    <p>Quý khách có thể theo dõi tình trạng đơn hàng tại website <a href="${storeWebsite}">${storeWebsite}</a> hoặc gọi tới hotline <strong>${supportPhone}</strong>.</p>

    <p style="margin-top: 30px;">Trân trọng,<br><strong>${storeName}</strong></p>

    <div class="footer">
        ${storeName} | ${storeAddress} | Hotline: ${supportPhone} | Email: ${supportEmail}<br>
        Website: <a href="${storeWebsite}">${storeWebsite}</a>
    </div>
</body>
</html>
  `;
    return await sendMail(toEmail, subject, htmlContent);
};

module.exports = { sendOrderConfirmationEmail };
