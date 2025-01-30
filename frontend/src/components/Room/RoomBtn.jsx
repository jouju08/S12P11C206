import React from 'react';

// sweetAlert2 with react
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// swal test, modal에는 추후 만들 방만들기 컴포넌트로 대체
const MyComponent = () => (
  <div>
    <h3 className="service-accent1">SweetAlert2 + React</h3>
    <p>이 모달은 나중에 width 100% height 100% 컴포넌트</p>
  </div>
);

export default function RoomBtn({ location, children }) {
  // 버튼 click 이벤트 발생 시, 모달 띄움
  const showGameModal = () => {
    withReactContent(Swal).fire({
      title: <i>확인용</i>,
      html: <MyComponent />, // 여기에 jsx 컴포넌트 가능
      showConfirmButton: true,
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
      <div className="text-first service-bold3">{children}</div>
    </div>
  );
}
