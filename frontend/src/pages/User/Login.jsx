import { use, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import authAPI from '@/apis/auth/userAxios';
import { useUser } from '@/store/userStore';
import Swal from 'sweetalert2';

export default function Login() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const { login, isAuthenticated, refreshAccessToken } = useUser();

  const navigate = useNavigate();

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=code`;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await login({ loginId, password });

    const status = response.data.status;
    if (status === 'NF') {
      // console.log('사용자 정보 틀림')
      Swal.fire({
        title: `<div class="flex justify-center items-center"><div class="w-[84px] h-[84px] bg-[url('/Login/exclamation-circle-solid.png')] bg-cover"></div></div>`,
        html: `
          <div class="text-center text-text-first auth-bold2 mb-[20px]">
            아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.
          </div>
        `,
        width: 430, // 모달의 너비
        heightAuto: false, // 높이 자동 조정 비활성화
        padding: '20px', // 내부 여백
        background: '#fff', // 배경색
        showConfirmButton: true,
        confirmButtonText: '확인',
        customClass: {
          popup: 'rounded-lg shadow-lg',
          confirmButton:
            'w-[120px] h-[50px] bg-gray-700 text-white auth-regular1 px-6 py-2 rounded-md hover:bg-gray-800',
          closeButton: 'text-gray-400 hover:text-gray-600',
        },
        buttonsStyling: false, // 기본 버튼 스타일 제거
      });
    }
  };

  const handleKakao = (e) => {
    e.preventDefault();
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div
      className="w-[1024px] h-[605px] mt-[30px] flex bg-[url('/Login/login-background.png')] bg-cover bg-bottom bg-no-repeat"
      style={{ backgroundSize: '100%' }}>
      {/* 왼쪽쪽 */}
      <div className="w-[18.75%]" />
      {/* 센터터 */}
      <div className="w-[62.5%]">
        <div className="flex flex-col items-center w-[540px] h-[538px] bg-white rounded-[40px]">
          {/* 로그인 텍스트 */}
          <div className="text-text-first auth-bold1 mt-[48px]">로그인</div>
          {/* 아이디 비번 입력칸 */}
          <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-[10px] mt-[30px]">
            <input
              type="email"
              id="login-email"
              onChange={(e) => setLoginId(e.target.value)}
              className="w-[445px] h-[65px] rounded-[30px] pl-[30px] auth-regular1 focus:outline-none text-text-first placeholder:text-text-third bg-main-authInput"
              placeholder="아이디"
            />
            <input
              type="password"
              id="login-password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-[445px] h-[65px] rounded-[30px] pl-[30px] auth-regular1 focus:outline-none text-text-first placeholder:text-text-third bg-main-authInput"
              placeholder="비밀번호"
            />
          </div>
          {/* 로그인 버튼 */}
          <div className="mt-[30px]">
            <button
              onClick={handleSubmit}
              className="w-[445px] h-[65px]  bg-main-btn rounded-[30px] text-text-first auth-regular1">
              로그인 하기
            </button>
          </div>
          </form>
          {/* 각종 링크 */}
          <div className="mt-[20px] space-x-[10px] text-text-second auth-regular2">
            <Link to="/findid">아이디 찾기</Link>
            <p className="inline-block">|</p>
            <Link to="/findpw">비밀번호 찾기</Link>
            <p className="inline-block">|</p>
            <Link to="/register">회원가입</Link>
          </div>
          {/* 카카오 로그인 버튼 */}
          <div className="mt-[20px]">
            <button
              onClick={handleKakao}
              className="w-[445px] h-[65px] rounded-[30px] text-text-first auth-regular1 bg-main-kakao bg-[url('/Login/kakao-symbol.png')] bg-cover bg-left bg-right-[30px] bg-no-repeat"
              style={{
                backgroundSize: '40px',
                backgroundPosition: '30px center',
              }}>
              카카오로 로그인 하기
            </button>
          </div>
        </div>
      </div>
      {/* 오른쪽 공란 */}
      <div className="w-[18.75%]"></div>
    </div>
  );
}
