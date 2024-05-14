import { request } from "../apis/api"


// Google Login api
export const googleLogin = async (accessToken) => {
  const response = await request.post("/googleLogin", { accessToken });
  return response.data;
}


// accesstoken validation api
export const validateToken = async (accessToken, navigate) => {
  // const response = await request.post("/validateToken", { accessToken });
  
  try {
    const response = await request.post("/validateToken", { accessToken });
    return response.data;
  } catch (error) {
    console.error("Error validating token:", error);
    console.error("Error validating token:", error.response.status);
    // if(error.response.status == "401") {

    // }
      
    // 토큰이 유효하지 않으면 localStorage에서 삭제
    localStorage.removeItem('accessToken');
    navigate('/login');
    return;
  }
}