import { request } from "./api";


export const getLetterList = async (characterId) => {
  return await request.get(`/character/${characterId}/letters`);
}

// 편지상태를 수정하는 API
export const updateStatusLetter = async (letterId) => {
  return await request.put(`/letterStatus/${letterId}`);
};

// 편지 리스트를 조회하는 API
export const getALetter = async (letterId) => {
  return await request.get(`/letters/${letterId}`);
}

// 편지를 생성하는 API
export const writeLetter = async (data) => {
  return await request.post(`/letters`, data);
}

// 편지를 수정하는 API
export const updateLetter = async ({ data }) => {

}

// 편지를 삭제하는 API
export const deleteLetters = async (characterId) => {
  return await request.delete(`/character/${characterId}/letters`);
}

// inboxLetter를 조회하는 API
export const getLettersByReceptionStatus = async (characterId, receptionStatus) => {
  const response = await request.get(`/character/${characterId}/letters/${receptionStatus}`);
  return response.data; // 응답 객체에서 데이터만 반환
};



// 사용자 이름을 업데이트하는 API
export const updateUser = async (tokenData, newUserName) => {
  return await request.post("/updateUser", {
    accessToken: tokenData.accessToken,
    new_user_name: newUserName,
  });
}

export const updateUserNickname = async (tokenData, newUserNickname) => {
  return await request.post("/updateUserNickname", {
    accessToken: tokenData.accessToken,
    new_user_nickname: newUserNickname,
  });
}
// 사용자 정보를 가져오는 API
export const getUserInfo = async () => {
  return await request.get("/userInfo");
}

export const getUserName = async () => {
  return await request.get('/getUserName');
}

// receivedLetter를 조회하는 API
export const receivedLetter = async (letterId) => {
  return await request.get(`/received?letter_id=${letterId}`);
}

// sentLetter 조회하는 API
export const sentLetter = async (letterId) => {
  return await request.get(`/sent?letter_id=${letterId}`);
}