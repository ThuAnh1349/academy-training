const fs = require('fs');
const path = require('path');

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/AdminPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add state variables at the beginning of the component
content = content.replace(
  /const \[activeTab, setActiveTab\] = useState\('s-dash'\);/,
  `const [activeTab, setActiveTab] = useState('s-dash');
  
  // Modal states
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isCatDeleteModalOpen, setCatDeleteModalOpen] = useState(false);
  const [isQuickCatModalOpen, setQuickCatModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isAchModalOpen, setAchModalOpen] = useState(false);
  const [isLessonModalOpen, setLessonModalOpen] = useState(false);`
);

// 2. Wrap modals with conditional rendering
content = content.replace(/<div className="modal-overlay" id="modal-category">/g, '{isCategoryModalOpen && (\n<div className="modal-overlay" id="modal-category">');
content = content.replace(/(<h3 id="modal-cat-title">[\s\S]*?)<button className="modal-close" >✕<\/button>/g, '$1<button className="modal-close" onClick={() => setCategoryModalOpen(false)}>✕</button>');
// Find the end of modal-category and add ')}' - this is tricky with regex, let's use replace with specific strings

// Let's replace the whole modal sections using split
const modals = [
  { id: 'modal-category', state: 'isCategoryModalOpen', setter: 'setCategoryModalOpen' },
  { id: 'modal-cat-delete', state: 'isCatDeleteModalOpen', setter: 'setCatDeleteModalOpen' },
  { id: 'modal-quick-cat', state: 'isQuickCatModalOpen', setter: 'setQuickCatModalOpen' },
  { id: 'modal-invite', state: 'isInviteModalOpen', setter: 'setInviteModalOpen' },
  { id: 'modal-ach', state: 'isAchModalOpen', setter: 'setAchModalOpen' },
  { id: 'modal-lesson', state: 'isLessonModalOpen', setter: 'setLessonModalOpen' },
];

for (const modal of modals) {
  const overlayStr = \`<div className="modal-overlay" id="\${modal.id}">\`;
  content = content.replace(overlayStr, \`{\${modal.state} && (\n\${overlayStr}\`);
  
  // Need to close the ')}' after the modal ends.
  // We can find the next '{/* Modal' or '</div>\\n    </div>\\n  );' and insert ')}\n' before it.
  // Actually, we can use regex to match the modal structure: 
  // <div className="modal-overlay" id="MODAL_ID">[... content ...]</div>\n</div>
  // Let's do it manually since we know the exact endings.
}

fs.writeFileSync('replace-script.js', 'console.log("Not running this one, needs better regex");');
