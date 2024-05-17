import React, { useEffect, useState } from 'react';
import './LetterPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { getLetterList } from '../../apis/letterApi';  // API 함수 임포트

export function LetterPage() {
  const [letters, setLetters] = useState([]);  // 편지 목록을 저장할 상태
  const [hasUnreadLetters, setHasUnreadLetters] = useState([]);  // 읽지 않은 편지가 있는지 여부를 저장할 상태
  const [userId, setUserId] = useState("");  // 사용자 ID를 저장할 상태
  const [characterId, setCharacterId] = useState("");  // 캐릭터 ID를 저장할 상태
  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 창의 열림/닫힘 상태를 저장할 상태
  const [letterContent, setLetterContent] = useState("");  // 선택된 편지 내용을 저장할 상태
  const navigate = useNavigate();  // 페이지 이동을 위한 useNavigate 훅

  useEffect(() => {
    // 로컬 스토리지에서 userId와 characterId 가져오기
    const storedUserId = localStorage.getItem("userId");
    const storedCharacterId = localStorage.getItem("characterId");
    setUserId(storedUserId);
    setCharacterId(storedCharacterId);

    // 편지 목록을 가져오는 함수
    const fetchLetters = async (characterId) => {
      try {
        const response = await getLetterList(characterId);  // API 호출로 편지 목록 가져오기
        setLetters(response.data);  // 편지 목록 상태 업데이트

        console.log("fetchLetters response:");
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch letter data:", error);  // 에러 처리
      }
    };

    fetchLetters(storedCharacterId);  // 편지 목록 가져오기

    // 읽지 않은 편지가 있는지 여부 확인
    setHasUnreadLetters(letters.some(letter => letter.reception_status === 'receiving' && !letter.read_status));
  }, [letters]);

  useEffect(() => {
    // 읽지 않은 편지가 있는지 여부 확인
    const unreadExists = letters.some(letter => letter.reception_status === 'receiving' && !letter.read_status);
    setHasUnreadLetters(unreadExists);  // 상태 업데이트
  }, [letters]);

  // 모달 창 열림/닫힘을 토글하는 함수
  const toggleModal = () => {
    if (!isModalOpen) {
      // 가장 최근에 온 편지 찾기
      const latestLetter = letters
        .filter(letter => letter.reception_status === 'receiving')
        .sort((a, b) => new Date(b.received_at) - new Date(a.received_at))[0];
      setLetterContent(latestLetter ? latestLetter.letter_content : "No new letters");  // 편지 내용 상태 업데이트
    }
    setIsModalOpen(!isModalOpen);  // 모달 창 상태 토글
  };

  // "답장하기" 버튼 클릭 시 호출되는 함수
  const handleReply = () => {
    navigate('/SendLetter');  // /SendLetter 페이지로 이동
  };

  return (
    <>
      <div className='homeButton'>
        <HomeButtonContainer/>  {/* 홈 버튼 컨테이너 컴포넌트 */}
      </div>
      <div className='letterContainer'>
        <LetterImage shake={hasUnreadLetters} onClick={toggleModal} />  {/* 편지 이미지 컴포넌트 */}
        <ButtonContainer />  {/* 버튼 컨테이너 컴포넌트 */}
        {isModalOpen && (  // 모달 창이 열려있을 때
          <Modal onClose={toggleModal}>
            <div className="modalContent">
              <div className="paper">
                {letterContent}  {/* 편지 내용 표시 */}
                <button onClick={handleReply}>답장하기</button>  {/* 답장하기 버튼 */}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}

export default LetterPage;

// 편지 이미지 컴포넌트
function LetterImage({ shake, onClick }) {
  const [cycleCount, setCycleCount] = useState(0);  // 애니메이션 반복 횟수 상태
  const maxCycles = 3;  // 최대 반복 횟수 설정

  useEffect(() => {
    const img = document.querySelector('.letterImage img');  // 편지 이미지 요소 선택

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
          }, 10);  // 브라우저 재렌더링을 위해 약간의 딜레이
        }, 700);  // 0.5초 동안 멈춤
      }
    };

    if (shake) {
      img.addEventListener('animationend', handleAnimationEnd);  // 애니메이션 종료 시 이벤트 핸들러 추가
      img.style.animationName = 'shake';
      img.style.animationDuration = '0.7s';
      img.style.animationTimingFunction = 'ease-in-out';
      img.style.animationIterationCount = '1';
      img.style.animationFillMode = 'forwards';
    } else {
      img.style.animation = 'none';
      setCycleCount(0);  // 애니메이션 중지 시 cycleCount 초기화
    }

    return () => {
      img.removeEventListener('animationend', handleAnimationEnd);  // 이벤트 핸들러 제거
    };
  }, [shake, cycleCount]);

  return (
    <div className='letterImage' onClick={onClick}>
      <img src="/images/letterPage/letter_image.png" alt="Letter Image" />
    </div>
  );
}

// 모달 컴포넌트
function Modal({ children, onClose }) {
  return (
    <div className="modalOverlay">
      <div className="modal">
        {children}
      </div>
      <div className="modalBackground" onClick={onClose}></div>
    </div>
  );
}

// 버튼 컨테이너 컴포넌트
function ButtonContainer() {
  return (
    <div className='buttonContainer'>
      <Link to="/SendLetter">
        <LetterButton name="편지 작성" />
      </Link>
      <Link to="/inbox">
        <LetterButton name="편지함" />
      </Link>
    </div>
  );
}

// 홈 버튼 컨테이너 컴포넌트
function HomeButtonContainer(){
  return(
    <div className='homeButton'>
      <Link to="/">
        <HomeButton name="Persona Letter"/>
      </Link>
    </div>
  )
}

// 편지 버튼 컴포넌트
export const LetterButton = ({ name, onClick }) => {
  return (
    <button className='letterButton' onClick={onClick}>
      {name}
    </button>
  );
}

// 홈 버튼 컴포넌트
export const HomeButton = ({ name, onClick }) => {
  return (
    <button className='homeButton' onClick={onClick}>
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
