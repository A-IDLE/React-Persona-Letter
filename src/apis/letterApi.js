import { request } from "./api";

// 매매일지 목록 조회
export const callJournalList = async () => {
    return await request.get("/journals/search");
  };
  
  // 매매일지 검색
  export const callJournalListBySearch = async ({ data }) => {
    return await request.post("/journals/search", { data });
  };



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

    // inboxLetter를 조회하는 API
export const inboxLetter = async (userId, characterId, accessToken) => {
  const response = await request.get(`/inboxLetter?user_id=${userId}&character_id=${characterId}`, accessToken);
  return response.data; // 응답 객체에서 데이터만 반환
};

 // inboxLetter를 조회하는 API
 export const outboxLetter = async (userId, characterId, accessToken) => {
  const response = await request.get(`/outboxLetter?user_id=${userId}&character_id=${characterId}`, accessToken);
  return response.data; // 응답 객체에서 데이터만 반환
};