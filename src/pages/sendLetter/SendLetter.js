import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLetterList, writeLetter, updateStatusLetter } from "../../apis/letterApi";
import { getCharacterName } from "../../apis/characterApi";
import { ButtonContainer, HomeButton } from "../letterPage/LetterPage";
import "./SendLetter.css";

// 편지 작성 페이지
// 캐릭터에게 편지를 쓸 수 있는 페이지이며 편지함을 눌러서 보내고 받은 편지를 확인 가능, ? 아이콘 누를 시 가이드 제공

const SendLetter = () => {
  const [letterContent, setLetterContent] = useState("");
  const [displayedLetter, setDisplayedLetter] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [letters, setLetters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);  // 튜토리얼은 기본적으로 숨김 ?아이콘 누를 시 활성화
  const navigate = useNavigate();
  const location = useLocation();
  const { characterId } = location.state || {};

  useEffect(() => {
    // userId를 받아옴
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    // 캐릭터 아이디가 존재하면 캐릭터 이름을 받아옴
    if (characterId) {
      fetchCharacterName(characterId);
    }
  }, [characterId]);

  // 캐릭터 이름 가져오기
  const fetchCharacterName = async (characterId) => {
    try {
      const characterName = await getCharacterName(characterId); // 캐릭터 이름을 가져오는 API 호출
      setName(characterName); // 가져온 이름을 상태에 저장
      console.log("Fetched character name:", characterName);
    } catch (error) {
      console.error("Failed to fetch character name:", error);
    }
  };

  // 작성한 편지의 데이터 전송
  const handleInputChange = (event) => {
    setLetterContent(event.target.value);
  };

  // console.log("characterId: ", characterId);
  // console.log("characterName: ", name);

  // 편지 작성
  const handleSendLetter = async () => {
    if (letterContent.trim() === "") {
      alert("편지 내용을 작성해 주세요.");
      return;
    }
    
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
        // console.log(data)
        await writeLetter(data);
      } catch (error) {
        alert("전송 실패:", error.message);
      }
    }
  };

  // 편지함에서 편지 선택
  const selectLetter = async () => {
    if (letters.length > 0) {
      const selectedLetter = letters[currentIndex];
      setDisplayedLetter(selectedLetter);

      // 만약 read_status가 0인 편지를 선택시 read_status가 1로 변경됨
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

  // 편지함 닫기
  const closeLetter = () => {
    setDisplayedLetter(null);
  };

  useEffect(() => {
    if (characterId && isOpen) {
      const fetchLetters = async () => {
        try {
          const response = await getLetterList(characterId);
          setLetters(response.data);
        } catch (error) {
          console.error("Failed to fetch letter data:", error);
        }
      };

      fetchLetters();
    }
  }, [userId, characterId, isOpen]);

  // 다음편지
  const nextLetter = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % letters.length);
  };

  // 이전편지
  const prevLetter = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + letters.length) % letters.length);
  };

  // 튜토리얼 닫기
  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  // 튜토리얼 열기
  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleClickHeader = () => {
    navigate('/');
  } 

  return (
    <div>
      {/* <button className="tutorialButton" onClick={handleShowTutorial}>?</button> */}
      <img src="/images/sendLetter/helpIcon.png" alt="도움말" className="helpIcon" onClick={handleShowTutorial} />
      {showTutorial && (
        <div className="tutorialOverlay">
          <div>
            <button className="closeTutorial" onClick={handleCloseTutorial}>X</button>
          </div>
          <div className="highlight mailboxHighlight"/>
            <img src="/images/sendLetter/Arrow1.png" alt="편지함 화살표" className="arrow1"/>
            <p className="mailboxHighlightText">주고 받은 편지를 확인 할 수 있어요</p>
          <div className="highlight letterHighlight">
            <p>캐릭터에게 편지를 작성할 수 있어요</p>
          </div>
          <div className="highlight sendHighlight"/>
            <img src="/images/sendLetter/Arrow2.png" alt="편지함 화살표" className="arrow2"/>
            <p className="sendHighlightText">작성한 편지를 전송할 수 있어요</p>
        </div>
      )}
      <div className="header_send" onClick={handleClickHeader}>
          <h1 className="header-title_send">Persona Letter</h1>
      </div>
      <img
        src={isOpen ? "/images/sendLetter/opened_envelope.png" : "/images/sendLetter/closed_envelope.png"}
        alt="편지함"
        className="mailbox"
        onClick={() => setIsOpen((prev) => !prev)}
      />
      {isOpen && !displayedLetter && (
        <>
          <div className="letterCard">
            {letters.length > 0 ? (
              <div>
                <p>{letters[currentIndex].letter_content}</p>
              </div>
            ) : (
              <p>편지가 존재하지 않습니다.</p>
            )}
          </div>
          <div className="cardButtons">
            <button onClick={prevLetter}>{"<"}</button>
            <button onClick={selectLetter}>선택</button>
            <button onClick={nextLetter}>{">"}</button>
          </div>
        </>
      )}
      {displayedLetter && (
        <>
          <div className="displayedLetter">
            <button className="closeButton" onClick={closeLetter}>×</button>
            <h2>{displayedLetter.reception_status === 'sending' ? '보낸 편지' : '받은 편지'}</h2>
            <p>{displayedLetter.letter_content}</p>
          </div>
        </>
      )}
      <div className="sendLetterContainer">
      {/* <div className="charNameContainer">
        <div className="charName">
          To. {name}
        </div>
      </div> */}
      <textarea
        className="letter"
        value={letterContent}
        onChange={handleInputChange}
      />
    </div>
      {/* <img src="/images/sendLetter/FountainPen.png" alt="만년필" className="FountainPen" /> */}
      {/* <img src="/images/sendLetter/send.png" alt="종이비행기" className="send" onClick={handleSendLetter} /> */}
      <div className="send"onClick={handleSendLetter} >Send</div>
    </div>
  );
};

export default SendLetter;
