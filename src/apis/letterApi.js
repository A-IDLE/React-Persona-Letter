import { request } from "./api";

  // 편지 리스트를 조회하는 API
export const allLetterList = async () => {
      return await request.get("/readLetter");
    }

export const getLetterList = async (userId,characterId) => {
      return await request.get("/readLetter/"+userId+"/"+characterId);
    }

  // 편지 리스트를 조회하는 API
export const getALetter = async (letterId) => {
      return await request.get("/getALetter/"+letterId);
    }
    // 편지를 생성하는 API
export const writeLetter = async ( data ) => {
      return await request.post("/writeLetter", data);
    }

    // 편지를 수정하는 API
export const updateLetter = async ({ data }) => {
    
    }

    // 편지를 삭제하는 API
export const deleteLetter = async ({ data }) => {
    
    }

// 사용자 이름을 업데이트하는 API
export const updateUser = async (tokenData, newUserName) => {
  return await request.post("/updateUser", {
    accessToken: tokenData.accessToken,
    new_user_name: newUserName,
  });
}

// 사용자 정보를 가져오는 API
export const getUserInfo = async () => {
  return await request.get("/userInfo");
}