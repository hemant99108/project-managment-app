require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });