import { useProfile } from "@/store/parentStore";
import React from "react";
import { useUser } from '@/store/userStore';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ParentNav({ nickname, loginId, selectedComponent, onTabClick }) {
  const { loginType,deleteUser } = useProfile();
  const{
    logout,
  }=useUser();

  const handleDeleteUser=async()=>{
      const response=await Swal.fire({
        title:"정말 탈퇴하실건가요?",
        text:"진짜요?",
        imageUrl: "/Common/sad.png", 
        imageWidth: 100,  // 이미지 너비
        imageHeight: 100, // 이미지 높이
        imageAlt:"탈퇴 이미지",
        showCancelButton:true,
        confirmButtonColor:"#d33",
        cancelButtonText:"네 탈퇴할래요",
        cancelButtonText:"아니요, 취소할래요",
      });
      if(response.isConfirmed){
        const deleteResponse=await deleteUser();
        if(!deleteResponse){
          Swal.fire("경고", "탈퇴에 실패했습니다.","error" );
        }
        else{
          const response=await Swal.fire("탈퇴 성공", "이용해주셔서 감사합니다.", "success")
          if(response.isConfirmed){
            await logout();
            // localStorage.removeItem("token");
            navigate("/")
          }
        }
      }
    };
  return (
    <div className="min-h-screen p-4">
      <div className="w-[219px] h-[568px] bg-white shadow-md p-[16px]">
        <div className="items-center justify-between border-b pb-[13px]">
          <div>
            <h1 className="service-regular1">{nickname}</h1>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-500 service-regular3">{loginId}</p>
            {loginType == "E" ? null : (
              <img
                src="Parent/profile-kakaotalk-icon.png"
                alt="icon"
                className="rounded-full"
                width={25}
              />
            )}
          </div>
        </div>
        <div className="pt-[10px] space-y-[16px] flex-grow">
          <MenuItem
            icon="/Parent/profile-edit-icon.png"
            text="회원 정보 수정"
            item="edit"
            selectedComponent={selectedComponent}
            onTabClick={onTabClick}
          />
          <MenuItem
            icon="/Parent/profile-book-icon.png"
            text="아이가 만든 동화책"
            item="bookcase"
            selectedComponent={selectedComponent}
            onTabClick={onTabClick}
          />
          <MenuItem
            icon="/Parent/profile-paint-icon.png"
            text="아이가 그린 그림"
            item="exhibition"
            selectedComponent={selectedComponent}
            onTabClick={onTabClick}
          />
          <MenuItem
            icon="/Parent/profile-request-basetale-icon.png"
            text="기본동화 요청하기"
            item="requestBaseTale"
            selectedComponent={selectedComponent}
            onTabClick={onTabClick}
          />
          <MenuItem
            icon="/Parent/profile-kids-mode-icon.png"
            text="아이 모드 돌아가기"
            item="kidsMode"
            selectedComponent={selectedComponent}
            onTabClick={onTabClick}
          />
         

        </div>
        <div className="mt-[265px] flex justify-center">
    <button
      onClick={handleDeleteUser}
      className="w-[150px] h-[38px] rounded-[30px] bg-main-btn service-regular3 text-text-first border border-[#787878] flex items-center justify-center"
    >
      <img
        src="Common/sadfairy.png"
        alt="탈퇴 아이콘"
        width={25}
        className="mr-2"
      />
      탈퇴
    </button>
  </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, text, item, selectedComponent, onTabClick }) {
  const navigate = useNavigate();
  const isSelected = selectedComponent === item;
  const textColor = isSelected ? "text-red-500" : "text-black";
  const handleClick = () => {
    if (item === "kidsMode") {
      navigate("/main");
    } else if (item === "requestBaseTale") {
      navigate("/requestBaseTale");
    } else {
      onTabClick(item);
    }
  };
  return (
    <div
      className="hover:cursor-pointer flex items-center space-x-[16px] service-regular3"
      onClick={handleClick}
    >
      <img width={24} src={icon} alt={`${text} 아이콘`} />
      <p className={`font-medium ${textColor}`}>{text}</p>
    </div>
  );
}
