import React, { useEffect, useState } from 'react';
import './InputInfo.css';
import { updateUser, getUserInfo, updateUserNickname } from '../../apis/letterApi';
import { useNavigate, useLocation } from 'react-router-dom';

function Inputinfo() {
    const [userName, setUserName] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [tokenData, setTokenData] = useState(null);
    const [currentSection, setCurrentSection] = useState(0);
    const [reverse, setReverse] = useState(false);  // 애니메이션 방향을 관리하는 상태
    const [userNickname, setUserNickname] = useState('');
    const [newUserNickname, setNewUserNickname] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { characterId } = location.state || {}; // characterId 가져오기

    console.log("characterId: ", characterId);

    useEffect(() => {

        // 폰트 로드
        const link = document.createElement('link');
        link.href = "https://fonts.googleapis.com/css2?family=Nanum+Brush+Script&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        const token = localStorage.getItem("accessToken");

        if (token) {
            const tokenData = { accessToken: token };
            setTokenData(tokenData);

            getUserInfo().then(response => {
                const fetchedUserName = response.data.name || response.data.email;
                setUserName(fetchedUserName);
                setNewUserName(fetchedUserName); // 초기 newUserName을 가져온 userName으로 설정
                const fetchedUserNickname = response.data.nickname || '';
                setUserNickname(fetchedUserNickname);
                setNewUserNickname(fetchedUserNickname); // 초기 newUserNickname을 가져온 userNickname으로 설정
            }).catch(error => {
                console.error("Error fetching user info:", error);
            });
        }
    }, []);

    useEffect(() => {
        const isKorean = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
        const nameInput = document.querySelector('.name_input');
        const nicknameInput = document.querySelector('.nickname_input');

        if (nameInput) {
            if (isKorean(newUserName || userName)) {
                nameInput.classList.add('korean');
            } else {
                nameInput.classList.remove('korean');
            }
        }

        if (nicknameInput) {
            if (isKorean(newUserNickname || userNickname)) {
                nicknameInput.classList.add('korean');
            } else {
                nicknameInput.classList.remove('korean');
            }
        }
    }, [newUserName, userName, newUserNickname, userNickname]);

    const handleUpdateUserInfo = async () => {
        if (tokenData) {
            const nameToUpdate = newUserName || userName;
            const nicknameToUpdate = newUserNickname || userNickname;
            try {
                const nameResponse = await updateUser(tokenData, nameToUpdate);
                setUserName(nameToUpdate);
                setNewUserName('');

                const nicknameResponse = await updateUserNickname(tokenData, nicknameToUpdate);
                setUserNickname(nicknameToUpdate);
                setNewUserNickname('');
                alert("Your letter has been received.");

                navigate('/LetterPage', { state: { characterId } });  // characterId를 그대로 전달
            } catch (error) {
                alert('Error updating user information.');
            }
        }
    };

    const goToNextSection = () => {
        if (currentSection < 2) {
            setReverse(false);  // 다음 섹션으로 이동 시 역방향 애니메이션 사용 안 함
            setCurrentSection(currentSection + 1);
        }
    };

    const goToPreviousSection = () => {
        if (currentSection > 0) {
            setReverse(true);  // 이전 섹션으로 이동 시 역방향 애니메이션 사용
            setCurrentSection(currentSection - 1);
        }
    };

    const handleClickHeader = () => {
      navigate('/');
    } 

    return (
        
        <section className={`input_wrapper section-${currentSection} ${reverse ? 'reverse' : ''}`}>
            <div className="header_info" onClick={handleClickHeader}>
                <h1 className="header-title_info">Persona Letter</h1>
            </div>
            <div className='letter_cover_section'>
                <div className='letter_cover_img' style={{backgroundImage: "url('/images/info/cover_img2.jpg')"}}></div>
                <div className='letter_cover_text_container'>
                    <div className='letter_cover_text'>
                        From Persona Letter
                    </div>
                    {currentSection === 0 && (
                        <div className='next_button'>
                            <img src='/images/info/next_button.png' className='next_button_img' onClick={goToNextSection}></img>
                        </div>
                    )}
                </div>
            </div>
            <div className='info_letter_section'>
                <div className='info_letter_text'>
                    Dear {userName}.<br /><br /><br />
                    The moment of writing a first letter always feels a bit strange, but in a good way.<br />
                    It's truly an honor for us, Persona Letter, to share this moment with you.<br /><br />
                    
                    You are going to have a special experience communicating with your favorite characters.<br />
                    They are expecting to hear your stories and ready to share their stories from different worlds, times, and places.<br /><br />
                    
                    While feeling a bit nervous, we do know where to begin.<br />                
                    So, under what name should We inform the characters the letter is from?<br /><br /><br />
                </div>
                {currentSection === 1 && (
                    <>
                    <div className='prev_button'>
                        <img src='/images/info/prev_button.png' className='prev_button_img' onClick={goToPreviousSection}></img>
                    </div>                    
                    <div className='next_button'>
                        <img src='/images/info/next_button.png' className='next_button_img' onClick={goToNextSection}></img>
                    </div>
                    </>
                )}
            </div>
            <div className='info_input_section' style={{backgroundImage: "url('/images/info/post_card2.PNG')"}}>
                <div className='info_input_text'>
                    Name : 
                    <input
                        className='name_input'
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                    /><br />
                    Nickname : 
                    <input
                        className='nickname_input'
                        type="text"
                        value={newUserNickname}
                        onChange={(e) => setNewUserNickname(e.target.value)}
                    /><br />
                </div>
                <button className='info_reply_button' onClick={handleUpdateUserInfo}>
                    <div className='info_reply_text'>reply</div>
                </button>
                {currentSection === 2 && (
                    <div className='prev_button'>
                        <img src='/images/info/prev_button.png' className='prev_button_img' onClick={goToPreviousSection}></img>
                    </div>
                    )}
            </div>
        </section>
    );
}

export default Inputinfo;
