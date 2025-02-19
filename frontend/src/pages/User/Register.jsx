import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/store/userStore';
import Swal from 'sweetalert2';

export default function Register() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState('');
  const [nickname, setNickname] = useState('');
  const [isSignUp, setSignUp] = useState(true);
  const [idCheck, setIdCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);
  const [authNumber, setAuthNumber] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [nicknameCheck, setNicknameCheck] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [timer, setTimer] = useState(180);
  const [isTimerActive, setTimerActive] = useState(false);
  const [isEmailSent, setEmailSent] = useState(false);
  const [text, setText] = useState('');

  const timerRef = useRef(null);
  const { duplicate, register, sendEmail, emailAuthenticate, isAuthenticated } =
    useUser();

  const birthRegex =
    /^(19[0-9]{2}|20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/; // 유효한 비밀번호 형식: 8~12자의 영문, 숫자, 특수문자(@$!%*?&) 포함
  const loadingText = '메일 전송중...';
  const typingSpeed = 200;
  const delayBeforeRestart = 1000;

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    //로딩 글자 효과
    let i = 0;
    const interval = setInterval(() => {
      setText(loadingText.slice(0, i + 1));
      i++;
      if (i === loadingText.length) {
        setTimeout(() => {
          i = 0;
        }, delayBeforeRestart);
      }
    }, typingSpeed);
    return () => clearInterval(interval);
  }, [isModalOpen]);

  // 생년월일 포맷 함수: 숫자만 입력 시 YYYY-MM-DD 형식으로 변환
  const formatBirth = (input) => {
    const digits = input.replace(/\D/g, '');
    if (digits.length < 5) return digits;
    if (digits.length < 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  };

  // 비밀번호 입력 변경 시 처리
  const handlePasswordChange = (e) => {
    const newPwd = e.target.value;
    setPassword(newPwd);
    setPasswordValid(passwordRegex.test(newPwd));
  };

  // 비밀번호 확인 입력 처리
  const handleCornfirmPasswordChange = (e) => {
    const confirmPwd = e.target.value;
    setConfirmPassword(confirmPwd);
    setPasswordMatch(confirmPwd === password);
  };

  // 인풋 값 변경 시 중복 체크 상태 초기화 및 생년월일 자동 포맷 처리
  const handleInputChange = (type, value) => {
    if (type === 'id') {
      setLoginId(value);
      setIdCheck(false);
    } else if (type === 'email') {
      setEmail(value);
      setEmailCheck(false);
      setIsEmailVerified(false);
    } else if (type === 'nickname') {
      setNickname(value);
      setNicknameCheck(false);
    } else if (type === 'birth') {
      setBirth(formatBirth(value));
    } else {
      setBirth(value);
    }
  };

  useEffect(() => {
    setPasswordMatch(confirmPassword === password);
  }, [password, confirmPassword]);

  const checkDuplicate = async (type, value) => {
    const idRegex = /^[A-Za-z0-9]{4,12}$/; // 아이디: 영문자, 숫자, 4~12자
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nicknameRegex = /^[A-Za-z0-9가-힣]{2,12}$/;

    try {
      if (type === 'id' && !idRegex.test(value)) {
        Swal.fire(
          '경고',
          '아이디는 4~12자, 영문자와 숫자만 포함할 수 있습니다.',
          'error'
        );
        return;
      }
      if (type === 'email' && !emailRegex.test(value)) {
        Swal.fire('경고', '이메일 형식이 올바르지 않습니다.', 'error');
        return;
      }
      if (type === 'nickname' && !nicknameRegex.test(value)) {
        Swal.fire(
          '경고',
          '닉네임은 2~12자, 영문자, 숫자, 한글만 포함할 수 있습니다.',
          'error'
        );
        return;
      }

      const response = await duplicate(type, value);

      if (response.status === 'Success.') {
        Swal.fire('사용 가능', `사용 가능한 ${type}입니다`, 'success').then(
          (result) => {
            if (result.isConfirmed) {
              if (type === 'id') {
                setIdCheck(true);
              } else if (type === 'email') {
                setEmailSent(false);
                setEmail(email);
                setEmailCheck(true);
                setModalOpen(true);
                setIsEmailVerified(false);
                startEmailVerification();
              } else {
                setNicknameCheck(true);
              }
            }
          }
        );
      } else {
        Swal.fire('중복', `이미 사용중인 ${type}입니다`, 'error');
      }
    } catch (error) {
      return error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idCheck) {
      Swal.fire('알림', '아이디 중복 확인을 먼저 해주세요!', 'warning');
      return;
    }
    if (!emailCheck) {
      Swal.fire('알림', '이메일 중복 확인을 먼저 해주세요!', 'warning');
      return;
    }
    if (!nicknameCheck) {
      Swal.fire('알림', '닉네임 중복 확인을 먼저 해주세요!', 'warning');
      return;
    }
    if (!email || !loginId || !password || !birth || !nickname) {
      Swal.fire('알림', '모든 정보를 입력해주세요!', 'warning');
      return;
    }
    if (!isEmailVerified) {
      Swal.fire('알림', '이메일 인증을 진행해주세요!', 'warning');
      return;
    }
    if (!birthRegex.test(birth)) {
      Swal.fire(
        '경고',
        '생년월일 입력 형식에 맞춰주세요! 예)2000-08-24',
        'error'
      );
      return;
    }
    if (!passwordValid) {
      Swal.fire('경고', '비밀번호 형식이 올바르지 않습니다.', 'error');
      return;
    }
    if (!passwordMatch) {
      Swal.fire('경고', '비밀번호가 일치하지 않습니다.', 'error');
      return;
    }


    const response = await register({
      loginId,
      password,
      email,
      birth,
      nickname,
    });

    if (response.data.status === 'SU') {
      Swal.fire(
        '회원가입 성공',
        '회원가입에 성공했습니다! 로그인 페이지로 이동합니다!',
        'success'
      );
      navigate('/login');
    } else {
      Swal.fire('회원가입 실패', '회원가입에 실패했습니다.', 'error');
    }
  };

  const startEmailVerification = async () => {
    try {
      const response = await sendEmail(email);
      if (response) {
        setEmailSent(true);
        startTimer();
      } else {
        Swal.fire('오류', '인증번호 발송에 실패했습니다.', 'error');
      }
    } catch (error) {
      Swal.fire('오류', '인증번호 발송에 실패했습니다.', 'error');
    }
  };

  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            setModalOpen(false);
            setEmailSent(false);
            Swal.fire('시간 초과', '인증 시간이 만료되었습니다.', 'error');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerActive, isModalOpen]);

  const startTimer = () => {
    setTimer(180);
    setTimerActive(true);
  };

  const handleVerifyAuthCode = async () => {
    try {
      const response = await emailAuthenticate(email, authNumber);
      if (response.status === 'SU') {
        setIsEmailVerified(true);
        setModalOpen(false);
        setTimer(180);
        setTimerActive(false);
        clearInterval(timerRef.current);
        Swal.fire('인증 완료', '이메일 인증이 완료되었습니다.', 'success');
      } else {
        Swal.fire('인증 실패', '잘못된 인증번호입니다.', 'error');
      }
    } catch (error) {
      Swal.fire('인증 실패', '인증번호 확인에 실패했습니다.', 'error');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEmailSent(false);
    setTimer(180);
    setTimerActive(false);
    clearInterval(timerRef.current);
  };

  return (
    <div className="w-[640px] h-auto bg-white rounded-[40px] shadow-lg flex flex-col items-center p-10 space-y-6">
      <h2 className="text-4xl font-bold text-text-first">회원가입</h2>
      <div className="w-full flex flex-col items-center space-y-4">
        {[
          {
            label: '아이디',
            type: 'id',
            placeholder: '아이디',
            value: loginId,
            setValue: setLoginId,
            checkType: 'id',
          },
          {
            label: '이메일',
            type: 'email',
            placeholder: '이메일 입력',
            value: email,
            setValue: setEmail,
            checkType: 'email',
          },
          {
            label: '비밀번호',
            type: 'password',
            placeholder: '8~12자의 영문, 숫자, 특수기호',
            value: password,
            setValue: setPassword,
          },
          {
            label: '비밀번호 확인',
            type: 'password',
            placeholder: '비밀번호 한번 더 입력',
            value: confirmPassword,
            setValue: setConfirmPassword,
          },
          {
            label: '닉네임',
            type: 'text',
            placeholder: '닉네임',
            value: nickname,
            setValue: setNickname,
            checkType: 'nickname',
          },
          {
            label: '생년월일',
            type: 'text',
            placeholder: '생년월일 8자리 입력 (예: 2025-02-09)',
            value: birth,
            setValue: setBirth,
            checkType: 'birth',
          },
        ].map((field, index) => (
          <div
            key={index}
            className="flex flex-col w-full max-w-[445px] relative">
            <label className="text-lg font-medium text-text-first font-['Wanted Sans']">
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={field.value || ''}
              onChange={(e) => {
                if (field.label === '비밀번호') handlePasswordChange(e);
                else if (field.label === '비밀번호 확인')
                  handleCornfirmPasswordChange(e);
                else handleInputChange(field.checkType, e.target.value);
              }}
              className="rounded-[30px] px-4 pr-20 w-[445px] h-[65px] text-text-first bg-main-authInput focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xl placeholder:font-['Wanted Sans'] placeholder:text-[#b1b1b1] placeholder:font-medium"
            />
            {/* 중복확인 버튼은 checkType이 존재하고 "birth"가 아닌 경우에만 표시 */}
            {field.checkType && field.checkType !== 'birth' && (
              <button
                onClick={() => checkDuplicate(field.checkType, field.value)}
                className="absolute right-2 bottom-2.5 px-3 py-1 w-[100px] h-[45px] bg-[#9f9f9f] text-text-white rounded-[30px] hover:bg-gray-400 transition-colors duration-200">
                중복확인
              </button>
            )}
            <div className="absolute right-2 bottom-[-20px] text-sm text-green-600 min-w-[100px] text-center">
              {field.checkType === 'id' && idCheck && '사용 가능'}
              {field.checkType === 'email' &&
                isEmailVerified &&
                emailCheck &&
                '인증 완료'}
              {field.checkType === 'nickname' && nicknameCheck && '사용 가능'}
              {field.label === '비밀번호' &&
                field.value === password &&
                password &&
                !passwordValid && (
                  <p className="text-main-choose text-sm">
                    비밀번호 형식이 올바르지 않습니다.
                  </p>
                )}
              {field.label === '비밀번호' &&
                field.value === password &&
                passwordValid &&
                password && <p className="text-green-600 text-sm">사용 가능</p>}
              {field.label === '비밀번호 확인' &&
                field.value === confirmPassword &&
                confirmPassword &&
                !passwordMatch && (
                  <p className="text-main-choose text-sm">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              {field.label === '비밀번호 확인' &&
                field.value === confirmPassword &&
                confirmPassword &&
                passwordMatch && (
                  <p className="text-green-600 text-sm">비밀번호 일치</p>
                )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="w-[445px] h-[65px] bg-main-btn rounded-[30px] text-2xl font-medium text-text-first hover:bg-main-carrot transition-colors duration-200">
        회원가입 하기
      </button>
      {isModalOpen && !isEmailVerified && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-[380px] flex flex-col items-center">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-2 text-gray-500 hover:text-gray-700 transition duration-200 text-2xl">
              ❌
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              📩 이메일 인증
            </h3>
            {!isEmailSent && (
              <div className="text-gray-600 text-center text-sm mb-4">
                {text}
              </div>
            )}
            {isEmailSent && (
              <div>
                <p className="text-gray-600 text-center text-sm mb-4">
                  이메일로 인증번호를 보냈어요! <br /> 입력 후 인증 확인을
                  눌러주세요.
                </p>
              </div>
            )}
            <input
              type="text"
              value={authNumber}
              onChange={(e) => setAuthNumber(e.target.value)}
              placeholder="인증번호 입력"
              className="w-full p-3 text-center rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg mb-3"
            />
            <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              ⏳ 남은 시간: {Math.floor(timer / 60)}:
              {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
            </div>
            <button
              onClick={handleVerifyAuthCode}
              className="w-full bg-main-btn text-text-first rounded-full py-3 text-lg font-semibold shadow-md hover:bg-main-carrot transition duration-200">
              인증 확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
