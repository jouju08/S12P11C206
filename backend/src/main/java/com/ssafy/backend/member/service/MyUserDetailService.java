package com.ssafy.backend.member.service;

import com.ssafy.backend.common.auth.CustomUser;
import com.ssafy.backend.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class MyUserDetailService implements UserDetailsService {
    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String memberId) throws UsernameNotFoundException {
        //DB에서 정보 가져와서 return
        var result=memberRepository.findByMemberId(memberId);
        if(result.isEmpty()){
            throw new UsernameNotFoundException("아이디가 존재하지 않습니다");
        }
        val user=result.get();
        List<GrantedAuthority> authorities=new ArrayList<>();
        if(memberId.equals("admin")){
            authorities.add(new SimpleGrantedAuthority("admin"));
        }
        else
            authorities.add(new SimpleGrantedAuthority("normal"));
        CustomUser customUser=new CustomUser(user.getMemberId(), user.getPassword(), authorities);
        customUser.setNickName(user.getNickname());
        return customUser;


    }



}
