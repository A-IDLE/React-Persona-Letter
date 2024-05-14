import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";



export const Logout = () => {
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

    return (
        
            <button className="button" onClick={handleLogout}>
                <span>Logout</span>
            </button>
    )

}
