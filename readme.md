# 커밋 메세지 컨벤션

### **커밋 메시지 형식**

- 제목 줄: 최대 50자, 현재형 동사로 시작.
- 본문: 제목 줄 다음 빈 줄을 추가하고, 본문에 변경 사항을 상세히 설명.
- 본문 줄 길이는 72자 이내.
- 메시지 끝에는 마침표 사용하지 않음.

### **제목 작성 규칙**

- 현재형 동사 사용: "Add", "Fix", "Update" 등.
- 명령문 형식 사용.
- 마침표 사용 금지.

### **본문 작성 규칙**

- '무엇'보다 '왜'와 '어떻게'에 집중.
- 관련된 이슈 번호를 명시적으로 포함할 것.

### **커밋의 크기**

- 커밋은 작고 간결하게 유지.
- 각 커밋은 하나의 논리적 단위에 초점.

### **커밋 메시지 예제**

- 제목: `Add login form validation`
- 본문:
  ```
  - Add client-side validation for login form
  - Ensure users cannot submit empty email or password fields
  - Relates to #123
  ```

---

## **2. 커밋 컨벤션**

### **형식**

```
<타입>: <제목>

<본문>

<이슈 참조>
```

### **타입**

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등 스타일 변경 (기능 수정 없음)
- `refactor`: 코드 리팩토링 (기능 변경 없음)
- `perf`: 성능 개선
- `test`: 테스트 추가 및 수정
- `chore`: 빌드 수정, 패키지 매니저 설정 등

### **제목**

- 50자 이내로 간결하게 작성.
- 현재형 동사로 시작.
- 마침표 생략.

### **본문**

- 제목과 한 줄 띄움.
- 변경 이유와 내용을 상세히 설명.
- 72자 이내의 줄 길이 유지.
- 관련된 이슈 번호 참조(`Relates to #123`).

### **예제**

#### 1. 기능 추가

```
feat: Add login functionality

- Implement login form submission
- Add client-side validation for email and password
- Relates to #123
```

#### 2. 버그 수정

```
fix: Resolve login button disabled issue

- Correct conditional logic for enabling login button
- Ensure correct feedback is given on validation errors
- Fixes #124
```

#### 3. 문서 수정

```
docs: Update README with setup instructions

- Add steps to set up local development environment
- Include troubleshooting tips for common issues
```
