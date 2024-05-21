import { request } from "./api";

  // post api 참고용
  // export const callJournalListBySearch = async ({ data }) => {
  //   return await request.post("/journals/search", { data });
  // };



  // 메인화면용 캐릭터 리스트를 조회하는 API
export const getCharacters = async () => {
  return await request.get("/characters");
    }

// 캐릭터 이름 조회하는 API
export const getCharacterName = async (characterId) => {
  const response = await request.get(`/character/${characterId}/name`);
  return response.data.name;
    };

    // 캐릭터를 생성하는 API
export const writeCharacter = async ({ data }) => {
    
    }

    // 캐릭터를 수정하는 API
export const updateCharacter = async ({ data }) => {
    
    }

    // 캐릭터를 삭제하는 API
export const deleteCharacter = async ({ data }) => {
    
    }

