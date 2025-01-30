import React from 'react';

// props로 백에서 동화 있는거 조회해서 넘겨줘야 해
export default function ChooseTale({ title, isActive }) {
  return (
    <div className="w-[200px] h-[270px] relative bg-gray-50 rounded-[30px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.10)] overflow-hidden">
      <div className="w-[200px] h-[270px] overflow-hidden">
        <img
          className="w-full h-full object-cover object-center"
          src="/Main/tale-cover-test.png"
        />
      </div>
      <div
        className={`service-regular1 w-[200px] px-4 py-2.5 rounded-[30px] shadow-[0px_-4px_15px_0px_rgba(0,0,0,0.25)] absolute bottom-0 ${isActive ? 'bg-main-choose text-white' : 'bg-main-point'}`}>
        <div className="text-center">{title}</div>
      </div>
    </div>
  );
}
