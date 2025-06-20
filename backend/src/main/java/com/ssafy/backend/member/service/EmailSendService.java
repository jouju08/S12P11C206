package com.ssafy.backend.member.service;

import com.ssafy.backend.config.RedisConfig;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.MemberRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 *  author : jung juha
 *  date : 2025.01.25
 *  description : 이메일 전송 서비스
 *  update
 *      1.
 * */

@Service
@RequiredArgsConstructor
public class EmailSendService {

    private final MemberRepository memberRepository;
    private final JavaMailSender javaMailSender;
    private final RedisConfig redisConfig;

    private int authNumber;
    private String newPassword;//새로운 비밀번호
    /* 이메일 인증에 필요한 정보 */
    @Value("${spring.mail.username}")
    private String serviceName;
    private String loginId;


    //이메일로 db에서 아이디 찾아오기
    public void findIdByEmail(String email) {

        String id = memberRepository.findByEmail(email)
                .map(Member::getLoginId)
                .orElse(null);

        loginId = id;
    }

    /* 랜덤 인증번호 생성 */
    public void makeRandomNum() {
        Random r = new Random();
        String randomNumber = "";
        for(int i = 0; i < 6; i++) {
            randomNumber += Integer.toString(r.nextInt(10));
        }

        authNumber = Integer.parseInt(randomNumber);
    }

    public void makeNewPassword() {//랜덤 패스워드 생성
        String text = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String specialChars = "!@#$%^&*";
        String allChars=text+numbers+specialChars;//모두 하나 이상씩 포함되도록 일단 하나씩 넣음
        Random r= new Random();

        List<Character> passwordChars = new ArrayList<>();
        passwordChars.add(text.charAt(r.nextInt(text.length())));
        passwordChars.add(numbers.charAt(r.nextInt(numbers.length())));
        passwordChars.add(specialChars.charAt(r.nextInt(specialChars.length())));
        for(int i = 3; i < 8; i++) {
           passwordChars.add(allChars.charAt(r.nextInt(allChars.length())));
        }
        Collections.shuffle(passwordChars);//겹치지 않게끔 섞어주기
        StringBuilder key = new StringBuilder();
        for (char c : passwordChars) {
            key.append(c);
        }
        newPassword =key.toString();
    }

    /* 이메일 전송 */
    public void mailVerifySend(String setFrom, String toMail, String title, String content) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message,true,"utf-8");
            helper.setFrom(setFrom); // service name
            helper.setTo(toMail); // customer email
            helper.setSubject(title); // email title
            helper.setText(content,true); // content, html: true
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace(); // 에러 출력
        }
        // redis에 3분 동안 이메일과 인증 코드 저장
        ValueOperations<String, Object> valOperations = redisConfig.redisTemplate().opsForValue();
        valOperations.set(toMail, Integer.toString(authNumber), 180, TimeUnit.SECONDS);
    }

    //아이디 찾기용 이메일 전송
    public void mailIdSend(String setFrom, String toMail, String title, String content) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message,true,"utf-8");
            helper.setFrom(setFrom); // service name
            helper.setTo(toMail); // customer email
            helper.setSubject(title); // email title
            helper.setText(content,true); // content, html: true
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace(); // 에러 출력
        }
    }

    /* 이메일 작성 */
    public String joinEmail(String email) {
        makeRandomNum();
        String customerMail = email;
        String title = "My Fairy 회원가입을 환영합니다";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; background-color: #f4f7f6; color: #333; padding: 20px;'>"
                + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);'>"
                + "<h2 style='color: #5e5e5e; text-align: center;'>My Fairy 회원가입을 환영합니다!</h2>"
                + "<p style='font-size: 16px; line-height: 1.5;'>이메일을 인증하기 위한 절차입니다.</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>인증 번호는 <strong style='color: #ff7f50;'>" + authNumber + "</strong>입니다.</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>해당 번호를 회원가입 페이지에 입력해주세요.</p>"
                + "<br>"
                + "<div style='text-align: center; margin-top: 30px;'>"
                + "<button style='background-color: #ff7f50; color: #fff; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px;'>회원가입 페이지로 가기</button>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";
        mailVerifySend(serviceName, customerMail, title, content);
        return Integer.toString(authNumber);
    }

    public String passwordEmail(String email) {
        makeNewPassword();
        String customerMail = email;
        String title = "My Fairy 비밀번호 찾기입니다";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; background-color: #f4f7f6; color: #333; padding: 20px;'>"
                + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);'>"
                + "<p style='font-size: 16px; line-height: 1.5;'>새로운 비밀번호입니다</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>비밀번호는 <strong style='color: #ff7f50;'>" + newPassword + "</strong>입니다.</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>새로운 비밀번호로 로그인하고 비밀번호를 변경해주세요</p>"
                + "<br>"
                + "<div style='text-align: center; margin-top: 30px;'>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";
        mailVerifySend(serviceName, customerMail, title, content);
        return newPassword;
    }


    //아이디 찾기 이메일 작성
    public String findIdEmail(String email) {
        findIdByEmail(email);
        String customerMail = email;
        String title = "My Fairy 아이디 찾기 입니다";
        String content =
                "사용자의 아이디는"+loginId+"입니다";
        mailIdSend(serviceName, customerMail, title, content);
        return loginId;
    }


    /* 인증번호 확인 */
    public Boolean checkAuthNum(String email, String authNum) {
        ValueOperations<String, Object> valOperations = redisConfig.redisTemplate().opsForValue();
        Object code = valOperations.get(email);
        if (Objects.equals(code, authNum)) {
            return true;
        } else return false;
    }

}


