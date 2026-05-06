const fs = require('fs');

let tsx = fs.readFileSync('src/modules/academy/pages/AdminPage.tsx', 'utf8');

// 1. Fix >= in gamification
tsx = tsx.replace(/>=/g, "{'>='}");

// 2. Fix maxlength -> maxLength
tsx = tsx.replace(/maxlength/g, "maxLength");

// 3. Fix <br>
tsx = tsx.replace(/<br>/g, "<br />");
tsx = tsx.replace(/<hr>/g, "<hr />");

// 4. Missing fragment or div closes
// Let's use a simpler method. I will just run prettier or rely on the fact that I can fix the specific unclosed tags by finding them.
// Let's look at the errors reported by the IDE:
// Line 670, 677, 684, 691, 698: `>=` - fixed above.
// Line 949: Expected corresponding closing tag for JSX fragment.
// Let's print out lines around 949 to see what's wrong.
// Line 1141: '}' expected.
// Line 1208: '}' expected.

fs.writeFileSync('src/modules/academy/pages/AdminPage.tsx', tsx);
console.log("Fixed simple syntax errors");
