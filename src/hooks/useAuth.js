import { validateToken } from "../apis/auth";
import { useNavigate } from 'react-router-dom';

// export function useAuth() {
//     const accessToken = localStorage.getItem('accessToken');
//     return !!accessToken;
//   }


  export function useAuth() {
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
  
    const response = validateToken(accessToken, navigate);
    const validateAccessToken = localStorage.getItem('accessToken');
    console.log("validateAccessToken:", validateAccessToken);
    if (validateAccessToken) {
      return true;
    }else{
      // validateAccessToken 없으면 login 페이지로 이동
      return false;
    }
    // Return false if there is no accessToken
    return false;
  }