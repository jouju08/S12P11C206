import React from 'react';

const ChildrenBtn = ({ isFriend }) => {
  return <>{renderChildrenBtn(isFriend)}</>;
};

export default ChildrenBtn;

const renderChildrenBtn = (isFriend) => {
  const buttonConfig = {
    yes: { text: '이미 친구!', bgColor: 'bg-main-btn' },
    no: { text: '+ 친구추가', bgColor: 'bg-main-point' },
    pending: { text: '신청중', bgColor: 'bg-gray-100' },
  };

  const { text, bgColor } = buttonConfig[isFriend] || buttonConfig['pending'];

  return (
    <button
      className={`w-[90px] h-10 p-2 leading-relaxed text-text-second service-regular3 ${bgColor} rounded-2xl shadow-[3px_3px_4px_0px_rgba(0,0,0,0.10)] justify-center items-center`}>
      {text}
    </button>
  );
};
