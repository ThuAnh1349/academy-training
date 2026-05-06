import fs from 'fs';

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/LessonPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Add youtube helper
if (!content.includes('getYoutubeId')) {
  content = content.replace(
    /export const LessonPage: React\.FC = \(\) => \{/,
    `const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const LessonPage: React.FC = () => {`
  );
}

// Replace pl-video container
const videoRegex = /<div className="pl-video">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const newVideoSection = `
          <div className="pl-video" style={{ position: 'relative', background: '#000' }}>
            {lesson.video_url ? (
              getYoutubeId(lesson.video_url) ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={\`https://www.youtube.com/embed/\${getYoutubeId(lesson.video_url)}?autoplay=0&rel=0\`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 'var(--r-md)' }}
                ></iframe>
              ) : (
                <video 
                  controls 
                  src={lesson.video_url} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 'var(--r-md)' }}
                />
              )
            ) : (
              <>
                <div className="pl-bg"><span className="pl-emoji">🧠</span></div>
                <div className="play-ov">
                  <div className={\`play-c \${isPlaying ? 'playing' : ''}\`} onClick={togglePlay}>
                    <span className="play-icon">{isPlaying ? '⏸' : (progress >= 100 ? '↺' : '▶')}</span>
                  </div>
                  <div className="pl-caption">{isPlaying ? \`Bài \${lesson.order_index} — \${lesson.title}\` : (progress >= 100 ? 'Video kết thúc — hoàn thành bài!' : 'Nhấn để phát')}</div>
                </div>
                <div className="pl-ctrl">
                  <div className="pl-ctrl-top">
                    <span className="pl-time">0:00 / {lesson.duration_minutes || 0}:00</span>
                    <div className="pl-ctrl-btns">
                      <button className="pl-speed">1.0×</button>
                    </div>
                  </div>
                  <div className="vid-seek">
                    <div className="vid-seek-f" style={{width: \`\${progress}%\`}}></div>
                  </div>
                </div>
              </>
            )}
          </div>
`;

content = content.replace(videoRegex, newVideoSection);

fs.writeFileSync(filePath, content);
console.log('Added dynamic video player to LessonPage');
