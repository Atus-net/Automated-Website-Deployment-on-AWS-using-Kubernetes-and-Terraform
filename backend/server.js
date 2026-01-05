require('dotenv').config();
const app = require('./app/app');
const connection = require('./database/database');

const port = process.env.PORT || 8080;

// Handle Error Global
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

(async () => {
    try {
        await connection();
        app.listen(port, () => {
            console.log(`Backend listening on port ${port}`);
        });
    } catch (error) {
        console.log('>>> Error connect to DB:', error);
    }
})();
