import React, { useEffect, useState } from 'react';
import './LetterPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLetterList } from '../../apis/letterApi';  // API 함수 임포트

export function LetterPage() {
  const [letters, setLetters] = useState([]);
  const [hasUnreadLetters, setHasUnreadLetters] = useState(false);
  const location = useLocation();
  const { characterId, name } = location.state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 창의 열림/닫힘 상태를 저장할 상태
  const [letterContent, setLetterContent] = useState("");  // 선택된 편지 내용을 저장할 상태
  const navigate = useNavigate();  // 페이지 이동을 위한 useNavigate 훅

  useEffect(() => {
    // 편지 목록을 가져오는 함수
    const fetchLetters = async (characterId) => {
      try {
        const response = await getLetterList(characterId);  // API 호출로 편지 목록 가져오기
        const sortedLetters = response.data.sort((a, b) => new Date(b.received_at) - new Date(a.received_at));  // 최신순으로 정렬
        setLetters(sortedLetters);  // 정렬된 편지 목록 상태 업데이트

        console.log("fetchLetters response:", sortedLetters);

        // 읽지 않은 편지가 있는지 여부 확인
        const unreadExists = sortedLetters.some(letter => letter.reception_status === 'receiving' && !letter.read_status);
        setHasUnreadLetters(unreadExists);  // 상태 업데이트
      } catch (error) {
        console.error("Failed to fetch letter data:", error);  // 에러 처리
      }
    };

    fetchLetters(characterId);  // 편지 목록 가져오기
  }, [characterId]);

  useEffect(() => {
    // 읽지 않은 편지가 있는지 여부 확인
    const unreadExists = letters.some(letter => letter.reception_status === 'receiving' && !letter.read_status);
    setHasUnreadLetters(unreadExists);  // 상태 업데이트
  }, [letters]);

  // 모달 창 열림/닫힘을 토글하는 함수
  const toggleModal = () => {
    if (!isModalOpen) {
      // 가장 최근에 온 편지 찾기
      console.log("before set modal is open", isModalOpen);

      const latestLetter = letters.filter(letter => letter.reception_status === 'receiving')[letters.filter(letter => letter.reception_status === 'receiving').length - 1];
      setLetterContent(latestLetter ? latestLetter.letter_content : "No new letters");  // 편지 내용 상태 업데이트
    }
    setIsModalOpen(!isModalOpen);  // 모달 창 상태 토글
    console.log("after set modal open: ", isModalOpen);
  };

  // "답장하기" 버튼 클릭 시 호출되는 함수
  const handleReply = () => {
    navigate('/SendLetter');  // /SendLetter 페이지로 이동
  };

  return (
    <>
      <div className='homeButton'>
        <HomeButtonContainer />  {/* 홈 버튼 컨테이너 컴포넌트 */}
      </div>

      <div className='letterContainer'>
        <LetterImage shake={hasUnreadLetters} onClick={toggleModal} />  {/* 편지 이미지 컴포넌트 */}
        <ButtonContainer characterId={characterId} name={name}/>  {/* 버튼 컨테이너 컴포넌트 */}

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
        }, 700);  // 0.7초 동안 멈춤
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
    <>
      <div className='letterImage'>
        <img src="/images/letterPage/letter_image.png" alt="Letter Image" onClick={onClick} />
      </div>
    </>
  );
}

function ButtonContainer({ characterId, name }) {

  const navigate = useNavigate();

  const handleClick = (path) => {
    console.log("레터페이지 캐릭아이디 : " + name)
    navigate(path, { state: { characterId, name } });
  };

  return (
    <div className='buttonContainer'>
      <div onClick={() => handleClick("/SendLetter")}>
        <LetterButton name="편지쓰기" />
      </div>
      <div onClick={() => handleClick("/inbox")}>
        <LetterButton name="편지함" />
      </div>
      {/* <div onClick={() => handleClick("/outbox")}>
        <LetterButton name="보낸 편지함" />
      </div>
      <LetterButton name="뒤로가기" onClick={returnHandler} /> */}
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

// 홈 버튼 컨테이너 컴포넌트
function HomeButtonContainer() {
  return (
    <div className='homeButton'>
        <HomeButton name="Persona Letter" />
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

const writeLetterHandler = () => {
  console.log('Write Letter');
}

const letterHistoryHandler = () => {
  console.log('Letter History');
}

const returnHandler = () => {
  console.log('Return');
}
