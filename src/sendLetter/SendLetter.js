import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import table from "../images/table.jpg";
import mailbox from "../images/mailbox.png";
import FountainPen from "../images/FountainPen.png";
import paperAirplane from "../images/paperAirplane.png";
import { getLetterList, writeLetter} from "../apis/letterApii";
import "./SendLetter.css";

const SendLetter = () => {
    const [letterContent, setLetterContent] = useState("");
    const [displayedLetter, setDisplayedLetter] = useState(null);
    const [showAllLetters, setShowAllLetters] = useState(false);
    const [letters, setLetters] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setLetterContent(event.target.value);
    };

    // 전송버튼
    const handleSendLetter = async () => {
        if (window.confirm("전송")) {
            try {
                // `writeLetter` 함수를 호출할 때, 적절한 데이터 구조로 전달
                const response = await writeLetter({ data: { character_id: 2, user_id: 1, letter_content: letterContent } });
                console.log(response.data)
                alert('편지가 전송되었습니다.');
                navigate("/sending");
            } catch (error) {
                alert('전송 실패:', error.message);
            }
        }
    };

    // 편지 조회
    const viewLetter = () => {
        setShowAllLetters(true);
    };

    // 편지 선택
    const selectLetter = () => {
        if (letters.length > 0) {
            setDisplayedLetter(letters[currentIndex]);
            setShowAllLetters(false);
        }
    };

    // 편지 조회
    // useEffect(() => {
    //     axios.get('http://localhost:9000/leadLetter')
    //         .then(response => setLetters(response.data))
    //         .catch(error => console.error(error));
    // }, []);
    useEffect(() => {
        const lettersData = async () => {
            try {
                const response = await getLetterList();
                console.log(response.data);
                setLetters(response.data);
                // setSeriesList(response);
            } catch (error) {
                console.error('Failed to fetch series data:', error);
            }
        };

        lettersData();
    }, []);

    // 다음
    const nextLetter = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % letters.length);
    };

    // 이전
    const prevLetter = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + letters.length) % letters.length);
    };

    return (
        <div className="sendletterMainPage">
            <img src={table} alt="책상 이미지" className="table" />
            <img src={mailbox} alt="편지함" className="mailbox" onClick={viewLetter} />
            {showAllLetters && (
                <div>
                    {letters.length > 0 && (
                        <div className="letterCard">
                            <p>{letters[currentIndex].letter_content}</p>
                            <button onClick={prevLetter}>이전</button>
                            <button onClick={selectLetter}>선택</button>
                            <button onClick={nextLetter}>다음</button>
                        </div>
                    )}
                </div>
            )}
            {displayedLetter && (
                <div className="displayedLetter">
                {/* 편지 출력 */}
                    <p>{displayedLetter.letter_content}</p>
                </div>
            )}
            <div className="letterContainerr">
                {/* 편지 작성 */}
                <textarea
                    className="letter"
                    value={letterContent}
                    onChange={handleInputChange}
                    placeholder="여기에 편지를 작성하세요"
                />
            </div>
            <img src={FountainPen} alt="만년필" className="FountainPen" />
            {/* 전송 버튼 */}
            <img src={paperAirplane} alt="종이비행기" className="paperAirplane" onClick={handleSendLetter} />
        </div>
    );
};

export default SendLetter;
