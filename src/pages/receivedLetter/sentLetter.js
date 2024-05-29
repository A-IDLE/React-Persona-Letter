import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './receivedLetter.css'
import { sentLetter } from '../../apis/letterApi';


function SentLetter() {
    const [flipped, setFlipped] = useState(false);
    const location = useLocation();
    const { letterId } = location.state || {}; // 상태에서 letterId 가져오기
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
            sentLetter(letterId)
            .then(response => {
              setLetter(response.data);
              setLoading(false);
            })
            .catch(error => {
              console.error("Error fetching the letter:", error);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      }, [letterId]);

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
            <div className='image_sent_text'>No sent image yet</div>
            <div className={`image_card ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
                <div className='image_front'>
                    <div 
                        style={{backgroundImage: "url('/images/receivedLetter/Absolutely_In_Love.jpeg')"}}
                        className='image_section_sent' 
                        alt="letter front">
                    </div>
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
                {showButtons && (
                    <div className='a_letter_buttons'>
                        <span className='reply_button' onClick={handleReplyClick}>답장하기</span>
                    </div>
                )}
            </div>
        </section>
    );
}

export default SentLetter;
