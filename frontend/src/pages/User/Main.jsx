import React from 'react';
import NavMenu from '@/components/Main/NavMenu';

export default function Main() {
  const imgArray = [
    'nav-colored-pencils.png',
    'nav-book.png',
    'nav-drawing.png',
    'nav-proud.png',
  ];
  const menuArray = [
    <>
      동화 <br /> 만들기
    </>,
    <>
      내 동화 <br /> 책장
    </>,
    <>
      내 그림 <br /> 꾸러미
    </>,
    <>
      그림 <br /> 구경
    </>,
  ];

  const listNavMenu = imgArray.map((image, idx) => (
    <li key={idx}>
      <NavMenu location={image}>{menuArray[idx]}</NavMenu>
    </li>
  ));

  console.log(listNavMenu);
  return (
    <div>
      <ul className="h-[200px] justify-start items-center gap-5 flex overflow-hidden">
        {listNavMenu}
      </ul>
    </div>
  );
}
