import React, { useState } from 'react';

export default function TaleRoomHeader({ onClose }) {
  return (
    <header className="bg-main-background shadow-md sticky top-0 z-50">
      <nav className="w-[1024px] h-[100px] px-[20px] flex flex-row justify-between mx-auto items-center">
        {/* logo - 다음에 link 사이 img 넣기기 */}
        <div className="w-[200px] h-[70px] bg-[#ffafaf]">로고</div>
        {/* 책 이름 가져오기 */}
        <div className="text-text-first service-accent1">책 제목</div>
        {/* <div
          onClick={onClose}
          className="bg-red-400 w-[160px] h-[70px]">
          나가기
        </div> */}
        <CloseBtn onClose={onClose} />
      </nav>
    </header>
  );
}

const CloseBtn = ({ onClose }) => {
  // const [showModal, setShowModal] = useState(false);
  // const navigate = useNavigate();
  // const location = useLocation();

  // const handleExit = () => {
  //   setShowModal(true);
  // };

  // const handleConfirm = () => {
  //   navigate('/room'); // 특정 페이지로 이동
  // };

  // const handleCancel = () => {
  //   setShowModal(false);
  // };

  return (
    <button
      onClick={onClose}
      className="h-[70px] px-5 py-2 bg-main-choose rounded-[100px] justify-start items-center gap-2.5 inline-flex overflow-hidden">
      <div
        className="w-[50px] h-[50px] relative  overflow-hidden"
        style={{ backgroundImage: "url('/Common/close.png')" }}
      />
      <div className="text-white service-bold1">나가기</div>
    </button>
  );
};
