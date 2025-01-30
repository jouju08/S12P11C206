import React from 'react';
import { Link } from 'react-router-dom';

export default function NavMenu({ location, linkTo, children }) {
  const path = '/Main/';

  return (
    <Link
      to={linkTo}
      className="w-[137px] h-[200px] py-[21px] bg-main-btn rounded-tr-[30px] rounded-bl-[30px] border border-gray-200 flex-col justify-center items-center inline-flex overflow-hidden">
      <div className="w-[137px] h-[158px] px-2.5 py-1.5 flex-col justify-between items-center inline-flex overflow-hidden">
        <div className="w-16 h-16 justify-center items-center inline-flex">
          <img
            className="w-16 h-16"
            src={`${path}${location}`}
          />
        </div>
        <div className="self-stretch text-center text-first service-accent2">
          {children}
        </div>
      </div>
    </Link>
  );
}
