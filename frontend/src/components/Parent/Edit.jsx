import { useProfile } from "@/store/parentStore";
import React, { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';

export default function ProfileEdit() {
    const { profileImg, loginId, email, nickname, birth, updateProfile, isNicknameAvailable, updateProfileImage } = useProfile();
    
    const [newNickname, setNewNickname] = useState(nickname);
    const [newBirth, setNewBirth] = useState(birth);
    const [newProfileImg, setProfileImg] = useState(profileImg);

    const fileInputRef = useRef(null);

    useEffect(() => {
        setNewNickname(nickname);
        setNewBirth(birth);
    }, [nickname, birth]);

    useEffect(() => {
        setProfileImg(profileImg);
    }, [profileImg])

    const handleSave = () => {
        const updatedData = {
            nickname: newNickname,
            birth: newBirth,
        };

        console.log("업데이트할 데이터:", updatedData);
        updateProfile(updatedData);
    };

    // 파일 선택 후 실행될 핸들러
    const handleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append("profileImage", file);
    
        try {
            await updateProfileImage(formData);
            console.log("프로필 이미지 업데이트 성공");
            // 업데이트 후 최신 이미지로 상태를 갱신하는 로직 추가(예: 새로운 이미지 URL 받기)
        } catch (error) {
            console.error("프로필 이미지 업데이트 실패:", error);
            alert("프로필 이미지 업데이트에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
    };

    return (
        <div className="min-h-screen p-4">
            {/* 흰배경 */}
            <div className="space-x-[50px] bg-white w-[635px] h-[568px] shadow-md ">
                <div className="flex flex-col items-center">
                    <div className="mt-[25px] ml-[28px] space-y-[16px] space-x-[28px] flex items-center">

                        <img className="rounded-full w-[150px] h-[150px]" src={profileImg ? profileImg : "/Parent/Edit/profile-edit-user-img.png"} alt="" />

                        <div className="flex flex-col items-center space-y-[10px]">
                            <button onClick={handleButtonClick} className="w-[150px] h-[38px] rounded-[30px] bg-main-btn service-regular3 text-text-first border border-[#787878]">사진 바꾸기</button>
                            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleProfileImageChange}/>
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
                        <InputLoginIdItem loginId={loginId} />
                        <InputEmailItem email={email} />
                        <InputNickNameItem nickname={newNickname} setNickname={setNewNickname} isNicknameAvailable={isNicknameAvailable} />
                        <InputBirthItem birth={newBirth} setBirth={setNewBirth} />
                        <div className="flex justify-end">
                            <button onClick={handleSave} className="mt-[12px] w-[150px] h-[38px] rounded-[30px] bg-main-btn service-regular3 text-text-first border border-[#787878]">저장 하기</button>

                        </div>
                        
                    </div>
                </div>

            </div>
        </div>
    );
}

function InputLoginIdItem({loginId}) {
    return (
        <div className="flex flex-col items-start">
            <div className=" service-regular3 text-text-first mb-[8px]">아이디</div>
            <input className="bg-gray-200 w-[357px] h-[38px] rounded-[8px] pl-[16px] pt-[12px] pb-[12px]" placeholder={loginId} type="text" disabled />
        </div>
    );
}

function InputEmailItem({email}) {
    return (
        <div className="flex flex-col items-start">
            <div className=" service-regular3 text-text-first mb-[8px]">이메일</div>
            <input className="bg-gray-200 w-[357px] h-[38px] rounded-[8px] pl-[16px] pt-[12px] pb-[12px]" placeholder={email} type="text" disabled />
        </div>
    );
}

function InputNickNameItem({ nickname, setNickname, isNicknameAvailable }) {
    return (
        <div className="flex flex-col items-start">
            <div className=" service-regular3 text-text-first mb-[8px]">닉네임</div>
            <div className="flex space-x-[16px]">
                <input className="w-[246px] h-[42px] rounded-[8px] pl-[16px] pt-[12px] pb-[12px] border-[1px] border-gray-400" value={nickname??""} onChange={(e) => setNickname(e.target.value)} type="text" />
                <div className="flex items-center justify-center bg-main-pink w-[95px] h-[38px] rounded-[8px] shadow-md hover:bg-main-beige hover:cursor-pointer">
                    <div className="service-regular3 " onClick={() => confirmDuplicate(isNicknameAvailable, nickname)}>중복확인</div>
                    <div>☑️</div>
                </div>
            </div>
        </div>
    );
}

async function confirmDuplicate(isNicknameAvailable, nickname) {
    try {
        const available = await isNicknameAvailable(nickname);
        if(available){
            Swal.fire({
                    title: `<div class="flex justify-center items-center"><div class="w-[84px] h-[84px] bg-[url('/Login/success.png')] bg-cover"></div></div>`,
                    html: `
                      <div class="text-center text-text-first auth-bold2 mb-[20px]">
                        사용 가능한 닉네임이에요.
                      </div>
                    `,
                    width: 430, // 모달의 너비
                    heightAuto: false, // 높이 자동 조정 비활성화
                    padding: '20px', // 내부 여백
                    background: '#fff', // 배경색
                    showConfirmButton: true,
                    confirmButtonText: '확인',
                    customClass: {
                      popup: 'rounded-lg shadow-lg',
                      confirmButton: 'w-[120px] h-[50px] bg-gray-700 text-white auth-regular1 px-6 py-2 rounded-md hover:bg-gray-800',
                      closeButton: 'text-gray-400 hover:text-gray-600'
                    },
                    buttonsStyling: false // 기본 버튼 스타일 제거
                  });
        } else {
            Swal.fire({
                    title: `<div class="flex justify-center items-center"><div class="w-[84px] h-[84px] bg-[url('/Login/exclamation-circle-solid.png')] bg-cover"></div></div>`,
                    html: `
                      <div class="text-center text-text-first auth-bold2 mb-[20px]">
                        사용할 수 없는 닉네임이에요.
                      </div>
                    `,
                    width: 430, // 모달의 너비
                    heightAuto: false, // 높이 자동 조정 비활성화
                    padding: '20px', // 내부 여백
                    background: '#fff', // 배경색
                    showConfirmButton: true,
                    confirmButtonText: '확인',
                    customClass: {
                      popup: 'rounded-lg shadow-lg',
                      confirmButton: 'w-[120px] h-[50px] bg-gray-700 text-white auth-regular1 px-6 py-2 rounded-md hover:bg-gray-800',
                      closeButton: 'text-gray-400 hover:text-gray-600'
                    },
                    buttonsStyling: false // 기본 버튼 스타일 제거
                  });
        }
    } catch (error) {
        console.error("닉네임 중복 확인 중 오류:", error);
        Swal.fire({
            title: `<div class="flex justify-center items-center"><div class="w-[84px] h-[84px] bg-[url('/Login/exclamation-circle-solid.png')] bg-cover"></div></div>`,
            html: `
              <div class="text-center text-text-first auth-bold2 mb-[20px]">
                서버연결에 실패했습니다.
              </div>
            `,
            width: 430, // 모달의 너비
            heightAuto: false, // 높이 자동 조정 비활성화
            padding: '20px', // 내부 여백
            background: '#fff', // 배경색
            showConfirmButton: true,
            confirmButtonText: '확인',
            customClass: {
              popup: 'rounded-lg shadow-lg',
              confirmButton: 'w-[120px] h-[50px] bg-gray-700 text-white auth-regular1 px-6 py-2 rounded-md hover:bg-gray-800',
              closeButton: 'text-gray-400 hover:text-gray-600'
            },
            buttonsStyling: false // 기본 버튼 스타일 제거
          });
    }
}

function InputBirthItem({ birth, setBirth }) {
    return (
        <div className="flex flex-col items-start">
            <div className=" service-regular3 text-text-first mb-[8px]">생년월일</div>
            <input className="w-[357px] h-[38px] rounded-[8px] pl-[16px] pt-[12px] pb-[12px] border-[1px] border-gray-400" value={birth??""} onChange={(e) => setBirth(e.target.value)} type="date" />
        </div>
    );
}
