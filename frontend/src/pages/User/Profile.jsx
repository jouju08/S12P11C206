import React, { useEffect, useState } from 'react';
import ParentNav from '@/components/Parent/common/ParentNav';
import Edit from '@/components/Parent/Edit';
import Bookcase from '@/components/Parent/Bookcase'
import Exhibition from '@/components/Parent/Exhibition'
import { useProfile } from '@/store/parentStore';

export default function Profile() {

  // 선택한 탭 관리
  const [selectedComponent, setSelectedComponent] = useState('edit');
  
  const { fetchProfile, nickname, loginId } = useProfile();

  useEffect(() => {
    fetchProfile(); 
  }, []);


  const COMPONENTS = {
    edit: <Edit />,
    bookcase: <Bookcase />,
    exhibition: <Exhibition/>,
  };

  return (
    <div className="flex">
      {/* ParentNav에서 탭 변경 핸들러 전달 */}
      <ParentNav
        nickname={nickname}
        loginId={loginId}
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
