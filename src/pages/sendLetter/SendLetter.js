import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLetterList, writeLetter, updateStatusLetter } from "../../apis/letterApi";
import { getCharacterName } from "../../apis/characterApi";
import { ButtonContainer, HomeButton } from "../letterPage/LetterPage";
import "./SendLetter.css";

const SendLetter = () => {
  const [letterContent, setLetterContent] = useState("");
  const [displayedLetter, setDisplayedLetter] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [letters, setLetters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [showTutorialBeforeOpen, setShowTutorialBeforeOpen] = useState(false);
  const [showTutorialAfterOpen, setShowTutorialAfterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { characterId } = location.state || {};

  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Nanum+Brush+Script&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    if (characterId) {
      fetchCharacterName(characterId);
    }
  }, [characterId]);

  const fetchCharacterName = async (characterId) => {
    try {
      const characterName = await getCharacterName(characterId);
      setName(characterName);
      console.log("Fetched character name:", characterName);
    } catch (error) {
      console.error("Failed to fetch character name:", error);
    }
  };

  const handleInputChange = (event) => {
    setLetterContent(event.target.value);
  };

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
        await writeLetter(data);
      } catch (error) {
        alert("전송 실패:", error.message);
      }
    }
  };

  const selectLetter = async () => {
    if (letters.length > 0) {
      const selectedLetter = letters[currentIndex];
      setDisplayedLetter(selectedLetter);

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

  const nextLetter = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % letters.length);
  };

  const prevLetter = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + letters.length) % letters.length);
  };

  const handleCloseTutorialBeforeOpen = () => {
    setShowTutorialBeforeOpen(false);
  };

  const handleShowTutorialBeforeOpen = () => {
    setShowTutorialBeforeOpen(true);
  };

  const handleCloseTutorialAfterOpen = () => {
    setShowTutorialAfterOpen(false);
  };

  const handleShowTutorialAfterOpen = () => {
    setShowTutorialAfterOpen(true);
  };

  const handleClickHeader = () => {
    navigate('/');
  } 

  const handleClearContent = () => {
    setLetterContent("");
  };
  
  const isKorean = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);

  useEffect(() => {
    const letterTextarea = document.querySelector('.letter');
    const letterCard = document.querySelector('.letterCard');

    if (letterTextarea) {
      if (isKorean(letterContent)) {
        letterTextarea.classList.add('korean');
      } else {
        letterTextarea.classList.remove('korean');
      }
    }

    if (letterCard) {
      if (letters.length > 0 && isKorean(letters[currentIndex].letter_content)) {
        letterCard.classList.add('korean');
      } else {
        letterCard.classList.remove('korean');
      }
    }
  }, [letterContent, letters, currentIndex]);

  return (
    <div>
      <img src="/images/sendLetter/helpIcon.png" alt="도움말" className="helpIcon" onClick={isOpen ? handleShowTutorialAfterOpen : handleShowTutorialBeforeOpen} />
      {showTutorialBeforeOpen && !isOpen && (
        // 편지함 닫혔을 때 도움말 내용
        <div className="tutorialOverlay">
          <div>
            <button className="closeTutorial" onClick={handleCloseTutorialBeforeOpen}>X</button>
          </div>
          <div className="helpText mailboxTutorial"/>
            <img src="/images/sendLetter/Arrow1.png" alt="편지함 화살표" className="beforeArrow1"/>
            <p className="beforeMailboxHelpText">주고 받은 편지를 확인 할 수 있어요</p>
            <div className="helpText beforeLetterPaper">
              <p>캐릭터에게 편지를 작성할 수 있어요</p>
            </div>
          <div className="helpText beforeSendHelp"/>
            <img src="/images/sendLetter/Arrow2.png" alt="편지함 화살표" className="beforeArrow2"/>
            <p className="beforeSendHelpText">작성한 편지를 전송하거나 지울 수 있어요</p>
        </div>
      )}
      {showTutorialAfterOpen && isOpen && (
        <div className="tutorialOverlay">
        <div>
          <button className="closeTutorial" onClick={handleCloseTutorialAfterOpen}>X</button>
        </div>
        {/* 편지함이 열렸을 때의 도움말 내용 */}
        <div className="helpText mailboxTutorial"/>
        <img src="/images/sendLetter/Arrow3.png" alt="편지함 화살표" className="afterArrow1"/>
        <p className="afterMailboxHelpText">편지함을 열고 닫을 수 있습니다</p>
        <div className="helpText afterLetterPaper">
          <p>캐릭터에게 편지를 작성할 수 있어요</p>
        </div>
        <div className="helpText afterLetters">
          <p>주고 받은 편지를 확인할 수 있어요</p>
        </div>
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
      <div className={`sendLetterContainer ${isOpen ? 'right-15' : 'right-50'}`}>
      <textarea
        className="letter"
        value={letterContent}
        onChange={handleInputChange}
      />
    </div>
      {!isOpen && (
        <>
          <div className="send" onClick={handleSendLetter}>Send a letter</div>
          <div className="clear_letter" onClick={handleClearContent}>Clear the content</div>
        </>
      )}
    </div>
  );
};

export default SendLetter;
