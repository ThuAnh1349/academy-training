const XLSX = require('xlsx');

const ws = XLSX.utils.json_to_sheet([
  {
    "Question": "Phát biểu nào sau đây là đúng về tư duy phản biện?",
    "Option_A": "Là việc luôn chỉ trích ý kiến người khác",
    "Option_B": "Là khả năng phân tích và đánh giá thông tin một cách khách quan",
    "Option_C": "Là việc đồng ý với ý kiến của số đông",
    "Option_D": "Là việc dựa vào cảm xúc để ra quyết định",
    "Correct_Answer": "B",
    "Explanation": "Tư duy phản biện đòi hỏi sự khách quan, dựa trên bằng chứng và phân tích logic thay vì cảm xúc hay ý kiến số đông."
  },
  {
    "Question": "Ngụy biện 'Tấn công cá nhân' (Ad Hominem) là gì?",
    "Option_A": "Tấn công vào luận điểm của đối phương",
    "Option_B": "Tấn công vào người đưa ra luận điểm thay vì luận điểm",
    "Option_C": "Đưa ra bằng chứng sai lệch",
    "Option_D": "Sử dụng ngôn từ mạnh mẽ",
    "Correct_Answer": "B",
    "Explanation": "Ngụy biện Ad Hominem là việc công kích cá nhân người tranh luận thay vì phản bác tính hợp lý của luận điểm họ đưa ra."
  }
]);

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Questions");
XLSX.writeFile(wb, "./public/Quiz_Template.xlsx");
console.log("Created Quiz_Template.xlsx in public folder");
