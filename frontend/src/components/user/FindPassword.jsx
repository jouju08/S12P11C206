import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '@/store/userStore';

export default function FindPassword() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [emailError, setEmailError] = useState('');

  const { findPassword, isAuthenticated } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);

  // 이메일 정규식
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleUserIdChange = (e) => {
    const value = e.target.value;
    setUserId(value);
    if (value.trim() === '') {
      setUserIdError('아이디를 입력해 주세요.');
    } else {
      setUserIdError('');
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setEmailError('올바른 이메일 형식을 입력해 주세요.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !email) {
      if (!userId) setUserIdError('아이디를 입력해 주세요.');
      if (!email) setEmailError('이메일을 입력해 주세요.');
      Swal.fire('경고', '모든 필드를 입력해 주세요.', 'error');
      return;
    }
    if (userIdError || emailError) {
      Swal.fire('경고', '입력값을 확인해 주세요.', 'error');
      return;
    }
    try {
      Swal.fire({
        title: '이메일 전송 중...',
        html: '<div id="progress-bar" style="width: 100%; height: 10px; background: orange;"></div>',
        timer: 7000,
        timerProgressBar: false,
        didOpen: () => {
          let timerInterval;
          const progressBar = document.getElementById('progress-bar');
          let width = 100;
          timerInterval = setInterval(() => {
            width -= 1;
            progressBar.style.width = width + '%';
            if (width <= 0) {
              clearInterval(timerInterval);
            }
          }, 70); // 7초 동안 100% → 0%
        },
        showConfirmButton: false,
      });
      const payload = {
        loginId: userId,
        email: email,
      };
      const response = await findPassword(payload);
      if (response.status === 'SU') {
        Swal.fire(
          '성공',
          `이메일로 새로운 비밀번호를 전송하였습니다.`,
          'success'
        );
        navigate('/login');
      } else {
        Swal.fire('실패', '아이디와 이메일을 다시 확인해주세요.', 'error');
      }
    } catch (error) {

      Swal.fire('오류', '비밀번호 찾기에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="w-[1024px] h-[605px] mt-[30px] flex justify-center items-center">
      {/* 중앙 컨테이너 */}
      <div className="w-[62.5%] relative">
        <div className="flex flex-col items-center w-full h-fit pb-[40px] bg-white rounded-[40px] absolute top-1/2 -translate-y-1/2">
          {/* 페이지 제목 */}
          <div className="text-text-first auth-bold1 mt-[48px]">
            비밀번호 찾기
          </div>
          {/* 입력 폼 */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center mt-[30px]">
            <div className="flex flex-col space-y-[10px] w-full items-center">
              <input
                type="text"
                value={userId}
                onChange={handleUserIdChange}
                placeholder="아이디 입력"
                className="w-[445px] h-[65px] rounded-[30px] pl-[30px] auth-regular1 focus:outline-none text-text-first placeholder:text-text-third bg-main-authInput"
              />
              {userIdError && (
                <p className="text-red-500 text-sm text-center">
                  {userIdError}
                </p>
              )}

              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="이메일 입력"
                className="w-[445px] h-[65px] rounded-[30px] pl-[30px] auth-regular1 focus:outline-none text-text-first placeholder:text-text-third bg-main-authInput"
              />
              {emailError && (
                <p className="text-red-500 text-sm text-center">{emailError}</p>
              )}
            </div>

            {/* 비밀번호 찾기 버튼 */}
            <button
              type="submit"
              className="w-[445px] h-[65px] bg-main-btn rounded-[30px] auth-regular1 text-text-first hover:bg-main-carrot transition-colors duration-200 mt-[30px]">
              비밀번호 찾기
            </button>
          </form>

          <div className="mt-[20px] text-text-second auth-regular2">
            <Link
              to="/login"
              className="underline">
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
