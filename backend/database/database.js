const mongoose = require('mongoose');
const dbConfig = require('../configs/db.config');

const connection = async () => {
    // --- SỬA TRỰC TIẾP TẠI ĐÂY ---
    // 1. Lấy URI trực tiếp từ biến môi trường Docker (MONGO_URI)
    // 2. Nếu không có (chạy local) thì dùng localhost
    const uri = process.env.MONGO_URI || "mongodb://locakubectl logs deployment/backendlhost:27017/cake_db";

    const dbState = [
        { value: 0, label: "Disconnected" },
        { value: 1, label: "Connected" },
        { value: 2, label: "Connecting" },
        { value: 3, label: "Disconnecting" }
    ];

    try {
        console.log(">>> Đang thử kết nối tới URI:", uri); // In ra để kiểm tra
        
        await mongoose.connect(uri);
        
        const state = Number(mongoose.connection.readyState);
        console.log(dbState.find(f => f.value === state).label, "to database");
        
    } catch (error) {
        console.log(">>> Lỗi kết nối DB (Chi tiết):", error.message);
        // Không throw error để server không crash, nhưng bạn sẽ biết lỗi ở đâu
    }
};

module.exports = connection;
