import { googleLogin } from '../../apis/auth';
import googleIcon from '../../assets/images/web_neutral_rd_ctn.svg';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


export const GoogleLogin = () => {

  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

  const auth = getAuth();

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {

    await signInWithPopup(auth, provider)
      .then((result) => {
        // user's access token for firebase
        const accessToken = result.user.accessToken;
        // access token을 local storage에 저장
        localStorage.setItem("accessToken", accessToken);

      }).catch((error) => {
        // 에러 핸들링
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });

    const accessToken = localStorage.getItem("accessToken");

    // after firebase login, call googleLogin api
    const funcGoogleLogin = async (accessToken) => {
      const response = await googleLogin(accessToken);
      const userId = response.userId;

      // store the userId in local storage
      localStorage.setItem("userId", userId);

    }

    try {
      // 백엔드로 구글 로그인 요청
      funcGoogleLogin(accessToken);
      // 로그인 성공시 메인페이지로 이동
      navigate('/');
    } catch (error) {
      // 로그인 실패시 에러 출력
      console.error("Google Login Failed \n", error);
      alert("로그인 실패했습니다")
    }
  }

  return (
    <div id="gSignInWrapper">
      <div className="google-login-button" onClick={handleGoogleLogin}>
        <img src={googleIcon} />
      </div>
    </div>
  )
}