import React from "react";

export default function ProfileEdit() {
    return (
        <div className="min-h-screen p-4">
            {/* 흰배경 */}
            <div className="space-x-[50px] bg-white w-[635px] h-[568px] shadow-md ">
                <div className="flex flex-col items-center">
                    <div className="mt-[25px] ml-[28px] space-y-[16px] space-x-[28px] flex items-center">

                        <img className="rounded-full w-[150px] h-[150px]" src="/Parent/Edit/profile-edit-user-img.png" alt="" />

                        <div className="flex flex-col items-center space-y-[10px]">
                            <button className="w-[150px] h-[38px] rounded-[30px] bg-main-btn service-regular3 text-text-first border border-[#787878]">사진 바꾸기</button>
                            {/* 모달 필요함 */}
                            <a href="">
                                <div className="flex">
                                    <img className="w-[20px] h-[20px] mr-[4px]" src="/Parent/Edit/profile-edit-icon.png" alt="" />
                                    <div className="service-regular3 text-text-second">비밀번호 변경</div>
                                </div>
                            </a>
                        </div>

                    </div>
                    <div className="mt-[14px] ml-[28px] space-y-[6px]">
                        <InputEmailItem />
                        <InputLoginIdItem />
                        <InputNickNameItem />
                        <InputBirthItem />
                        <div className="flex justify-end">
                            <button className="mt-[12px] w-[150px] h-[38px] rounded-[30px] bg-main-btn service-regular3 text-text-first border border-[#787878]">저장 하기</button>

                        </div>
                        
                    </div>
                </div>

            </div>
        </div>
    );
}

function InputEmailItem() {
    return (
        <div className="flex flex-col items-start">
            <div className=" service-regular3 text-text-first mb-[8px]">이메일</div>
            <input className="bg-gray-200 w-[357px] h-[38px] rounded-[8px] pl-[16px] pt-[12px] pb-[12px]" placeholder="non-edit" type="text" disabled />
        </div>
    );
}

function InputLoginIdItem() {
    return (
        <div className="flex flex-col items-start">
            <div className=" service-regular3 text-text-first mb-[8px]">아이디</div>
            <input className="bg-gray-200 w-[357px] h-[38px] rounded-[8px] pl-[16px] pt-[12px] pb-[12px]" placeholder="non-edit" type="text" disabled />
        </div>
    );
}

function InputNickNameItem() {
    return (
        <div className="flex flex-col items-start">
            <div className=" service-regular3 text-text-first mb-[8px]">닉네임</div>
            <div className="flex space-x-[16px]">
                <input className="w-[246px] h-[42px] rounded-[8px] pl-[16px] pt-[12px] pb-[12px] border-[1px] border-gray-400" placeholder="non-edit" type="text" />
                <div className="flex items-center justify-center bg-main-pink w-[95px] h-[38px] rounded-[8px] shadow-md hover:bg-main-beige hover:cursor-pointer">
                    <div className="service-regular3 " onClick={confirmDuplicate}>중복확인</div>
                    <div>☑️</div>
                </div>
            </div>
        </div>
    );
}

function confirmDuplicate(){
    alert("중복확인")
}

function InputBirthItem() {
    return (
        <div className="flex flex-col items-start">
            <div className=" service-regular3 text-text-first mb-[8px]">생년월일</div>
            <input className="w-[357px] h-[38px] rounded-[8px] pl-[16px] pt-[12px] pb-[12px] border-[1px] border-gray-400" placeholder="non-edit" type="date" />
        </div>
    );
}
