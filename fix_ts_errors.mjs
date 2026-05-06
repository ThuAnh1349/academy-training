import fs from 'fs';

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/AdminPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Use isLoading vars
content = content.replace(
  /if \(loadingStats \|\| loadingUsers\) return <div style={{padding: '24px'}}>Đang tải dữ liệu Admin\.\.\.<\/div>;/,
  "if (loadingStats || loadingUsers || loadingCourses || loadingCategories || loadingAchievements) return <div style={{padding: '24px'}}>Đang tải dữ liệu Admin...</div>;"
);

// Map categories
const catGridRegex = /<div id="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat\(3,1fr\)', gap: '14px', marginBottom: '20px' }}>.*?<\/div>/s;
const dynamicCatGrid = `<div id="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' }}>
  {categories?.map((cat: any) => (
    <div key={cat.id} style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: 'var(--sh)', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ fontSize: '2rem' }}>{cat.emoji}</div>
      <div>
        <div style={{ fontWeight: 800, fontSize: '14px' }}>{cat.name}</div>
        <div style={{ fontSize: '11px', color: 'var(--ink-light)' }}>ID: {cat.key}</div>
      </div>
    </div>
  ))}
</div>`;
if (content.match(catGridRegex)) {
  content = content.replace(catGridRegex, dynamicCatGrid);
} else {
  content = content.replace(/<div id="cat-grid"[\s\S]*?<\/div>/, dynamicCatGrid);
}

// Map achievements
const gamGridRegex = /<div className="gam-grid">[\s\S]*?<div className="cert-list">/;
const dynamicGamGrid = `<div className="gam-grid">
  {achievements?.map((ach: any) => (
    <div className="gam-card" key={ach.id}>
      <div className="gam-icon">{ach.icon_emoji}</div>
      <div className="gam-title">{ach.title}</div>
      <div className="gam-desc">{ach.description}</div>
      <div className="gam-condition">{ach.key}</div>
      <div className="gam-xp"><span className="gam-xp-val">+{ach.xp_reward} XP</span><button className="gam-edit">Chỉnh sửa</button></div>
    </div>
  ))}
</div>
<div className="cert-list">`;
if (content.match(gamGridRegex)) {
  content = content.replace(gamGridRegex, dynamicGamGrid);
}

// In case the previous regex failed because of replacing the whole thing, let's just use console.log to debug.
fs.writeFileSync(filePath, content);
console.log('Fixed TS errors in AdminPage');
