import React, { useEffect, useState } from 'react';
import './LetterPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLetterList, updateStatusLetter } from '../../apis/letterApi';  // API 함수 임포트

export function LetterPage() {
  const [letters, setLetters] = useState([]);
  const [hasUnreadLetters, setHasUnreadLetters] = useState(false);
  const location = useLocation();
  const { characterId, name } = location.state || {}; // 여기서 name은 캐릭터 이름을 의미함

  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 창의 열림/닫힘 상태를 저장할 상태
  const [letterContent, setLetterContent] = useState("");  // 선택된 편지 내용을 저장할 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();  // 페이지 이동을 위한 useNavigate 훅

  const checkUnreadLetters = (letters) => {
    const unreadExists = letters.some(letter => letter.reception_status === 'receiving' && !letter.read_status);
    setHasUnreadLetters(unreadExists);  // 상태 업데이트
  };

  useEffect(() => {
    // 폰트 로드
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Nanum+Brush+Script&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const fetchLetters = async (characterId) => {
      try {
        const response = await getLetterList(characterId);  // API 호출로 편지 목록 가져오기
        const sortedLetters = response.data.sort((a, b) => new Date(b.received_at) - new Date(a.received_at));  // 최신순으로 정렬
        setLetters(sortedLetters);  // 정렬된 편지 목록 상태 업데이트

        checkUnreadLetters(sortedLetters);  // 읽지 않은 편지가 있는지 여부 확인
      } catch (error) {
        console.error("Failed to fetch letter data:", error);  // 에러 처리
      }
    };

    fetchLetters(characterId);  // 편지 목록 가져오기
  }, [characterId]);

  useEffect(() => {
    checkUnreadLetters(letters);  // 읽지 않은 편지가 있는지 여부 확인
  }, [letters]);

  const toggleModal = async () => {
    if (!isModalOpen) {
      const latestLetter = letters.filter(letter => letter.reception_status === 'receiving')[letters.filter(letter => letter.reception_status === 'receiving').length - 1];
      setLetterContent(latestLetter ? latestLetter.letter_content : "No new letters");

      if (latestLetter && !latestLetter.read_status) {
        try {
          await updateStatusLetter(latestLetter.letter_id);
          setLetters(prevLetters =>
            prevLetters.map(letter =>
              letter.letter_id === latestLetter.letter_id ? { ...letter, read_status: true } : letter
            )
          );
        } catch (error) {
          console.error("Failed to update letter status:", error);
        }
      }
    }

    setIsModalOpen(!isModalOpen);  // 모달 창 상태 토글
  };

  const handleReply = () => {
    navigate('/SendLetter', { state: { characterId, name } });
  };

  // 한글 텍스트 감지 함수
  const isKorean = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);

  return (
    <>
      <div className='homeButton'>
        <HomeButtonContainer />  {/* 홈 버튼 컨테이너 컴포넌트 */}
      </div>

      <div className='letterContainer'>
        <LetterImage shake={hasUnreadLetters} onClick={toggleModal} />  {/* 편지 이미지 컴포넌트 */}
        {/* <ButtonContainer characterId={characterId} name={name} />  버튼 컨테이너 컴포넌트 */}

        {isModalOpen && (  // 모달 창이 열려있을 때
          <Modal onClose={toggleModal}>
            <div className="modalContent">
              <div className={`paper ${isKorean(letterContent) ? 'korean' : ''}`}>
                {letterContent}  {/* 편지 내용 표시 */}
              </div>
            </div>
            <img src="/images/sendLetter/hermione1.png" alt="Letter Image" className='hermione'/>
            <ButtonContainer characterId={characterId} name={name} />  {/* 모달 창 안에 버튼 컨테이너 사용 */}
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

    // 맨처음에 흔들리고 후에 반복해서 흔들리게 하는 효과
    const handleAnimationEnd = () => {
      if (shake && cycleCount < maxCycles) { // shake 가 true 이고 cycleCount가 maxCycle 보다 작을시 애니메이션을 실행함
        setTimeout(() => {
          setCycleCount(cycleCount + 1);
          img.style.animation = 'none';
          // 재설정 후 애니메이션 다시 시작
          setTimeout(() => {
            img.style.animation = ''; // 애니메이션을 기본값으로 재설정
            img.style.animationName = 'shake'; // 애니메이션 이름
            img.style.animationDuration = '0.7s'; // 애니메이션 지속 시간
            img.style.animationTimingFunction = 'ease-in-out'; // 애니메이션 움직임, ease-in-out : 점차빨라짐
            img.style.animationIterationCount = '4'; // 애니메이션 반복 횟수
            img.style.animationFillMode = 'forwards'; // 애니메이션 종료 후 상태, forwards : 끝난후 그 지점에 있음
          }, 10);  // 브라우저 재렌더링을 위해 약간의 딜레이
        }, 700);  // 0.7초 동안 멈춤
      }
    };

    // 맨처음에 shake가 true인지 false인지 판단하고 흔들리는 효과
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

// 버튼 컨테이너 컴포넌트
function ButtonContainer({ characterId, name }) {
  const navigate = useNavigate();

  const handleClick = (path) => {
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
      <HomeButton name="Persona Letter" />
  );
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
  };
  return (
    <div className='homeButton' onClick={handleClick}>
      {name}
    </div>
  );
};

// 리셋 버튼 컴포넌트
export const ResetButton = ({ name, onClick }) => {
  const handleReset = () => {
    console.log("리셋");
    const userConfirmed = window.confirm("캐릭터와의 기억과 편지 내용을 모두 제거하는 버튼입니다. 하시겠습니까?");
    
    if (userConfirmed) {
        // 사용자가 "예"를 선택한 경우 실행할 코드
        console.log("사용자가 예를 선택했습니다.");
        // 여기서 캐릭터와의 기억과 편지 내용을 제거하는 코드를 추가합니다.
    } else {
        // 사용자가 "아니오"를 선택한 경우 실행할 코드
        console.log("사용자가 아니오를 선택했습니다.");
    }
  }

  return (
    <button className='resetButton' onClick={handleReset}>
      {name}
    </button>
  );
}
