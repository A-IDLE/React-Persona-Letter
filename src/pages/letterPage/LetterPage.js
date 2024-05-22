import React, { useEffect, useState } from 'react';
import './LetterPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLetterList, updateStatusLetter } from '../../apis/letterApi';  // API 함수 임포트

// 페이지 기능
// 캐릭터한테 편지가 도착해있으면 편지지가 흔들리는데 기준은 read_status가 false면 흔들리고 true면 흔들리지 않음,
// 편지지를 클릭할 시 가장 마지막으로 받은 편지가 화면에 출력되며, 그 편지는 read_status를 false(안읽은상태)에서true(읽은상태)로 바꿔줌

export function LetterPage() {
  const [letters, setLetters] = useState([]);
  const [hasUnreadLetters, setHasUnreadLetters] = useState(false);
  const location = useLocation();
  const { characterId, name } = location.state || {}; // 여기서 name은 캐릭터 이름을 의미함

  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 창의 열림/닫힘 상태를 저장할 상태
  const [letterContent, setLetterContent] = useState("");  // 선택된 편지 내용을 저장할 상태
  const navigate = useNavigate();  // 페이지 이동을 위한 useNavigate 훅

  // reception_status이 receiving이면서 read_status가 false인 편지
  const checkUnreadLetters = (letters) => {
    const unreadExists = letters.some(letter => letter.reception_status === 'receiving' && !letter.read_status);
    setHasUnreadLetters(unreadExists);  // 상태 업데이트
  };

  // 캐릭터가 변경 될 때 실행되는 useEffect
  useEffect(() => {
    // 편지 목록을 가져오는 함수
    const fetchLetters = async (characterId) => {
      try {
        const response = await getLetterList(characterId);  // API 호출로 편지 목록 가져오기
        const sortedLetters = response.data.sort((a, b) => new Date(b.received_at) - new Date(a.received_at));  // 최신순으로 정렬
        setLetters(sortedLetters);  // 정렬된 편지 목록 상태 업데이트

        console.log("fetchLetters response:", sortedLetters);

        checkUnreadLetters(sortedLetters);  // 읽지 않은 편지가 있는지 여부 확인
      } catch (error) {
        console.error("Failed to fetch letter data:", error);  // 에러 처리
      }
    };

    fetchLetters(characterId);  // 편지 목록 가져오기
  }, [characterId]);

  // 편지가 변동될 때 실행되는 useEffect
  // 편지의 개수가 동일하면 실행되지 않음
  useEffect(() => {
    checkUnreadLetters(letters);  // 읽지 않은 편지가 있는지 여부 확인
  }, [letters]);

  // 모달 창 열림/닫힘을 토글하는 함수
  const toggleModal = async () => {
    if (!isModalOpen) {
      // 가장 최근에 온 편지 찾기
      console.log("before set modal is open", isModalOpen);

      // 모달창에서 내가 마지막으로 받은 편지를 띄어준다
      const latestLetter = letters.filter(letter => letter.reception_status === 'receiving')[letters.filter(letter => letter.reception_status === 'receiving').length - 1];
      setLetterContent(latestLetter ? latestLetter.letter_content : "No new letters");  // 편지가 없으면 No new letters 출력

      // letter의 id와 latestLetter의 id가 동일할 시 read_status의 상태를 true로 변경함
      // 여기가 편지의 읽음처리를 담당함
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
    console.log("after set modal open: ", isModalOpen);
  };

  // "답장하기" 버튼 클릭 시 호출되는 함수
  const handleReply = () => {
    navigate('/SendLetter', { state: { characterId, name } });  // /SendLetter 페이지로 이동 캐릭터의 id와 이름을 넘겨줌
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
