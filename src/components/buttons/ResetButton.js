import { deleteLetters } from "../../apis/letterApi";
import { useNavigate } from "react-router-dom";
import "./ResetButton.css"

export const ResetButton = ({ characterId, onReset }) => {

    const handleReset = async () => {
        console.log("리셋");
        const userConfirmed = window.confirm("캐릭터와의 기억과 편지 내용을 모두 제거하는 버튼입니다. 하시겠습니까?");

        if (userConfirmed) {
            console.log("사용자가 예를 선택했습니다.");
            try {
                await deleteLetters(characterId);
                onReset();  // 상태 업데이트 함수 호출
            } catch (error) {
                console.error("Failed to delete letters:", error);
            }
        } else {
            console.log("사용자가 아니오를 선택했습니다.");
        }
    }

    return (
        <div>
            <img src="/images/inbox/reset.svg" alt="리셋" className="resetButton"/>
            <div className="resetText" onClick={handleReset}>reset</div>
        </div>
    );
}
