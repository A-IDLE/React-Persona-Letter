import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './receivedLetter.css'
import { getALetter } from '../../apis/letterApi';


function ReceivedLetter() {
    const [flipped, setFlipped] = useState(false);

    const handleFlip = () => {
        if (location.state?.from === 'inbox') {
            setFlipped(!flipped);
        }
    };

    const { letterId } = useParams();
    const [letter, setLetter] = useState(null);
    const letterContentRef = useRef(null);
    const [letterSectionHeight, setLetterSectionHeight] = useState('800px');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLetter = async () => {
            try {
                const response = await getALetter(letterId);
                console.log(response);
                setLetter(response.data);
            } catch (error) {
                console.error('Error fetching letter', error);
            }
        };

        if (letterId) {
            fetchLetter();
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

    return (
        <section className='received_wrapper'>
            <div className={`image_card ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
                <div className='image_front'>
                    <img 
                        // inbox가 아닐 때 표시할 이미지 설정
                        src={location.state?.from !== 'inbox' ? "/images/receivedLetter/Absolutely_In_Love.jpeg" : "/images/receivedLetter/image_example.png"} 
                        className='image_section' 
                        alt="letter front">
                    </img>
                </div>
                {/* inbox가 아닐 때 back 이미지를 표시하지 않음 */}
                {location.state?.from === 'inbox' && (
                    <div className='image_back'>
                        <div className='back_frame'>
                            <div className='image_comment'>Found this in Hogsmeade</div>
                        </div>
                    </div>
                )}
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
