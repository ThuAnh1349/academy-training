import fs from 'fs';

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/AdminPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace value="..." with defaultValue="..." in <input> tags
content = content.replace(/<input([^>]*?)value="([^"]*)"/g, '<input$1defaultValue="$2"');

// Same for <textarea> if they happen to have value= (though they usually use children or defaultValue)
content = content.replace(/<textarea([^>]*?)value="([^"]*)"/g, '<textarea$1defaultValue="$2"');

fs.writeFileSync(filePath, content);
console.log('Fixed React controlled inputs issue');
