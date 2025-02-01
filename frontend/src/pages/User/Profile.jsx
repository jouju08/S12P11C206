import React, { useState } from 'react';
import ParentNav from '@/components/Parent/common/ParentNav';
import Edit from '@/components/Parent/Edit';
import Bookcase from '@/components/Parent/Bookcase'

export default function Profile() {

  // 선택한 탭 관리
  const [selectedComponent, setSelectedComponent] = useState('edit');

  const COMPONENTS = {
    edit: <Edit />,
    bookcase: <Bookcase />,
  };

  return (
    <div className="flex">
      {/* ParentNav에서 탭 변경 핸들러 전달 */}
      <ParentNav
        nickname="닉네임"
        loginId="아이디"
        selectedComponent={selectedComponent} // 현재 선택된 탭 전달
        onTabClick={(tab) => setSelectedComponent(tab)}
      />
      {/* 선택된 컴포넌트 렌더링 */}
      <div className="content">
        {COMPONENTS[selectedComponent]}
      </div>
    </div>
  );
}
