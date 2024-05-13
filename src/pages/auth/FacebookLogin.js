import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import facebookIcon from '../../assets/images/facebook_icon1.png';


export const FacebookLogin = () => {

    const provider = new FacebookAuthProvider();
    const auth = getAuth();

    const navigate = useNavigate();

    const handleFacebookLogin = async () => {

        await signInWithPopup(auth, provider)
            .then((result) => {

                console.log("THIS IS RESULT")
                // user's access token for firebase
                const accessToken = result.user.accessToken;
                // access token을 local storage에 저장
                localStorage.setItem("accessToken", accessToken);

                const user = result.user;

                console.log("THIS IS USER")
                console.log(user);

            }).catch((error) => {
                // 에러 핸들링
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = FacebookAuthProvider.credentialFromError(error);
            });

        const accessToken = localStorage.getItem("accessToken");

        // // after firebase login, call googleLogin api
        // const funcGoogleLogin = async (accessToken) => {
        //     const response = await googleLogin(accessToken);
        //     const userId = response.userId;

        //     // store the userId in local storage
        //     localStorage.setItem("userId", userId);

        // }

        // try {
        //     // 백엔드로 구글 로그인 요청
        //     funcGoogleLogin(accessToken);
        //     // 로그인 성공시 메인페이지로 이동
        //     navigate('/');
        // } catch (error) {
        //     // 로그인 실패시 에러 출력
        //     console.error("Facebook Login Failed \n", error);
        //     alert("로그인 실패했습니다")
        // }
    }


    return (
        <button className="facebook-login-button" onClick={handleFacebookLogin}>
            Continue with Facebook
        </button>
    );
}