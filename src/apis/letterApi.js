import { request } from "./api";


export const getLetterList = async (characterId) => {
  return await request.get(`/character/${characterId}/letters`);
}

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
export const deleteLetter = async ({ data }) => {

}

// inboxLetter를 조회하는 API
export const inboxLetter = async (userId, characterId) => {
  const response = await request.get(`/inboxLetter?user_id=${userId}&character_id=${characterId}`);
  return response.data; // 응답 객체에서 데이터만 반환
};

// inboxLetter를 조회하는 API
export const outboxLetter = async (userId, characterId) => {
  const response = await request.get(`/outboxLetter?user_id=${userId}&character_id=${characterId}`);
  return response.data; // 응답 객체에서 데이터만 반환
};


// inboxLetter를 조회하는 API
export const getLettersByReceptionStatus = async (characterId, receptionStatus) => {
  const response = await request.get(`/character/${characterId}/letters/${receptionStatus}`);
  return response.data; // 응답 객체에서 데이터만 반환
};



