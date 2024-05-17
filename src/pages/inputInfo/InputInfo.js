import React, { useEffect, useState, useRef } from 'react';
import './InputInfo.css'
import { updateUser, getUserInfo } from '../../apis/letterApi';

function Inputinfo(){

    const [userName, setUserName] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [tokenData, setTokenData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            const tokenData = { accessToken: token };
            setTokenData(tokenData);

            // 사용자 정보를 가져오는 API 호출
            getUserInfo().then(response => {
                setUserName(response.data.name || response.data.email); // 이름 또는 이메일로 설정
            }).catch(error => {
                console.error("Error fetching user info:", error);
            });
        }
    }, []);

    const handleUpdateUserName = async () => {
        if (tokenData && newUserName) {
            try {
                const response = await updateUser(tokenData, newUserName);
                setUserName(newUserName);
                setNewUserName('');
                alert(response.data.message);
            } catch (error) {
                alert('Error updating user name.');
            }
        }
    };

    return (
        <section className='input_wrapper'>
            <div className="info_header">Persona Letter</div>

            <div className='info_letter_section'>
                Dear {userName}.
                The moment of writing a first letter always feels a bit strange, but in a good way.
                It's truly an honor for us, Persona Letter, to share this moment with you.
                
                You are going to have a special experience communicating with your favorite characters.
                They are expecting to hear your stories and ready to share their stories from different worlds, times, and places.
                
                While feeling a bit nervous, we do know where to begin.                
                So, under what name should We inform the characters the letter is from?

                Name : 
                <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder={userName}
                />
                Nickname : 
                <button onClick={handleUpdateUserName}>send</button>

            </div>
        </section>
    );
}
export default Inputinfo;