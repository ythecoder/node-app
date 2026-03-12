import mongoose from 'mongoose';
export const checkDBHealth = (req, res) => {
  const readyState = mongoose.connection.readyState;
  // 0 = disconnected
  // 1 = connected
  // 2 = connecting
  // 3 = disconnecting
  if (readyState === 1) {
    return res.status(200).json({ status: 'ok', 
      message: 'Database connected ✅' });
  } else if (readyState === 2) {
    return res.status(200).json({ status: 'connecting', 
      message: 'Database is connecting...' });
  } else {
    return res.status(500).json({ status: 'error', 
      message: 'Database not connected ❌' });
  }
};