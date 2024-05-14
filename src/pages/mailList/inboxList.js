import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './inboxList.css'; 

// 문자열을 주어진 길이로 자르고 필요한 경우 줄임표를 추가하는 함수
function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

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

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const characterId = localStorage.getItem("characterId");
        const characterName = localStorage.getItem("characterName");
        const accessToken = localStorage.getItem("accessToken");
        
        setCharacterName(characterName); // 로컬 스토리지에서 캐릭터 이름 가져오기

        

    console.log("@@@@@User, CharacterID, CharacterName:", userId, characterId, CharacterName);

    
    fetch(`http://localhost:9000/inboxLetter?user_id=${userId}&character_id=${characterId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        setLetters(data);
    })
    .catch(error => console.error("Fetching letters failed:", error));
}, []);

    const handleLetterClick = (letterId) => {
        console.log("clicked letter id:", letterId);
        navigate(`/letter/${letterId}`);
    };

    const navigateToOutbox = () => {
        navigate('/outbox');
    };

    const navigateToInbox = () => {
        navigate('/inbox');
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
                    <div className="contact" onClick={navigateToInbox}>받은 편지함</div>
                    <div className="contact" onClick={navigateToOutbox}>보낸 편지함</div>
                    <div className="menu-item">My page</div>
                    <div className="menu-item">Log out</div>
                </div>
                
                <div className="content">
                    <div className="search-box"> {/* Add search box container */}
                        <input
                            type="text"
                            placeholder="검색..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    
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
                </div>
            </div>
        </div>
    );
}

export default MailAppInbox;