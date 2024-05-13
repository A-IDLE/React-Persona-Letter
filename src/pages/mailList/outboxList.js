import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './inboxList.css'; 

// 문자열을 주어진 길이로 자르고 필요한 경우 줄임표를 추가하는 함수
function truncateString(str, num) {
  // 문자열이 주어진 길이보다 짧거나 같으면 그대로 반환합니다.
  if (str.length <= num) {
    return str;
  }
  // 그렇지 않으면 주어진 길이까지 자른 후 줄임표를 추가하여 반환합니다.
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
  
function MailAppOutbox() {

    const [letters, setLetters] = useState([]);
    const navigate = useNavigate();

    // useEffect 훅을 사용하여 컴포넌트가 마운트될 때 한 번만 실행되는 비동기 효과를 설정합니다.
    useEffect(() => {
        
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken"); 
        
        console.log("loggedin user id:", userId);

        fetch(`http://localhost:9000/outboxLetter?user_id=${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}` // Bearer 토큰을 헤더에 추가
            }
        })
        .then(response => response.json())
        .then(data => {
            setLetters(data);
        })
        .catch(error => console.error("Fetching letters failed:", error));
    }, []);

    const handleLetterClick = (letterId) => {
        console.log("Clicked letter ID:", letterId);
        navigate(`/letter/${letterId}`);
    };

    
    return (
        <div>
            
            <div className="header">Persona Letter</div>
            
            <div className="main-container">
               
                <div className="sidebar">
                    <div className="contact active">Hermione Jean Granger</div>
                    <div className="contact">받은 편지함</div>
                    <div className="contact">보낸 편지함</div>
                    <div className="menu-item">My page</div>
                    <div className="menu-item">Log out</div>
                </div>
               
                <div className="content">
                    
                    <table>
                       
                        <thead>
                            <tr>
                                <th>Character</th>
                                <th>Letter Content</th>
                                <th>Created Time</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {/* letters 배열을 순회하면서 각 편지 데이터를 출력합니다. */}
                            {letters.map((letter, index) => (
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

export default MailAppOutbox;