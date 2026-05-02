import React, { useState, useEffect } from 'react';

export const LessonPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(42);
  const [showBanner, setShowBanner] = useState(false);
  const [quizState, setQuizState] = useState<'none' | 'correct' | 'wrong'>('none');

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
              <div className="pl-caption">{isPlaying ? 'Bài 5 — Nhận biết ngụy biện trong thông tin' : (progress >= 100 ? 'Video kết thúc — hoàn thành bài!' : 'Nhấn để phát')}</div>
            </div>
            <div className="pl-ctrl">
              <div className="pl-ctrl-top">
                <span className="pl-time">8:32 / 20:00</span>
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
                <h4>Bài 5 hoàn thành! +25 XP</h4>
                <p>Bài tiếp theo đã mở khoá</p>
              </div>
              <button className="cb-next" onClick={() => setShowBanner(false)}>Bài tiếp → </button>
            </div>
          )}

          <div className="lesson-detail">
            <div className="ld-top">
              <div className="ld-title">Nhận biết ngụy biện trong thông tin hàng ngày</div>
              <div className="ld-xp">+25 XP</div>
            </div>
            <div className="ld-body">Ngụy biện (logical fallacy) là lỗi lập luận khiến một lập luận trông có vẻ hợp lý nhưng thực ra có vấn đề ở nền tảng. Chúng xuất hiện khắp nơi — từ quảng cáo, mạng xã hội, đến các cuộc tranh luận thường ngày.</div>
            <div className="key-box">
              <h4>Điểm chính cần nhớ</h4>
              <ul>
                <li>Ad Hominem: tấn công người thay vì lập luận của họ</li>
                <li>Straw Man: bóp méo quan điểm đối phương để dễ bác bỏ</li>
                <li>False Dilemma: chỉ đưa ra 2 lựa chọn dù còn nhiều hơn</li>
                <li>Hỏi: "Bằng chứng đâu? Còn lựa chọn nào khác?"</li>
              </ul>
            </div>
          </div>

          <div className="lnav">
            <button className="lnav-btn lnav-prev">← Bài trước</button>
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
            <div className="pp-title">Tư duy phản biện cơ bản</div>
            <div className="pp-sub">Module 2 · 4/8 bài hoàn thành</div>
            <div className="pp-prog-bar"><div className="pp-prog-f" style={{width:'60%'}}></div></div>
            <div className="pp-lesson pp-clickable">
              <div className="pp-n pp-nd">✓</div><div><div className="pp-lt">10 kiểu ngụy biện phổ biến</div><div className="pp-ld">24 phút</div></div>
            </div>
            <div className="pp-lesson pp-cur">
              <div className="pp-n pp-na">5</div><div><div className="pp-lt">Ngụy biện trong thông tin</div><div className="pp-ld">20 phút · Đang xem</div></div>
            </div>
            <div className="pp-lesson pp-locked-l">
              <div className="pp-n pp-nl">🔒</div><div><div className="pp-lt">Thực hành: Phân tích báo</div><div className="pp-ld">15 phút · Hoàn thành bài 5 để mở</div></div>
            </div>
            <div className="pp-lesson pp-locked-l">
              <div className="pp-n pp-nl">🔒</div><div><div className="pp-lt">Bài kiểm tra Module 2</div><div className="pp-ld">10 phút · Quiz</div></div>
            </div>
            <div style={{borderTop:'1px solid var(--border)',paddingTop:'12px',marginTop:'4px'}}>
              <div style={{fontSize:'10px',fontWeight:800,color:'var(--ink-light)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'9px'}}>Module 3</div>
              <div className="pp-lesson pp-locked-l"><div className="pp-n pp-nl">🔒</div><div><div className="pp-lt">Tư duy khoa học & bằng chứng</div><div className="pp-ld">28 phút</div></div></div>
              <div className="pp-lesson pp-locked-l"><div className="pp-n pp-nl">🔒</div><div><div className="pp-lt">Đặt câu hỏi đúng cách</div><div className="pp-ld">22 phút</div></div></div>
            </div>
            <div className="pp-offline-note">
              <p><strong>📥 Offline sẵn sàng</strong> — học không cần internet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
