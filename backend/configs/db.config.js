require('dotenv').config();

const dbConfig = {
    uri: process.env.MONGO_URI || process.env.DB_URI || "mongodb://localhost:27017/cake_db",
    // option tùy chọn nếu có
    // options: {
    //     user: process.env.DB_USER,
    //     pass: process.env.DB_PASSWORD,
    //     dbName: process.env.DB_NAME,
    // }
};

module.exports = dbConfig;
