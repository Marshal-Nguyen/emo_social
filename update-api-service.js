// Script để cập nhật tất cả hardcode token trong apiService.js
const fs = require('fs');

const filePath = 'src/services/apiService.js';
let content = fs.readFileSync(filePath, 'utf8');

// Thay thế tất cả hardcode token bằng getCurrentToken()
const hardcodeToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Y2I4N2UxMS1kOWRmLTRjMzgtYTU5Mi0yODk1N2UyZDg3YzQiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk1NzYwNjEsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.MG1EkajgC6iLq1wVJ1KeOIhBq8woVovtUsgaWsDYI733IqgoRZtPmYb3t0Mq6uVCdVenWrWecGA8NGi1pYKtocEDmQk25Y-tVAUqnIjd3zGcMxTs-az9JJ51FeK87gD3nABv2Wznvgx6XRPJikLXfF6Hje6ywp0LT27AB-TipXIzkvV9gyVm7tHyMEsp5HF2Z7hCrpjrtZQCwWDGmFDzn0a11AZzkbWfdtZxaj9BChiRBNayhnxygQyRZ9oHRxO-dqfrbr8jfIekZ7UBCDJEAnwiEymTeSTCdCDY-ABEvXZZc-aHgy7LbPgp5scBxKJhfmdWBahzK7kumr3OKqQaww";

// Pattern để tìm và thay thế
const patterns = [
    // Pattern 1: const token = "hardcode_token";
    {
        regex: /const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9[^"]*";/g,
        replacement: `const token = getCurrentToken();
    
    if (!token) {
      throw new Error("No authentication token found. Please login first.");
    }`
    },
    // Pattern 2: 'Authorization': `Bearer ${token}`
    {
        regex: /'Authorization': `Bearer \${token}`/g,
        replacement: `'Authorization': \`Bearer \${token}\``
    },
    // Pattern 3: "Authorization": `Bearer ${token}`
    {
        regex: /"Authorization": `Bearer \${token}`/g,
        replacement: `"Authorization": \`Bearer \${token}\``
    }
];

// Thay thế tất cả patterns
patterns.forEach(pattern => {
    content = content.replace(pattern.regex, pattern.replacement);
});

// Thay thế tất cả hardcode token bằng getCurrentToken()
content = content.replace(new RegExp(hardcodeToken, 'g'), 'getCurrentToken()');

// Thay thế tất cả fetch calls để sử dụng createApiHeaders()
content = content.replace(
    /headers: \{\s*'Content-Type': 'application/json',\s*'Authorization': `Bearer \${token}`\s*\}/g,
  'headers: createApiHeaders()'
);

content = content.replace(
    /headers: \{\s*"Content-Type": "application/json",\s*"Authorization": `Bearer \${token}`\s*\}/g,
  'headers: createApiHeaders()'
);

// Ghi file đã cập nhật
fs.writeFileSync(filePath, content);

console.log('✅ Updated apiService.js to use dynamic tokens from Redux store');
