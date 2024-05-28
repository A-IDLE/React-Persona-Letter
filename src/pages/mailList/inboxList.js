import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { getLettersByReceptionStatus } from "../../apis/letterApi";
import './inboxList.css'; 
import { Logout } from '../auth/Logout';

// Function to truncate a string with ellipsis if it exceeds a certain length
function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

// Function to format a date and time string
function formatDateTime(isoString) {
    const date = new Date(isoString);
    const options = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    };
    return new Intl.DateTimeFormat('ko-KR', options).format(date).replace(/\./g, '').replace(/ /g, '').replace(/:/g, ':').replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3 ');
}
  
function MailAppInbox() {
    const [letters, setLetters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [CharacterName, setCharacterName] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const { characterId, name } = location.state || {}; // location.state에서 characterId와 name 가져오기

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const characterName = localStorage.getItem("characterName");
        const accessToken = localStorage.getItem("accessToken");
        const receptionStatus = "receiving";
        
        setCharacterName(name);

        console.log("@@@@@User, CharacterID", userId, characterId);
        console.log("character name: ", characterName);

        if (userId && characterId && accessToken) {
            // inboxLetter API를 사용하여 편지 목록을 가져옵니다.
            getLettersByReceptionStatus(characterId, receptionStatus)
              .then(data => {
                  if (Array.isArray(data)) {
                      // 편지 목록을 created_time 기준으로 내림차순 정렬합니다.
                      const sortedLetters = data.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
                      setLetters(sortedLetters);
                      setLoading(false); // 로딩 상태를 해제합니다.
                  } else {
                      console.error("Invalid response format for letters:", data);
                      setLoading(false); // 오류 발생 시 로딩 상태를 해제합니다.
                  }
              })
              .catch(error => {
                  console.error("Fetching letters failed:", error);
                  setLoading(false); // 오류 발생 시 로딩 상태를 해제합니다.
              });
          }
    }, [characterId, name]);

    const handleLetterClick = (letterId) => {
        console.log("clicked letter id:", letterId);
        navigate(`/letter/${letterId}`, { state: { from: 'inbox' } });
    };

    const navigateToOutbox = () => {
        navigate('/outbox', { state: { characterId, name } }); // characterId와 name 함께 전달
    };

    const navigateToInbox = () => {
        navigate('/inbox', { state: { characterId, name } }); // characterId와 name 함께 전달
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClickHeader = () => {
        navigate('/');
    };

    return (
        <div className='inbox_section'>
            <div className="header_inbox" onClick={handleClickHeader}>
                <h1 className="header-title_inbox">Persona Letter</h1>
            </div>            
            <div className="main-container">
                <div className="sidebar">
                    <div className="contact active">{CharacterName}</div>
                    <div className="contact" onClick={navigateToInbox}>Inbox</div>
                    <div className="contact" onClick={navigateToOutbox}>Outbox</div>
                    {/* <div className="menu-item">My page</div> */}
                    <Logout className="menu-item" />
                </div>
                
                <div className="content">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        letters.length === 0 ? (
                            <div>No letters yet.</div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Character</th>
                                        <th>Letter Content</th>
                                        <th>Created Time</th>
                                    </tr>
                                </thead>
                                
                                <tbody>
                                    {letters.map((letter, index) => (
                                        (letter.character_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            letter.letter_content.toLowerCase().includes(searchTerm.toLowerCase())) && 
                                        <tr key={index}>
                                            <td>{letter.character_name}</td>
                                            <td onClick={() => handleLetterClick(letter.letter_id)}>
                                                {truncateString(letter.letter_content, 80)}
                                            </td>
                                            <td>{formatDateTime(letter.created_time)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default MailAppInbox;
