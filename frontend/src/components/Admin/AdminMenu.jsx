import React, { useEffect } from 'react';
import { adminStore } from '@/store/adminStore';
import BaseTaleAdmin from '@/components/Admin/BaseTaleAdmin';
import BaseTaleRequestAdmin from '@/components/Admin/BaseTaleRequestAdmin';

const AdminMenu = () => {
  const { selectedMenu, setSelectedMenu } = adminStore();

  return (
    <>
      <div className="flex">
        <button
          type="button"
          className={`w-1/2 py-2 px-4 transition duration-300 font-bold text-xl text-gray-700 ${
            selectedMenu === 'baseTale'
              ? 'border-b-4 border-indigo-900'
              : 'hover:border-b-4 hover:border-indigo-900'
          }`}
          onClick={() => setSelectedMenu('baseTale')}>
          BaseTale 관리
        </button>
        <button
          type="button"
          className={`w-1/2 py-2 px-4 transition duration-300 font-bold text-xl text-gray-700 ${
            selectedMenu === 'baseTaleRequest'
              ? 'border-b-4 border-indigo-900'
              : 'hover:border-b-4 hover:border-indigo-900'
          }`}
          onClick={() => setSelectedMenu('baseTaleRequest')}>
          BaseTale 요청 관리
        </button>
      </div>
      <div className="bg-white w-full">
        {selectedMenu === 'baseTale' && (
          <div className="w-[60vw]">
            <BaseTaleAdmin />
          </div>
        )}
        {selectedMenu === 'baseTaleRequest' && (
          <div className="w-[60vw]">
            <BaseTaleRequestAdmin />
          </div>
        )}
        {!selectedMenu && (
          <div className="w-[60vw] mt-5 bg-white shadow-lg h-[85vh] text-3xl font-bold text-center">
            <div className="pt-10">메뉴를 선택해주세요.</div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminMenu;
