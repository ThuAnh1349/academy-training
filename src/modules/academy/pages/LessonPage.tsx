import React, { useState, useEffect } from 'react';
import { useLessonContent, useCourseDetail } from '../hooks/use-academy';

export const LessonPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(42);
  const [showBanner, setShowBanner] = useState(false);
  const [quizState, setQuizState] = useState<'none' | 'correct' | 'wrong'>('none');

  // Hardcoded for demo. Should come from URL params.
  const { data: lesson, isLoading: loadLesson } = useLessonContent('l5');
  const { data: detail, isLoading: loadCourse } = useCourseDetail('critical-thinking-l1');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return p + 0.4;
        });
      }, 120);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  if (loadLesson || loadCourse) return <div style={{padding: '24px'}}>Đang tải bài học...</div>;
  if (!lesson || !detail) return <div>Lỗi tải dữ liệu</div>;

  const togglePlay = () => setIsPlaying(!isPlaying);

  const completeLesson = () => {
    setProgress(100);
    setShowBanner(true);
  };

  const handleQuiz = (isCorrect: boolean) => {
    setQuizState(isCorrect ? 'correct' : 'wrong');
  };

  return (
    <div className="screen active" id="s-player">
      <div className="pl-layout">
        <div>
          <div className="pl-video">
            <div className="pl-bg"><span className="pl-emoji">🧠</span></div>
            <div className="play-ov">
              <div className={`play-c ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
                <span className="play-icon">{isPlaying ? '⏸' : (progress >= 100 ? '↺' : '▶')}</span>
              </div>
              <div className="pl-caption">{isPlaying ? `Bài ${lesson.lesson_order} — ${lesson.title}` : (progress >= 100 ? 'Video kết thúc — hoàn thành bài!' : 'Nhấn để phát')}</div>
            </div>
            <div className="pl-ctrl">
              <div className="pl-ctrl-top">
                <span className="pl-time">8:32 / {Math.floor((lesson.video_duration_s || 0)/60)}:00</span>
                <div className="pl-ctrl-btns">
                  <button className="pl-speed">1.0×</button>
                </div>
              </div>
              <div className="vid-seek">
                <div className="vid-seek-f" style={{width: `${progress}%`}}></div>
              </div>
            </div>
          </div>

          {showBanner && (
            <div className="complete-banner show">
              <div className="cb-icon">🎉</div>
              <div className="cb-text">
                <h4>Bài {lesson.lesson_order} hoàn thành! +{lesson.xp_reward} XP</h4>
                <p>Bài tiếp theo đã mở khoá</p>
              </div>
              <button className="cb-next" onClick={() => setShowBanner(false)}>Bài tiếp → </button>
            </div>
          )}

          <div className="lesson-detail">
            <div className="ld-top">
              <div className="ld-title">{lesson.title}</div>
              <div className="ld-xp">+{lesson.xp_reward} XP</div>
            </div>
            <div className="ld-body">{lesson.content_markdown}</div>
            <div className="key-box">
              <h4>Điểm chính cần nhớ</h4>
              <ul>
                {lesson.key_points.map((kp, idx) => <li key={idx}>{kp}</li>)}
              </ul>
            </div>
          </div>

          <div className="lnav">
            <button className="lnav-btn lnav-prev" disabled={!lesson.prev_lesson}>← Bài trước</button>
            <button className="lnav-btn lnav-next" onClick={completeLesson}>Xong bài này ✓</button>
          </div>

          <div className="quiz-box">
            <div className="quiz-top">
              <div className="quiz-lbl">Câu hỏi nhanh</div>
              <div className="quiz-pts">+15 XP nếu đúng</div>
            </div>
            <div className="quiz-q">Khi ai đó nói "Bạn không nên nghe ý kiến về sức khoẻ của anh ấy vì anh ấy béo", đây là kiểu ngụy biện gì?</div>
            <div className="quiz-opts">
              <button className={`quiz-opt ${quizState !== 'none' && 'disabled'}`} onClick={() => handleQuiz(false)}>Straw Man</button>
              <button className={`quiz-opt ${quizState === 'correct' ? 'correct' : (quizState === 'wrong' ? 'correct' : '')}`} onClick={() => handleQuiz(true)}>Ad Hominem</button>
              <button className={`quiz-opt ${quizState !== 'none' && 'disabled'}`} onClick={() => handleQuiz(false)}>False Dilemma</button>
              <button className={`quiz-opt ${quizState !== 'none' && 'disabled'}`} onClick={() => handleQuiz(false)}>Slippery Slope</button>
            </div>
            
            {quizState !== 'none' && (
              <div className={`quiz-result show ${quizState === 'correct' ? 'qr-correct' : 'qr-wrong'}`}>
                <div className="qr-icon">{quizState === 'correct' ? '✅' : '❌'}</div>
                <div className="qr-text">
                  <h5>{quizState === 'correct' ? 'Chính xác! +15 XP' : 'Chưa đúng — thử lần sau nhé'}</h5>
                  <p>{quizState === 'correct' ? 'Ad Hominem — tấn công người thay vì lập luận. Rất tốt!' : 'Đáp án đúng: Ad Hominem — tấn công người thay vì lập luận.'}</p>
                </div>
                <button className="qr-next" onClick={completeLesson}>Hoàn thành bài →</button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="pp">
            <div className="pp-title">{detail.course.title}</div>
            <div className="pp-sub">Module {lesson.module_order} · {detail.enrollment?.lessons_completed}/{detail.course.lesson_count} bài hoàn thành</div>
            <div className="pp-prog-bar"><div className="pp-prog-f" style={{width: `${detail.enrollment?.progress_pct || 0}%`}}></div></div>
            
            {detail.modules.map(mod => (
              <React.Fragment key={mod.module_order}>
                {mod.lessons.map(l => (
                  <div key={l.id} className={`pp-lesson ${l.id === lesson.id ? 'pp-cur' : l.status === 'locked' ? 'pp-locked-l' : 'pp-clickable'}`}>
                    <div className={`pp-n ${l.status === 'completed' ? 'pp-nd' : l.id === lesson.id ? 'pp-na' : l.status === 'locked' ? 'pp-nl' : ''}`}>
                      {l.status === 'completed' ? '✓' : l.status === 'locked' ? '🔒' : l.lesson_order}
                    </div>
                    <div>
                      <div className="pp-lt">{l.title}</div>
                      <div className="pp-ld">{l.estimated_minutes} phút {l.id === lesson.id ? '· Đang xem' : l.status === 'locked' ? '· Khoá' : ''}</div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
            <div className="pp-offline-note">
              <p><strong>📥 Offline sẵn sàng</strong> — học không cần internet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
