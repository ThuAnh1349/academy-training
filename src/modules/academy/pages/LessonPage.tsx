import React, { useState, useEffect } from 'react';
import { useLessonContent, useCourseDetail } from '../hooks/use-academy';

import { useParams, useNavigate } from 'react-router-dom';

const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const LessonPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseSlug, lessonId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(42);
  const [showBanner, setShowBanner] = useState(false);
  const [quizState, setQuizState] = useState<'none' | 'correct' | 'wrong'>('none');

  const { data: lesson, isLoading: loadLesson } = useLessonContent(lessonId || '');
  const { data: detail, isLoading: loadCourse } = useCourseDetail(courseSlug || '');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
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
          
          <div className="pl-video" style={{ position: 'relative', background: '#000' }}>
            {lesson.video_url ? (
              getYoutubeId(lesson.video_url) ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${getYoutubeId(lesson.video_url)}?autoplay=0&rel=0`} 
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
                  <div className={`play-c ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
                    <span className="play-icon">{isPlaying ? '⏸' : (progress >= 100 ? '↺' : '▶')}</span>
                  </div>
                  <div className="pl-caption">{isPlaying ? `Bài ${lesson.order_index} — ${lesson.title}` : (progress >= 100 ? 'Video kết thúc — hoàn thành bài!' : 'Nhấn để phát')}</div>
                </div>
                <div className="pl-ctrl">
                  <div className="pl-ctrl-top">
                    <span className="pl-time">0:00 / {lesson.duration_minutes || 0}:00</span>
                    <div className="pl-ctrl-btns">
                      <button className="pl-speed">1.0×</button>
                    </div>
                  </div>
                  <div className="vid-seek">
                    <div className="vid-seek-f" style={{width: `${progress}%`}}></div>
                  </div>
                </div>
              </>
            )}
          </div>

          {showBanner && (
            <div className="complete-banner show">
              <div className="cb-icon">🎉</div>
              <div className="cb-text">
                <h4>Bài {lesson.order_index} hoàn thành! +{lesson.xp_on_complete} XP</h4>
                <p>Bài tiếp theo đã mở khoá</p>
              </div>
              <button className="cb-next" onClick={() => setShowBanner(false)}>Bài tiếp → </button>
            </div>
          )}

          <div className="lesson-detail">
            <div className="ld-top">
              <div className="ld-title">{lesson.title}</div>
              <div className="ld-xp">+{lesson.xp_on_complete} XP</div>
            </div>
            <div className="ld-body">{lesson.content_body}</div>
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
            <div className="pp-sub">Tiến độ khoá học · {detail.enrollment?.lessons_completed}/{detail.course.total_lessons} bài hoàn thành</div>
            <div className="pp-prog-bar"><div className="pp-prog-f" style={{width: `${detail.enrollment?.progress_pct || 0}%`}}></div></div>
            
            {detail.modules.map(mod => (
              <React.Fragment key={mod.order_index}>
                {mod.lessons.map((l: any) => (
                  <div 
                    key={l.id} 
                    className={`pp-lesson ${l.id === lesson.id ? 'pp-cur' : l.is_locked ? 'pp-locked-l' : 'pp-clickable'}`}
                    onClick={() => {
                      if (!l.is_locked && l.id !== lesson.id) navigate(`/player/${courseSlug}/${l.id}`);
                    }}
                  >
                    <div className={`pp-n ${l.status === 'completed' ? 'pp-nd' : l.id === lesson.id ? 'pp-na' : l.is_locked ? 'pp-nl' : ''}`}>
                      {l.status === 'completed' ? '✓' : l.is_locked ? '🔒' : l.order_index}
                    </div>
                    <div>
                      <div className="pp-lt">{l.title}</div>
                      <div className="pp-ld">{l.duration_minutes} phút {l.id === lesson.id ? '· Đang xem' : l.is_locked ? '· Khoá' : ''}</div>
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
