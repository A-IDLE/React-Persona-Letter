import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLetterList, writeLetter, updateStatusLetter } from "../../apis/letterApi";
import "./SendLetter.css";

const SendLetter = () => {
  const [letterContent, setLetterContent] = useState("");
  const [displayedLetter, setDisplayedLetter] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [letters, setLetters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState("");
  // const [characterId, setCharacterId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { characterId } = location.state || {};

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    // const storedChId = localStorage.getItem("characterId");
    setUserId(storedUserId);
    // setCharacterId(storedChId);
  }, []);

  const handleInputChange = (event) => {
    setLetterContent(event.target.value);
  };


  console.log("characterId: ", characterId);


  const handleSendLetter = async () => {

    console.log("characterId: ", characterId);  
    if (window.confirm("전송")) {
      try {
        alert("편지가 전송되었습니다.");
        navigate("/sending", { state: { characterId } });

        const data = {
          character_id: characterId,
          user_id: userId,
          letter_content: letterContent,
          reception_status: "sending",
          read_status: true,
        };
        console.log(data.read_status)
        await writeLetter(data);
      } catch (error) {
        alert("전송 실패:", error.message);
      }
    }
  };

  // 편지 선택
  const selectLetter = async() => {
    if (letters.length > 0) {
      const selectedLetter = letters[currentIndex];
      setDisplayedLetter(selectedLetter);

      // 편지가 선택되면 read_status를 True로 업데이트
      if (!selectedLetter.read_status) {
        try {
          await updateStatusLetter(selectedLetter.letter_id);
          setLetters(prevLetters => 
            prevLetters.map(letter => 
              letter.letter_id === selectedLetter.letter_id ? { ...letter, read_status: true } : letter
            )
          );
        } catch (error) {
          console.error("Failed to update letter status:", error);
        }
      }
    }
  };

  const closeLetter = () => {
    setDisplayedLetter(null);
  };

  const changeLetter = () => {
    closeLetter();
    setIsOpen(true);
  };

  useEffect(() => {
    if (characterId && isOpen) {
      const fetchLetters = async () => {
        try {
          const response = await getLetterList(characterId); // userId를 이용하여 편지 목록 가져오기
          setLetters(response.data);
          console.log(characterId)
          console.log(response)
        } catch (error) {
          console.error("Failed to fetch letter data:", error);
        }
      };

      fetchLetters();
    }
  }, [userId, characterId, isOpen]);

  const nextLetter = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % letters.length);
  };

  const prevLetter = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + letters.length) % letters.length);
  };

  return (
    <div className="letterContainer">
      <img
        src={isOpen ? "/images/sendLetter/opened_envelope.png" : "/images/sendLetter/closed_envelope.png"}
        alt="편지함"
        className="mailbox"
        onClick={() => setIsOpen((prev) => !prev)}
      />
      {isOpen && (
        <div className="letterCard">
          {letters.length > 0 && (
            <div>
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
          <h2>{displayedLetter.reception_status === 'sending' ? '보낸 편지' : '받은 편지'}</h2>
          <p>{displayedLetter.letter_content}</p>
          <button onClick={closeLetter}>닫기</button>
          <button onClick={changeLetter}>변경</button>
        </div>
      )}
      <div>
        {/* 편지 작성 */}
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
  );
};

export default SendLetter;
