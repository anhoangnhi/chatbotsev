const { GoogleSpreadsheet } = require('google-spreadsheet');

const SHEET_ID = process.env.SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

async function getQnAResponse(userInput) {
  console.log('[GS] Truy cập Google Sheet...');

  const doc = new GoogleSpreadsheet(SHEET_ID);

  // ✅ Đặt ở đây mới đúng chỗ
  console.log('[DEBUG] typeof useServiceAccountAuth:', typeof doc.useServiceAccountAuth);

  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  const matched = rows.find((row) => {
    const keyword = row['Câu hỏi']?.toLowerCase().trim();
    return keyword && userInput.toLowerCase().includes(keyword);
  });

  return matched ? matched['Trả lời mẫu'] : '🤖 Xin lỗi, tôi chưa có câu trả lời phù hợp.';
}

module.exports = { getQnAResponse };
