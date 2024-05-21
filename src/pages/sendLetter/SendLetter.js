import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLetterList, writeLetter, updateStatusLetter } from "../../apis/letterApi";
import { getCharacterName } from "../../apis/characterApi";
import "./SendLetter.css";

const SendLetter = () => {
  const [letterContent, setLetterContent] = useState("");
  const [displayedLetter, setDisplayedLetter] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [letters, setLetters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { characterId } = location.state || {};

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    if (characterId) {
      fetchCharacterName(characterId);
    }
  }, [characterId]);

  const fetchCharacterName = async (characterId) => {
    try {
      const characterName = await getCharacterName(characterId); // 캐릭터 이름을 가져오는 API 호출
      setName(characterName); // 가져온 이름을 상태에 저장
      console.log("Fetched character name:", characterName);
    } catch (error) {
      console.error("Failed to fetch character name:", error);
    }
  };

  const handleInputChange = (event) => {
    setLetterContent(event.target.value);
  };

  console.log("characterId: ", characterId);
  console.log("characterName: ", name);

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
        console.log(data)
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

  const HomeButtonContainer = () => {
    return (
      <div className='homeButton'>
          <HomeButton name="Persona Letter" />
      </div>
    )
  }

  const HomeButton = ({ name, onClick }) => {
    const navigate = useNavigate();
    const handleClick = () => {
      navigate('/');
    } 
    return (
      <div className='homeButton' onClick={handleClick}>
        {name}
      </div>
    );
  }

  return (
    <div>
      <HomeButtonContainer />
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
        <div className="charName">
          To. {name}
        </div>
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
