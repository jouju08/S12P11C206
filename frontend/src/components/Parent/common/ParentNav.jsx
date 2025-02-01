import React from "react";

export default function ParentNav({ nickname, loginId, selectedComponent, onTabClick }) {
    return (
        <div className="min-h-screen p-4">
            <div className="w-[219px] h-[568px] bg-white shadow-md p-[16px]">
                <div className="items-center justify-between border-b pb-[13px]">
                    <div>
                        <h1 className="service-regular1">{nickname}</h1>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-500 service-regular3">{loginId}</p>
                        <img
                            src="Parent/profile-kakaotalk-icon.png"
                            alt="icon"
                            className="rounded-full"
                            width={25}
                        />
                    </div>
                </div>
                <div className="pt-[10px] space-y-[16px]">
                    <MenuItem
                        icon="/Parent/profile-edit-icon.png"
                        text="회원 정보 수정"
                        item="edit"
                        selectedComponent={selectedComponent} // 현재 선택된 탭 전달
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
                        item="paint"
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
            </div>
        </div>
    );
}


function click(){
    console.log("!!")
}
function MenuItem({ icon, text, item, selectedComponent, onTabClick }) {
    const isSelected = selectedComponent === item; // 현재 선택된 탭인지 확인
    const textColor = isSelected ? "text-red-500" : "text-black"; // 조건부로 색상 설정

    return (
        <div
            className="hover:cursor-pointer flex items-center space-x-[16px] service-regular3"
            onClick={() => onTabClick(item)} // 클릭 시 해당 탭으로 변경
        >
            <img width={24} src={icon} alt={`${text} 아이콘`} />
            <p className={`font-medium ${textColor}`}>{text}</p>
        </div>
    );
}