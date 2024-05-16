import React, { useEffect, useState } from 'react';
import './LetterPage.css';
import { Link } from 'react-router-dom';
import { getLetterList } from '../../apis/letterApi';  // API 함수 임포트

export function LetterPage() {
  const [letters, setLetters] = useState([]);
  const [hasUnreadLetters, setHasUnreadLetters] = useState(false);
  const [userId, setUserId] = useState("");
  const [characterId, setCharacterId] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedCharacterId = localStorage.getItem("characterId");
    setUserId(storedUserId);
    setCharacterId(storedCharacterId);

    const fetchLetters = async (characterId) => {
      try {
        const response = await getLetterList(characterId);
        setLetters(response.data);

        console.log("fetchLetters response:")
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch letter data:", error);
      }
    };

    fetchLetters(storedCharacterId);

    // reception_status가 'receiving'이고 read_status가 false인 편지가 있는지 확인
    setHasUnreadLetters(letters.some(letter => letter.reception_status === 'receiving' && !letter.read_status))
  }, []);





  return (
    <div className='letterContainer'>
      <LetterImage shake={hasUnreadLetters} />
      <ButtonContainer />
    </div>
  );
}

export default LetterPage;

function LetterImage({ shake }) {
  const [cycleCount, setCycleCount] = useState(0);
  const maxCycles = 3; // 최대 반복 횟수 설정

  useEffect(() => {
    const img = document.querySelector('.letterImage img');

    const handleAnimationEnd = () => {
      if (shake && cycleCount < maxCycles) {
        setTimeout(() => {
          setCycleCount(cycleCount + 1);
          img.style.animation = 'none';
          // 재설정 후 애니메이션 다시 시작
          setTimeout(() => {
            img.style.animation = '';
            img.style.animationName = 'shake';
            img.style.animationDuration = '0.7s';
            img.style.animationTimingFunction = 'ease-in-out';
            img.style.animationIterationCount = '4';
            img.style.animationFillMode = 'forwards';
          }, 10); // 브라우저 재렌더링을 위해 약간의 딜레이
        }, 700); // 0.5초 동안 멈춤
      }
    };

    if (shake) {
      img.addEventListener('animationend', handleAnimationEnd);
      img.style.animationName = 'shake';
      img.style.animationDuration = '0.7s';
      img.style.animationTimingFunction = 'ease-in-out';
      img.style.animationIterationCount = '1';
      img.style.animationFillMode = 'forwards';
    } else {
      img.style.animation = 'none';
      setCycleCount(0); // 애니메이션 중지 시 cycleCount 초기화
    }

    return () => {
      img.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [shake, cycleCount]);

  return (
    <>
      <div className='letterImage'>
        <img src="/images/letterPage/letter_image.png" alt="Letter Image" />
      </div>
    </>
  );
}

function ButtonContainer() {
  return (
    <div className='buttonContainer'>
      <Link to="/SendLetter">
        <LetterButton name="편지쓰기" />
      </Link>
      <Link to="/inbox">
        <LetterButton name="받은 편지함" />
      </Link>
      <Link to="/outbox">
        <LetterButton name="보낸 편지함" />
      </Link>
      <LetterButton name="뒤로가기" onClick={returnHandler} />
    </div>
  );
}

export const LetterButton = ({ name, onClick }) => {
  return (
    <button className='letterButton' onClick={onClick}>
      {name}
    </button>
  );
}

const writeLetterHandler = () => {
  console.log('Write Letter');
}

const letterHistoryHandler = () => {
  console.log('Letter History');
}

const returnHandler = () => {
  console.log('Return');
}
