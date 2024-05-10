import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './receivedLetter.css'
import axios from 'axios';

function ReceivedLetter() {
    const [flipped, setFlipped] = useState(false);

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    const { letterId } = useParams();
    const [letter, setLetter] = useState(null);
    const letterContentRef = useRef(null);
    const [letterSectionHeight, setLetterSectionHeight] = useState('800px');

    useEffect(() => {
        const fetchLetter = async () => {
          try {
            const response = await axios.get(`http://localhost:9000/getALetter/${letterId}`);
            console.log("API Response:", response.data);  // 로그 추가
            setLetter(response.data);
          } catch (error) {
            console.error('Failed to fetch letter', error);
          }
        };
    
        if (letterId) {
          fetchLetter();
        }
      }, [letterId]);

    // letter_content의 높이를 계산하여 letter_section의 높이를 설정
    useEffect(() => {
        if (letterContentRef.current) {
            setLetterSectionHeight(`${letterContentRef.current.offsetHeight + 100}px`); // 내용 높이 + 100px
        }
    }, [letter]); // letter 데이터가 업데이트 될 때마다 실행
      
    return (
        <section className='received_wrapper'>
            <div className={`image_card ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
                <div className='image_front'>
                    <img src="/images/receivedLetter/image_example.png" className='image_section'></img>
                </div>
                <div className='image_back'>
                    <div className='back_frame'>
                        <div className='image_comment'>Found this in Hogsmeade</div>
                    </div>
                </div>
            </div>
            <div className='letter_section' style={{ minHeight: letterSectionHeight }}>
            <div className='letter_content' ref={letterContentRef}>
                {letter && letter.letter_content}
                </div>
                <div className='letter_buttons'>
                    <div className='translation_button'>번역하기</div>
                    <div className='reply_button'>답장하기</div>
                </div>
            </div>
        </section>
    );
}
export default ReceivedLetter;