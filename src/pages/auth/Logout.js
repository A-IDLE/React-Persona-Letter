import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import React from 'react';


export const Logout = ({className}) => {
    const auth = getAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userId");
            
            alert("로그아웃 되었습니다.");
            navigate('/')
        }).catch((error) => {
            // An error happened.
            alert("로그아웃 실패했습니다");
        });
    }

    // className이 없으면 "logout"으로 설정합니다.
    if (!className) {
        className = "logout";
    }

    return (
        
            <div className={className} onClick={handleLogout}>
                Logout
            </div>
    )

}
