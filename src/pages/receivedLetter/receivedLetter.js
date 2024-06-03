import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './receivedLetter.css';
import { receivedLetter } from '../../apis/letterApi';

function ReceivedLetter() {
  const [flipped, setFlipped] = useState(false);
  const location = useLocation();
  const { letterId, letterContent, imageUrl } = location.state || {}; // 상태에서 letterId, letterContent, imageUrl 가져오기
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleFlip = () => {
    if (location.state?.from === 'inbox') {
      setFlipped(!flipped);
    }
  };

  const [letter, setLetter] = useState(null);
  const letterContentRef = useRef(null);
  const [letterSectionHeight, setLetterSectionHeight] = useState('800px');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Nanum+Brush+Script&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    if (letterId) {
      if (letterContent && imageUrl) {
        // LetterPage에서 넘겨받은 데이터 사용
        setLetter({ letter_content: letterContent });
        setLoading(false);
      } else {
        // 편지함에서 직접 확인할 때 API 호출
        receivedLetter(letterId)
          .then(response => {
            setLetter(response.data);
            setLoading(false);
          })
          .catch(error => {
            console.error("Error fetching the letter:", error);
            setLoading(false);
          });
      }
    } else {
      setLoading(false);
    }
  }, [letterId, letterContent, imageUrl]);

  useEffect(() => {
    if (letterContentRef.current) {
      const newHeight = letterContentRef.current.offsetHeight + 150;
      setLetterSectionHeight(newHeight < 900 ? '800px' : `${newHeight}px`);
    }
  }, [letter]);

  const showButtons = location.state?.from === 'inbox';

  const handleReplyClick = () => {
    navigate('/SendLetter', { state: { characterId: letter.character_id } });
  };

  const handleClickHeader = () => {
    navigate('/');
  };

  useEffect(() => {
    const isKorean = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
    const letterContent = letter?.letter_content || '';

    if (isKorean(letterContent)) {
      letterContentRef.current.classList.add('korean');
    } else {
      letterContentRef.current.classList.remove('korean');
    }
  }, [letter]);

  return (
    <section className='received_wrapper'>
            <div className="header_received" onClick={handleClickHeader}>
                <h1 className="header-title_received">Persona Letter</h1>
            </div>   
            <div className={`image_card ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
                <div className='image_front'>
                    <img 
                        src={`https://persona-letter.s3.ap-southeast-2.amazonaws.com/letters/${letterId}_0.jpg`} 
                        className='image_section' 
                        alt="letter front"
                    />
                </div>

                <div className='image_back'>
                    <div className='back_frame'>
                        <div className='image_comment'>Found this in Hogsmeade</div>
                    </div>
                </div>
            </div>
            <div className='letter_section' style={{ height: letterSectionHeight }}>
                <div className='letter_content' ref={letterContentRef}>
                    {letter && letter.letter_content}
                </div>
                <div className='a_letter_buttons'>
                    <span className='reply_button' onClick={handleReplyClick}>답장하기</span>
                </div>
            </div>
        </section>
  );
}

export default ReceivedLetter;
