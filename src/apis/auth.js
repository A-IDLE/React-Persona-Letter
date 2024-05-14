import { request } from "../apis/api"

// Google Login api
export const googleLogin = async (accessToken) => {
  const response = await request.post("/googleLogin", { accessToken });
  return response.data;
}


// accesstoken validation api
export const validateToken = async (accessToken) => {

  try {
    const response = await request.post("/validateToken", { accessToken });
    return response.data;
  } catch (error) {
    console.error("Error validating token:", error);
    localStorage.removeItem('accessToken');
    return false;
  }
}