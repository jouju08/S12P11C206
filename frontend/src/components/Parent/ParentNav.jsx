import React from "react";

export default function ParentNav({nickname, loginId}) {
    return (
        <div className="min-h-screen p-4">
            {/* 네비게이션 바 */}
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
                        textColor="text-red-500"
                        onClick={click}
                    />
                    <MenuItem
                        icon="/Parent/profile-book-icon.png"
                        text="아이가 만든 동화책"
                        onClick={click}
                    />
                    <MenuItem
                        icon="/Parent/profile-paint-icon.png"
                        text="아이가 그린 그림"
                        onClick={click}
                    />
                    <MenuItem
                        icon="/Parent/profile-kids-mode-icon.png"
                        text="아이 모드 돌아가기"
                        onClick={click}
                    />
                </div>
            </div>
        </div>
    );
}

function click(){
    console.log("!!")
}

function MenuItem({ icon, text, textColor = "text-black" , onClick}) {
    return (
        <div className="hover:cursor-pointer flex items-center space-x-[16px] service-regular3" onClick={onClick}>
            <img width={24} src={icon} alt={`${text} 아이콘`} />
            <p className={`font-medium ${textColor}`}>{text}</p>
        </div>
    );
}
