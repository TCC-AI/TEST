function doPost(e) {
  // 1. 設定 CORS 標頭，允許跨網域請求 (重要！)
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    // 2. 解析前端傳來的資料
    var postData = JSON.parse(e.postData.contents);
    var userMessage = postData.message;

    // 3. 呼叫 Gemini API (請稍後填入您的 API Key)
    var apiKey = "YOUR_GEMINI_API_KEY"; // 替換成您的 KEY
    // Update model to gemini-2.0-flash (current standard in late 2025)
    var apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

    var payload = {
      "contents": [
        {
          "parts": [
            {
              "text": "你現在是一個親切的數位人助手。請用簡短、口語化、溫暖的語氣回答使用者的這句話 (不要超過 50 個字)：" + userMessage
            }
          ]
        }
      ]
    };

    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload)
    };

    var response = UrlFetchApp.fetch(apiUrl, options);
    var responseJson = JSON.parse(response.getContentText());
    var aiText = responseJson.candidates[0].content.parts[0].text;

    // 4. 回傳結果給前端
    return ContentService.createTextOutput(JSON.stringify({ "reply": aiText }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  // 對於 Simple Request，其實不需要即使回應 Preflight，但保留也無妨，只是不能用 setHeader
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT);
}
