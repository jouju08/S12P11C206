import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import authAPI from '@/apis/auth/userAxios';
import Swal from 'sweetalert2';
import { useProfile } from '@/store/parentStore';

export default function PasswordChangeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { changePassword } = useProfile();

  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  // 8~12자, 영문, 숫자, 특수기호(!@#$%^&*) 조건
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;

  // 실시간 현재 비밀번호 입력 검증 (공백 체크)
  const handleCurrentPasswordChange = (e) => {
    const value = e.target.value;
    setCurrentPassword(value);
    if (!value) {
      setCurrentPasswordError('현재 비밀번호를 입력해 주세요.');
    } else {
      setCurrentPasswordError('');
    }
  };

  // 실시간 새 비밀번호 입력 검증
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    if (value && !passwordRegex.test(value)) {
      setPasswordError('8~12자의 영문, 숫자, 특수기호(!@#$%^&*)를 포함해야 합니다.');
    } else {
      setPasswordError('');
    }

    // 새 비밀번호 변경 시, 비밀번호 확인도 재검증
    if (confirmNewPassword && value !== confirmNewPassword) {
      setConfirmError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmError('');
    }
  };

  const handleConfirmNewPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmNewPassword(value);
    if (newPassword !== value) {
      setConfirmError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmError('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // 필수 입력값 체크
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      if (!currentPassword) setCurrentPasswordError('현재 비밀번호를 입력해 주세요.');
      if (!newPassword) setPasswordError('새 비밀번호를 입력해 주세요.');
      if (!confirmNewPassword) setConfirmError('비밀번호 확인을 입력해 주세요.');
      Swal.fire('경고', '필수 입력값을 확인해 주세요.', 'error');
      return;
    }

    // 새 비밀번호 형식 체크
    if (!passwordRegex.test(newPassword)) {
      setPasswordError('8~12자의 영문, 숫자, 특수기호(!@#$%^&*)를 포함해야 합니다.');
      Swal.fire('경고', '새 비밀번호 형식이 올바르지 않습니다.', 'error');
      return;
    }

    // 새 비밀번호와 확인이 일치하는지 체크
    if (newPassword !== confirmNewPassword) {
      setConfirmError('비밀번호가 일치하지 않습니다.');
      Swal.fire('경고', '비밀번호가 일치하지 않습니다.', 'error');
      return;
    }

    try {
      const { status } = await changePassword(currentPassword, newPassword);
        
      if (status === 'SU') {
        Swal.fire('성공', '비밀번호 변경에 성공했습니다.', 'success');
        // 상태 초기화 후 모달 닫기
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        onClose();
      } else {
        Swal.fire('오류', '비밀번호 변경에 실패했습니다.', 'error');
      }
        
    } catch (error) {
      console.error('비밀번호 변경 실패', error);
      Swal.fire('오류', '비밀번호 변경에 실패했습니다.', 'error');
    }
  };

  const modalContent = (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      {/* 모달 컨테이너 */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="relative w-[500px] h-[480px] bg-white rounded-lg shadow-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="h-[65px] bg-[#FDF8DC] flex items-center justify-center relative">
            <span className="service-bold1 text-[28px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              비밀번호 변경
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-10 h-10 absolute right-4 top-1/2 transform -translate-y-1/2 bg-main-choose rounded-full flex justify-center items-center"
            >
              <img src="/Common/close.png" alt="닫기" />
            </button>
          </div>
          {/* 내용 영역 */}
          <div className="py-6 px-10 flex flex-col space-y-4">
            {/* 현재 비밀번호 입력 */}
            <div>
              <label className="block text-text-first service-regular3 mb-2">
                현재 비밀번호
              </label>
              <input
                type="password"
                className="w-full h-[38px] rounded-[8px] pl-[16px] border border-gray-400"
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
              />
              <div className="min-h-5">
                {currentPasswordError && (
                  <p className="text-red-500 text-sm mt-1">{currentPasswordError}</p>
                )}
              </div>
            </div>
            {/* 새 비밀번호 입력 */}
            <div>
              <label className="block text-text-first service-regular3 mb-2">
                새 비밀번호
              </label>
              <input
                type="password"
                className="w-full h-[38px] rounded-[8px] pl-[16px] border border-gray-400"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <div className="min-h-5">
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
            </div>
            {/* 비밀번호 확인 입력 */}
            <div>
              <label className="block text-text-first service-regular3 mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                className="w-full h-[38px] rounded-[8px] pl-[16px] border border-gray-400"
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
                onKeyDown={handleKeyDown}
              />
              <div className="min-h-5">
                {confirmError && (
                  <p className="text-red-500 text-sm mt-1">{confirmError}</p>
                )}
              </div>
            </div>
          </div>
          {/* 버튼 영역 */}
          <div className="flex justify-end py-2 px-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSubmit();
              }}
              className="w-[150px] h-[38px] rounded-[30px] bg-main-btn service-regular3 text-text-first border border-[#787878]"
            >
              변경하기
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
