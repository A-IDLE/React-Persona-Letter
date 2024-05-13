import { validateToken } from "../apis/auth";

// export function useAuth() {
//     const accessToken = localStorage.getItem('accessToken');
//     return !!accessToken;
//   }


  export function useAuth() {
    const accessToken = localStorage.getItem('accessToken');
  
    if (accessToken) {
      try {
        // 먼저 해당 토큰이 유효한지 확인
        const response = validateToken(accessToken);
        return true;
      } catch (error) {
        console.error("Error validating token:", error);
        // 토큰이 유효하지 않으면 localStorage에서 삭제
        localStorage.removeItem('accessToken');
        return false;
      }
    }
    // Return false if there is no accessToken
    return false;
  }