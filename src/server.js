import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js'; // your DB connection file


dotenv.config(); // load .env variables



// Connect to MongoDB before starting the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to connect to DB. Server not started.', err);
});