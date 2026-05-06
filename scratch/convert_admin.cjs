const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../../academy-nlt-admin.html');
const cssPath = path.join(__dirname, '../src/modules/academy/pages/AdminPage.css');
const tsxPath = path.join(__dirname, '../src/modules/academy/pages/AdminPage.tsx');

let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Extract CSS
const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
let css = cssMatch ? cssMatch[1] : '';

const classMap = {
  '.app': '.admin-app',
  '.sidebar': '.admin-sidebar',
  '.main': '.admin-main',
  '.topbar': '.admin-topbar',
  '.content': '.admin-content',
  '.screen': '.admin-screen',
  '.sb-': '.admin-sb-',
  '.nav-': '.admin-nav-',
  '.tb-': '.admin-tb-',
  '.sec-h': '.admin-sec-h',
};

css = `.admin-root {\n  background: var(--bg);\n  font-family: 'Nunito', sans-serif;\n  color: var(--ink);\n  min-height: 100vh;\n  overflow-x: hidden;\n}\n.admin-root * { box-sizing: border-box; }\n` + css;
css = css.replace(/:root\s*\{([\s\S]*?)\}/, '');
css = css.replace(/html,body\s*\{([\s\S]*?)\}/, '');

for (const [orig, repl] of Object.entries(classMap)) {
  css = css.split(orig).join(repl);
}
fs.writeFileSync(cssPath, css);

// 3. Extract body content
const appMatch = html.match(/<div class="app">([\s\S]*?)<\/div>\s*<!-- Modal/);
let appHtml = appMatch ? appMatch[1] : html.match(/<div class="app">([\s\S]*?)<script>/)[1];

const modalsMatch = html.match(/(<!-- Modal[\s\S]*?)<div class="toast"/);
let modalsHtml = modalsMatch ? modalsMatch[1] : '';

let fullHtml = `<div class="app">\n${appHtml}\n${modalsHtml}\n</div>`;

let jsx = fullHtml;
jsx = jsx.replace(/class="/g, 'className="');

const classMapJsx = {
  'app"': 'admin-app"',
  'sidebar"': 'admin-sidebar"',
  'main"': 'admin-main"',
  'topbar"': 'admin-topbar"',
  'content"': 'admin-content"',
  'screen ': 'admin-screen ',
  'screen"': 'admin-screen"',
  'sb-': 'admin-sb-',
  'nav-': 'admin-nav-',
  'tb-': 'admin-tb-',
  'sec-h"': 'admin-sec-h"',
};

for (const [orig, repl] of Object.entries(classMapJsx)) {
  jsx = jsx.split(orig).join(repl);
}

jsx = jsx.replace(/style="([^"]*)"/g, (match, styleString) => {
  const rules = styleString.split(';').filter(r => r.trim());
  const styleObj = rules.map(rule => {
    let [key, val] = rule.split(':');
    if (!val) return '';
    key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
    val = val.trim();
    return `${key}: '${val}'`;
  }).filter(Boolean).join(', ');
  return `style={{ ${styleObj} }}`;
});

jsx = jsx.replace(/onclick="[^"]*"/g, '');
jsx = jsx.replace(/oninput="[^"]*"/g, '');
jsx = jsx.replace(/onchange="[^"]*"/g, '');

jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
jsx = jsx.replace(/<input([^>]*[^\/])>/g, '<input$1 />');

// Fix unclosed elements like <hr> or <br>
jsx = jsx.replace(/<br([^>]*[^\/])>/g, '<br$1 />');
jsx = jsx.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');

jsx = jsx.replace(/style=\{\{\s*\}\}/g, '');

jsx = jsx.replace(/className="admin-screen active"/g, 'className="admin-screen"');

const tabs = ['s-dash', 's-users', 's-progress', 's-courses', 's-editor', 's-gam', 's-certs', 's-analytics', 's-categories'];
for (const tab of tabs) {
  const divStartRegex = new RegExp(`<div className="admin-screen" id="${tab}">`);
  jsx = jsx.replace(divStartRegex, `{activeTab === '${tab}' && (<>\n<div className="admin-screen active" id="${tab}">`);
}

const parts = jsx.split('{activeTab === ');
for (let i = 2; i < parts.length; i++) {
  parts[i - 1] = parts[i - 1].trimEnd() + '\n</>)}\n';
}
jsx = parts.join('{activeTab === ');

// Close the very last one
jsx = jsx.replace(/<\/div>\s*\{\/\* \/content \*\/\}/, '</>)}\n</div>{/* /content */}');

const navs = ['dash', 'analytics', 'courses', 'editor', 'categories', 'users', 'progress', 'gam', 'certs'];
for (const nav of navs) {
  const btnRegex = new RegExp(`<button className="admin-nav-item(?: active)?" id="admin-nav-${nav}"\\s*>`);
  jsx = jsx.replace(btnRegex, `<button className={\`admin-nav-item \${activeTab === 's-${nav}' ? 'active' : ''}\`} onClick={() => goTo('s-${nav}')}>`);
}

jsx = jsx.replace(/<div className="admin-tb-title" id="admin-tb-title">Dashboard<\/div>/, `<div className="admin-tb-title" id="admin-tb-title">
              {activeTab === 's-dash' && 'Dashboard'}
              {activeTab === 's-users' && 'Quản lý học viên'}
              {activeTab === 's-progress' && 'Tiến độ học tập'}
              {activeTab === 's-courses' && 'Quản lý khoá học'}
              {activeTab === 's-editor' && 'Tạo / chỉnh sửa khoá học'}
              {activeTab === 's-gam' && 'Gamification & Thành tích'}
              {activeTab === 's-certs' && 'Chứng chỉ'}
              {activeTab === 's-analytics' && 'Phân tích học tập'}
              {activeTab === 's-categories' && 'Quản lý danh mục'}
            </div>`);

const tsxContent = `import React, { useState } from 'react';
import './AdminPage.css';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('s-dash');

  const goTo = (id: string) => setActiveTab(id);
  const showToast = (msg: string) => alert(msg);
  const openModal = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  };
  const closeModal = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  };

  return (
    <div className="admin-root">
      ${jsx}
    </div>
  );
};
`;

fs.writeFileSync(tsxPath, tsxContent);
console.log('Conversion completed successfully!');
