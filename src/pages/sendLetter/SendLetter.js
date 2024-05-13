import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLetterList, writeLetter } from "../../apis/letterApi";
import "./SendLetter.css";

const SendLetter = () => {
  const [letterContent, setLetterContent] = useState("");
  const [displayedLetter, setDisplayedLetter] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // 이미지를 클릭하여 편지함 열거나 닫는 상태
  const [letters, setLetters] = useState([]); // 편지 목록 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [characterId, setCharacterId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage에서 userId 가져오기
    const storedUserId = localStorage.getItem("userId");
    const storedChId = localStorage.getItem("characterId");
    setUserId(storedUserId); // userId 상태 설정
    setCharacterId(storedChId);
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행

  console.log("현재 유저아이디" + userId);

  const handleInputChange = (event) => {
    setLetterContent(event.target.value);
    // setUserId(event.value.target);
  };

  // 전송버튼
  const handleSendLetter = async () => {
    if (window.confirm("전송")) {
      try {
        // `writeLetter` 함수를 호출할 때, 적절한 데이터 구조로 전달
        alert("편지가 전송되었습니다.");
        navigate("/sending");

        const data = {
            character_id: characterId,
            user_id: userId,
            letter_content: letterContent
        }
        console.log(data)

        const response = await writeLetter(data);
        // console.log(response.data)
      } catch (error) {
        alert("전송 실패:", error.message);
      }
    }
  };

  // 편지 조회
  const viewLetter = async () => {
    try {
      const response = await getLetterList(userId); // 현재 사용자의 편지 목록만 가져옴
      setLetters(response.data);
      setIsOpen(true); // 편지함을 열어줌
    } catch (error) {
      console.error("Failed to fetch letter data:", error);
    }
  };

  // 편지 선택
  const selectLetter = () => {
    if (letters.length > 0) {
      setDisplayedLetter(letters[currentIndex]);
      setIsOpen(false); // 편지를 선택하면 편지함을 닫음
    }
  };

  // 편지 조회
  useEffect(() => {
    if (userId && isOpen) {
      // userId가 있고 편지함이 열려있을 때만 실행
      const fetchLetters = async () => {
        try {
          const response = await getLetterList(userId); // userId를 이용하여 편지 목록 가져오기
          setLetters(response.data);
        } catch (error) {
          console.error("Failed to fetch letter data:", error);
        }
      };

      fetchLetters();
    }
  }, [userId, isOpen]); // userId나 isOpen가 변경될 때마다 실행

  // 다음버튼
  const nextLetter = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % letters.length);
  };

  // 이전
  const prevLetter = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + letters.length) % letters.length);
  };

  return (
    <div>
      {/* <img src="/images/sendLetter/table.jpg" alt="책상 이미지" className="table" /> */}
      <img
        src={isOpen ? "/images/sendLetter/open.png" : "/images/sendLetter/close.png"}
        alt="편지함"
        className="mailbox"
        onClick={() => setIsOpen((prev) => !prev)} // 이미지 클릭 시 isOpen 상태를 반전시킴
      />
      {isOpen && (
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
          <h2>{displayedLetter.reception_status === 'sending' ? '보낸 편지' : '받은 편지'}</h2>
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
      <img src="/images/sendLetter/FountainPen.png" alt="만년필" className="FountainPen" />
      {/* 전송 버튼 */}
      <img src="/images/sendLetter/paperAirplane.png" alt="종이비행기" className="paperAirplane" onClick={handleSendLetter} />
    </div>
  );
};

export default SendLetter;
