
const express = require('express');
require('dotenv').config();
// 👉 In ra version thư viện để kiểm tra
// console.log('[Debug] google-spreadsheet version:', require('google-spreadsheet/package.json').version);

const { getQnAResponse } = require('./lib/googleSheet');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.send('✅ Middleware server is running!');
});

app.post('/webhook', async (req, res) => {
  const { message, user_id = 'web-user', platform = 'website' } = req.body;
  console.log(`[Webhook] Nhận từ ${platform} - ${user_id}: ${message}`);
  try {
    const reply = await getQnAResponse(message);
    res.json({ reply });
  } catch (error) {
    console.error('[Webhook Error]', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
