import { getAuth, signOut } from "firebase/auth";
import React from 'react';


export const Logout = () => {
    const auth = getAuth();

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userId");
            
            alert("로그아웃 되었습니다.");
        }).catch((error) => {
            // An error happened.
            alert("로그아웃 실패했습니다");
        });
    }

    return (
        <div id="Logout">
            <button className="logout-button" onClick={handleLogout}>
                <span>Logout</span>
            </button>
        </div>
    )

}
