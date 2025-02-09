package com.ssafy.backend.member.service;

import com.ssafy.backend.common.S3Service;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.dto.MemberDto;
import com.ssafy.backend.member.dto.request.ChangePasswordRequestDTO;
import com.ssafy.backend.member.dto.request.RegisterRequest;
import com.ssafy.backend.member.dto.request.UpdateMemberRequestDTO;
import com.ssafy.backend.member.dto.response.GetMemberResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final S3Service s3Service;
    private final PasswordEncoder passwordEncoder;


    @Transactional(readOnly = true)
    public GetMemberResponseDTO getMember(String loginId) {
        try{
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
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("잘못된 요청입니다.");
        }
    }

    @Transactional
    public void deleteMember(String loginId) {
        try {
            int updatedRows = memberRepository.softDeleteByLoginId(loginId);
            if (updatedRows == 0) {
                throw new BadRequestException("아이디를 찾지 못했습니다.: " + loginId);
            }
        } catch (Exception e) {
            throw new BadRequestException("잘못된 요청입니다.");
        }
    }

    @Transactional
    public void updateMember(String LoginId, UpdateMemberRequestDTO updateMemberRequestDTO) {
        try {
            Member member = new Member();
            System.out.println(LoginId);
            member = memberRepository.getMemberByLoginIdEquals(LoginId).get();
            System.out.println(updateMemberRequestDTO);
            if (updateMemberRequestDTO.getNickname() != null) {
                member.setNickname(updateMemberRequestDTO.getNickname());
            }

            if (updateMemberRequestDTO.getEmail() != null) {
                member.setEmail(updateMemberRequestDTO.getEmail());
            }

            if (updateMemberRequestDTO.getBirth() != null) {
                member.setBirth(updateMemberRequestDTO.getBirth());
            }
            System.out.println("여기까지 옴");

        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    @Transactional
    public void updateProfileImage(String loginId, MultipartFile profileImage) {
        try {
            Member member = memberRepository.getMemberByLoginIdEquals(loginId).get();

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

        try {
            Member member = memberRepository.getMemberByLoginIdEquals(loginId).get();

            if (!passwordEncoder.matches(changePasswordRequestDTO.getOldPassword(), member.getPassword())) {
                throw new BadRequestException("비밀번호 불일치");
            }

            member.setPassword(passwordEncoder.encode(changePasswordRequestDTO.getNewPassword()));
            memberRepository.save(member);
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }

    }
    public List<MemberDto> getAllMembers(){
        List<MemberDto> members = memberRepository.findAll()
                .stream()
                .map(member -> new MemberDto(member.getLoginId(), member.getNickname(), member.getProfileImg()))
                .collect(Collectors.toList());
        return members;
    }
}
