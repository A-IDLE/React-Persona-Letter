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
export const getLetterList = async () => {
      return await request.get("http://localhost:9000/leadLetter");
    }
    // 편지를 생성하는 API
export const writeLetter = async ({ data }) => {
      return await request.post("http://localhost:9000/writeLetter", data);
    }

    // 편지를 수정하는 API
export const updateLetter = async ({ data }) => {
    
    }

    // 편지를 삭제하는 API
export const deleteLetter = async ({ data }) => {
    
    }

