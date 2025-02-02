import React from 'react';

// sweetAlert2 with react
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function RoomBtn({ numOfPerson, location, children }) {
  // 동화방 click 이벤트 발생 시, 모달 띄움
  const showGameModal = () => {
    const iframeSrc = numOfPerson === 1 ? '/tale' : '/tale/lobby';

    withReactContent(Swal).fire({
      // html: <MyComponent />, // 여기에 jsx 컴포넌트 가능
      html: (
        <iframe
          src={iframeSrc}
          className="w-full h-[768px]"
        />
      ), // 여기에 jsx 컴포넌트 가능
      showConfirmButton: true,
      allowOutsideClick: false,
      customClass: {
        popup: 'h-[768px] w-[1024px]',
      },
      animation: false,
    });
  };

  return (
    <div
      onClick={showGameModal}
      className="cursor-pointer h-[45px] px-3 py-1 bg-main-btn rounded-[50px] border border-gray-200 justify-center items-center gap-1.5 inline-flex overflow-hidden hover:bg-main-point transition-all ease-linear">
      <div className="w-8 h-8 bg-white/50 rounded-[50px]">
        <img
          src={`Room/${location}`}
          alt="버튼 이미지"
        />
      </div>
      <div className="text-text-first service-bold3">{children}</div>
    </div>
  );
}
