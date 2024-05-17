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
    return new Intl.DateTimeFormat('en-US', options).format(date);
}
  
function MailAppInbox() {
    const [letters, setLetters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [CharacterName, setCharacterName] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const { characterId } = location.state || {};

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        // const characterId = localStorage.getItem("characterId");
        const characterName = localStorage.getItem("characterName");
        const accessToken = localStorage.getItem("accessToken");
        const receptionStatus = "receiving";
        
        setCharacterName(characterName);

        console.log("@@@@@User, CharacterID, CharacterName:", userId, characterId, CharacterName);

        if (userId && characterId && accessToken) {
            // inboxLetter API를 사용하여 편지 목록을 가져옵니다.
            getLettersByReceptionStatus(characterId, receptionStatus)
              .then(data => {
                  // data가 배열인지 확인하고 설정합니다.
                  if (Array.isArray(data)) {
                  setLetters(data);
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
    }, []);

    const handleLetterClick = (letterId) => {
        console.log("clicked letter id:", letterId);
        navigate(`/letter/${letterId}`);
    };

    const navigateToOutbox = () => {
        navigate('/outbox', {state: { characterId }});
    };

    const navigateToInbox = () => {
        navigate('/inbox', {state: { characterId }});
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <div className="header">Persona Letter</div>
            
            <div className="main-container">
                <div className="sidebar">
                    <div className="contact active">{CharacterName}</div>
                    <div className="contact" onClick={navigateToInbox}>Inbox</div>
                    <div className="contact" onClick={navigateToOutbox}>Outbox</div>
                    <div className="menu-item">My page</div>
                    <Logout className="menu-item"/>
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
