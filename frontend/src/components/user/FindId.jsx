import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '@/store/userStore';

export default function FindId() {
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState('');
  const [emailError, setEmailError] = useState('');
  const [birthError, setBirthError] = useState('');

  const { findId, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);

  // 이메일 및 생년월일 정규식
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const birthRegex =
    /^(19[0-9]{2}|20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setEmailError('올바른 이메일 형식을 입력해 주세요.');
    } else {
      setEmailError('');
    }
  };

  const formatBirth = (value) => {
    value = value.replace(/\D/g, ''); // 숫자만 허용
    if (value.length <= 4) return value;
    if (value.length <= 6) return `${value.slice(0, 4)}-${value.slice(4)}`;
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  };

  const handleBirthChange = (e) => {
    const formattedValue = formatBirth(e.target.value);
    setBirth(formattedValue);

    if (!birthRegex.test(formattedValue)) {
      setBirthError('생년월일은 YYYY-MM-DD 형식이어야 합니다.');
    } else {
      setBirthError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !birth) {
      if (!email) setEmailError('이메일을 입력해 주세요.');
      if (!birth) setBirthError('생년월일을 입력해 주세요.');
      Swal.fire('경고', '모든 필드를 입력해 주세요.', 'error');
      return;
    }
    if (emailError || birthError) {
      Swal.fire('경고', '입력값을 확인해 주세요.', 'error');
      return;
    }
    try {
      const payload = {
        email: email,
        birth: birth,
      };
      const response = await findId(payload);
      if (response.status === 'SU') {
        Swal.fire('성공', `이메일에서 아이디를 확인해주세요.`, 'success');
        navigate('/login');
      } else {
        Swal.fire('실패', '아이디를 찾지 못했습니다.', 'error');
      }
    } catch (error) {
      console.error('아이디 찾기 실패', error);
      Swal.fire('오류', '아이디 찾기에 실패했습니다.', 'error');
    }
  };

  return (
    <div
      className="w-[1024px] h-[605px] mt-[30px] flex bg-[url('/Login/login-background.png')] bg-cover bg-bottom bg-no-repeat"
      style={{ backgroundSize: '100%' }}>
      {/* 왼쪽 공란 */}
      <div className="w-[18.75%]" />
      {/* 중앙 컨테이너 */}
      <div className="w-[62.5%]">
        <div className="flex flex-col items-center w-[540px] h-[500px] bg-white rounded-[40px]">
          {/* 페이지 제목 */}
          <div className="text-text-first auth-bold1 mt-[48px]">
            아이디 찾기
          </div>
          {/* 입력 폼 */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center mt-[30px]">
            <div className="flex flex-col space-y-[10px] w-full items-center">
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

              <input
                type="text"
                value={birth}
                onChange={handleBirthChange}
                placeholder="생년월일 (YYYY-MM-DD)"
                className="w-[445px] h-[65px] rounded-[30px] pl-[30px] auth-regular1 focus:outline-none text-text-first placeholder:text-text-third bg-main-authInput"
                maxLength={10}
              />
              {birthError && (
                <p className="text-red-500 text-sm text-center">{birthError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-[445px] h-[65px] bg-main-btn rounded-[30px] auth-regular1 text-text-first hover:bg-main-carrot transition-colors duration-200 mt-[30px]">
              아이디 찾기
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
      {/* 오른쪽 공란 */}
      <div className="w-[18.75%]"></div>
    </div>
  );
}
