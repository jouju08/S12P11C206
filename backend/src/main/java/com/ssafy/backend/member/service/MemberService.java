package com.ssafy.backend.member.service;

import com.ssafy.backend.common.S3Service;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.member.dto.request.ChangePasswordRequestDTO;
import com.ssafy.backend.member.dto.request.UpdateMemberRequestDTO;
import com.ssafy.backend.member.dto.response.GetMemberResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final S3Service s3Service;
    private final PasswordEncoder passwordEncoder;


    @Transactional(readOnly = true)
    public GetMemberResponseDTO getMember(String loginId) {
        Member member = memberRepository.getMemberByLoginIdEquals(loginId)
                .orElseThrow(() -> new BadRequestException("회원이 존재하지 않습니다.: " + loginId));

        return GetMemberResponseDTO.builder()
                .id(member.getId())
                .loginId(member.getLoginId())
                .email(member.getEmail())
                .nickname(member.getNickname())
                .loginType(member.getLoginType())
                .birth(member.getBirth())
                .profileImg(member.getProfileImg())
                .build();
    }

    @Transactional
    public void deleteMember(String loginId) {
        int updatedRows = memberRepository.softDeleteByLoginId(loginId);
        if (updatedRows == 0) {
            throw new BadRequestException("아이디를 찾지 못했습니다.: " + loginId);
        }
    }

    @Transactional
    public void updateMember(String LoginId, UpdateMemberRequestDTO updateMemberRequestDTO) {
        Member member = memberRepository.getMemberByLoginIdEquals(LoginId)
                .orElseThrow(() -> new BadRequestException("회원이 존재하지 않습니다.: " + LoginId));

        if (updateMemberRequestDTO.getNickname() != null) {
            member.setNickname(updateMemberRequestDTO.getNickname());
        }

        if (updateMemberRequestDTO.getEmail() != null) {
            member.setEmail(updateMemberRequestDTO.getEmail());
        }

        if (updateMemberRequestDTO.getBirth() != null) {
            member.setBirth(updateMemberRequestDTO.getBirth());
        }
    }

    @Transactional
    public void updateProfileImage(String loginId, MultipartFile profileImage) {
        try {
            Member member = memberRepository.getMemberByLoginIdEquals(loginId)
                    .orElseThrow(() -> new BadRequestException("회원이 존재하지 않습니다.: " + loginId));

            if (member.getProfileImg() == null || member.getProfileImg().isEmpty() ) {
                if (profileImage != null || !profileImage.isEmpty()) {
                    String s3Path = s3Service.uploadFile(profileImage);
                    member.setProfileImg(s3Path);
                    memberRepository.save(member);
                }
            } else {
                s3Service.updateFile(member.getProfileImg() ,profileImage);
            }

        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    @Transactional
    public void changePassword(String loginId, ChangePasswordRequestDTO changePasswordRequestDTO) {

        Member member = memberRepository.getMemberByLoginIdEquals(loginId)
                .orElseThrow(() -> new BadRequestException("회원이 존재하지 않습니다.: " + loginId));

        if (!passwordEncoder.matches(changePasswordRequestDTO.getOldPassword(), member.getPassword())) {
            throw new BadRequestException("비밀번호 불일치");
        }

        member.setPassword(passwordEncoder.encode(changePasswordRequestDTO.getNewPassword()));
        memberRepository.save(member);

    }
}
