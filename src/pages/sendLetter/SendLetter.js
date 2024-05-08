import React, { useState } from "react";
import "./SendLetter.css";

const SendLetter = () => {
    const [letterContent, setLetterContent] = useState("");
    const [displayedLetter, setDisplayedLetter] = useState(null);
    const handleInputChange = (event) => {
        setLetterContent(event.target.value);
    };
    const handleSendLetter = () => {
        console.log(letterContent); // 텍스트 내용을 출력
    };
    const viewLetter = () => {
        const randomIndex = Math.floor(Math.random() * 3) + 1; // 1, 2, 또는 3 중 하나를 무작위로 선택
        const selectedLetter = require(`../sendLetter/letterImages/letter${randomIndex}.png`); // 선택된 편지의 경로를 동적으로 불러옵니다.
        setDisplayedLetter(selectedLetter); // 선택된 편지의 상태를 업데이트합니다.
        // console.log("클릭");
    };
    return(
        <div className="sendletterMainPage">
            <img src="/images/sendLetter/table.jpg" alt="책상 이미지" className="table" />
            <img src="/images/sendLetter/mailbox.png" alt="편지함" className="mailbox" onClick={viewLetter} />
            {displayedLetter && <img src={displayedLetter} alt="편지" className="displayedLetter" />}
            <div className="letterContainerr">
                <textarea
                    className="letter"
                    value={letterContent}
                    onChange={handleInputChange}
                    placeholder="여기에 편지를 작성하세요"
                />
            </div>
            <img src="/images/sendLetter/FountainPen.png" alt="만년필" className="FountainPen" />
            <img src="/images/sendLetter/paperAirplane.png" alt="종이비행기" className="paperAirplane" onClick={handleSendLetter} />
        </div>
    )
}
export default SendLetter;
