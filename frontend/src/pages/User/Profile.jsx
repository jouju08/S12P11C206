import React, { useEffect, useState } from 'react';
import ParentNav from '@/components/Parent/common/ParentNav';
import Edit from '@/components/Parent/Edit';
import Bookcase from '@/components/Parent/Bookcase';
import Exhibition from '@/components/Parent/Exhibition';
import { useProfile } from '@/store/parentStore';
import CollectionModal from '@/components/modal/CollectionModal';
import KidTrack from '@/components/Parent/KidTrack';

export default function Profile() {
  // 탭 선택 상태 관리
  const [selectedComponent, setSelectedComponent] = useState('edit');
  const { fetchProfile, nickname, loginId } = useProfile();

  // 모달 관련 상태 관리 (Profile 영역 내에서 모달을 띄움)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Bookcase에서 모달을 열 때 호출하는 함수
  const handleOpenModal = (data) => {
    setModalData(data);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  // 각 탭별 컴포넌트 (Bookcase에는 onOpenModal 함수를 전달)
  const COMPONENTS = {
    edit: <Edit />,
    bookcase: <Bookcase onOpenModal={handleOpenModal} />,
    exhibition: <Exhibition />,
    KidTrack: <KidTrack />,
  };

  return (
    <div className="flex relative">
      <ParentNav
        nickname={nickname}
        loginId={loginId}
        selectedComponent={selectedComponent}
        onTabClick={(tab) => setSelectedComponent(tab)}
      />
      {/* content 영역에 relative 포지셔닝을 주어 모달이 그 내부에서 위치하도록 함 */}
      <div className="content relative">
        {COMPONENTS[selectedComponent]}
        {modalOpen && (
          <div className="absolute top-0 left-0 w-full h-full z-50">
            <CollectionModal data={modalData} handleExit={handleCloseModal} />
          </div>
        )}
      </div>
    </div>
  );
}
