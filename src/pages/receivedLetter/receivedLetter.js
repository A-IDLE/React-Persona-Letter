import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './receivedLetter.css'
import { receivedLetter } from '../../apis/letterApi';


function ReceivedLetter() {
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
        if (letterId) {
          receivedLetter(letterId)
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

    return (
        <section className='received_wrapper'>
                <div className="header_inbox" onClick={handleClickHeader}>
                <h1 className="header-title_inbox">Persona Letter</h1>
            </div>   
            <div className={`image_card ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
                <div className='image_front'>
                    <img 
                        // 동적 URL을 사용하여 이미지 설정
                        src={`https://persona-letter.s3.ap-southeast-2.amazonaws.com/letters/${letterId}_0.jpg`} 
                        className='image_section' 
                        alt="letter front">
                    </img>
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

export default ReceivedLetter;
