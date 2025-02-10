package com.ssafy.backend.member.service;

/**
 *  author : park byeongju
 *  date : 2025.01.29
 *  description : 인증 관련 컨트롤러
 *  update
 *      1. 0129: AuthService와 중복된 역할이므로 파일 병합 함.
 * */


//@Service
//@RequiredArgsConstructor
//@Slf4j
public class AuthenticationService {
//    private final MemberRepository memberRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final RefreshTokenService refreshTokenService;
//    private final AuthenticationManager authenticationManager;
//    private final JwtUtil jwtUtil;

//    public Map<String, String> login(LoginRequest request) {
//        UsernamePasswordAuthenticationToken authToken =
//                new UsernamePasswordAuthenticationToken(request.getLoginId(), request.getPassword());
//        Authentication auth = authenticationManager.authenticate(authToken);
//
//        // 로그인 성공 시 JWT 발급
//        String accessToken = jwtUtil.generateToken(request.getLoginId());
//        String refreshToken = jwtUtil.generateRefreshToken(request.getLoginId());
//
//        refreshTokenService.saveRefreshToken(request.getLoginId(), refreshToken);
//
//        // 프론트엔드에서 accessToken / refreshToken를 쿠키 또는 로컬스토리지에 저장하여 사용
//        Map<String, String> tokens = new HashMap<>();
//        tokens.put("accessToken", accessToken);
//        tokens.put("refreshToken", refreshToken);
//
//        return tokens;
//    }


//    public void register(@RequestBody Member request) {
//        if (memberRepository.findByLoginId(request.getLoginId()).isPresent()) {
//            throw new BadRequestException("이미 사용중인 아이디입니다");
//        }
//        if (memberRepository.findByEmail(request.getEmail()).isPresent()) {
//            throw new BadRequestException("이미 사용중인 이메일입니다");
//        }
//        try {
//            Member user = Member.builder()
//                    .email(request.getEmail())
//                    .loginId(request.getLoginId())
//                    .password(passwordEncoder.encode(request.getPassword()))
//                    .nickname(request.getNickname())
//                    .isDeleted(false)
//                    .profileImg(request.getProfileImg())
//                    .loginType(request.getLoginType())
//                    .birth(request.getBirth())
//                    .build();
//            memberRepository.save(user);
//        }catch (Exception e) {
//            throw new BadRequestException("잘못된 요청입니다");
//        }
//    }
//    public Optional<Member> findByLoginId(String loginId) {
//        return memberRepository.findByLoginId(loginId);
//    }
//
//    public Optional<Member> findByEmail(String email) {
//        return memberRepository.findByEmail(email);
//    }
//
//    public Optional<Member> findByNickname(String nickname) {
//        return memberRepository.findByNickname(nickname);
//    }
//
//    public Optional<Member> findById(Integer Id) {
//        return memberRepository.findById(Id);
//    }
//
//    public boolean isMemberExists(String email, String birth) {
//        return memberRepository.findByEmailAndBirth(email, birth).isPresent();
//    }
}
