package com.ssafy.backend.member.service;

import com.ssafy.backend.common.service.S3Service;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.member.dto.MemberDto;
import com.ssafy.backend.member.dto.request.ChangePasswordRequestDTO;
import com.ssafy.backend.member.dto.request.UpdateMemberRequestDTO;
import com.ssafy.backend.member.dto.response.MemberResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 *  author : lee youngjae
 *  date : 2025.01.25
 *  description : 멤버 서비스(마이페이지 관련)
 *  update
 *      1.
 * */

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final S3Service s3Service;
    private final PasswordEncoder passwordEncoder;
    private final EmailSendService emailSendService;


    @Transactional(readOnly = true)
    public MemberResponseDTO getMember(String loginId) {
        Member member = memberRepository.getMemberByLoginIdEquals(loginId)
                .orElseThrow(() -> new BadRequestException("회원이 존재하지 않습니다.: " + loginId));

        return MemberResponseDTO.builder()
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
    public MemberResponseDTO updateMember(String LoginId, UpdateMemberRequestDTO updateMemberRequestDTO) {
        Member member = memberRepository.getMemberByLoginIdEquals(LoginId)
                .orElseThrow(() -> new BadRequestException("회원이 존재하지 않습니다.: " + LoginId));

        if (updateMemberRequestDTO.getNickname() != null) {
            member.setNickname(updateMemberRequestDTO.getNickname());
        }

        if (updateMemberRequestDTO.getBirth() != null) {
            member.setBirth(updateMemberRequestDTO.getBirth());
        }

        return MemberResponseDTO.builder()
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
    public String updateProfileImage(String loginId, MultipartFile profileImage) {
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
                String s3Path = s3Service.updateFile(member.getProfileImg() ,profileImage);
                member.setProfileImg(s3Path);
            }

            return member.getProfileImg();

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
    public List<MemberDto> getAllMembers(String loginId) {
        List<MemberDto> members = memberRepository.findAllExceptMe(loginId)
                .stream()
                .map(member -> new MemberDto(member.getId(), member.getLoginId(), member.getNickname(), member.getProfileImg(), false))
                .collect(Collectors.toList());
        return members;
    }

    @Transactional
    public void findPasswordService(String loginId, String email) {
        Member member=memberRepository.findByLoginIdAndEmail(loginId, email).orElseThrow(()->new BadRequestException("아이디 또는 이메일을 확인해주세요"));
        System.out.println(member);
        if(member.getIsDeleted()){
            throw new BadRequestException("아이디 또는 비밀번호를 확인해주세요.");
        }
        String password=emailSendService.passwordEmail(email);
        member.setPassword(passwordEncoder.encode(password));
        memberRepository.save(member);
    }
}
