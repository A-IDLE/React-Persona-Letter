import { request } from "./api";

// 매매일지 목록 조회
export const callJournalList = async () => {
    return await request.get("/journals/search");
  };
  
  // 매매일지 검색
  export const callJournalListBySearch = async ({ data }) => {
    return await request.post("/journals/search", { data });
  };


// 개별 편지 조회 API
export const getALetter = async (letterId) => {
  try {
      const response = await request.get(`/getALetter/${letterId}`);
      console.log("API Response:", response.data); // 로그 추가
      return response.data;
  } catch (error) {
      console.error('Failed to fetch letter', error);
      throw error; // 에러를 던지면 호출한 쪽에서 처리할 수 있습니다.
  }
};

  // 편지 리스트를 조회하는 API
export const getLetterList = async () => {

    }
    // 편지를 생성하는 API
export const writeLetter = async ({ data }) => {
    
    }

    // 편지를 수정하는 API
export const updateLetter = async ({ data }) => {
    
    }

    // 편지를 삭제하는 API
export const deleteLetter = async ({ data }) => {
    
    }

