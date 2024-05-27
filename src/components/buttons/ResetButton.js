// 리셋 버튼 컴포넌트
import { deleteLetters } from "../../apis/letterApi";


export const ResetButton = ({characterId }) => {

    

    const handleReset = async () => {
        console.log("리셋");
        const userConfirmed = window.confirm("캐릭터와의 기억과 편지 내용을 모두 제거하는 버튼입니다. 하시겠습니까?");

        if (userConfirmed) {
            // 사용자가 "예"를 선택한 경우 실행할 코드
            console.log("사용자가 예를 선택했습니다.");
            // 여기서 캐릭터와의 기억과 편지 내용을 제거하는 코드를 추가합니다.
            const response = await deleteLetters(characterId);

        } else {
            // 사용자가 "아니오"를 선택한 경우 실행할 코드
            console.log("사용자가 아니오를 선택했습니다.");
        }
    }

    return (
        <div>
            <img src="/images/sendLetter/reset.png" alt="종이비행기" className="send" onClick={handleReset} />
        </div>
    );
}