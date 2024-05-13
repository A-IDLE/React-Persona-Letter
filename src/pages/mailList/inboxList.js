import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './inboxList.css'; 

function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

function MailAppInbox() {
    const [letters, setLetters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
    const userId = localStorage.getItem("userId");
    const characterId = localStorage.getItem("characterId")
    const accessToken = localStorage.getItem("accessToken"); 

    console.log("@@@@@User, CharacterID, CharacterName:", userId, characterId);

    
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
                    <div className="contact active">Hermione Jean Granger</div>
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
                                    <td>{letter.created_time}</td> 
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
