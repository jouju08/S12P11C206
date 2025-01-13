
### 3D 가면을 구현하기 위해 필요한 기술



https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/face_mesh.md

### 얼굴 추적
- OpenCV: 얼굴 감지 및 위치 추적
- MediaPipe: 얼굴의 468개 랜드마크를 추적하여 정확한 얼굴 위치, 각도, 크기를 감지
- ARKit/ARCore: 얼굴의 위치와 회전을 감지하는 AR 플랫폼

### 3D 이미지화 및 가면 렌더링
- ThreeJS : 3D 렌더링 제공
(Meta 등의 제공은 대부분 Unity 플랫폼 기준으로 제공되는 라이브러리)

### 결론론

1. 이미지화 및 가면 렌더링링 - 평면 이미지 가면을 3D화 시켜 주어야 한다. -> ThreeJS
2. 얼굴 추적 - 가면을 얼굴의 위치에 맞게 배치해주어야 한다. -> mediapipe facemesh


## Redis 시작하기
### 1. 의존성 추가
`implementation 'org.springframework.boot:spring-boot-starter-data-redis'`
### 2. Redis 호스트 설정
```
spring:
  redis:
    host: localhost
    port: 6379
```
### 3. Redis 설정
```
@Configuration
public class RedisConfig {

    @Value("${spring.redis.host}")
    private String host;

    @Value("${spring.redis.port}")
    private int port;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(host, port);
    }
}
```
### 4-1 레파지토리 형식
- Domain Entity를 Redis Hash로 만들 수 있다다.

#### Entity
```
@Getter
@RedisHash(value = "people", timeToLive = 30)
public class Person {

    @Id
    private String id;
    private String name;
    private Integer age;
    private LocalDateTime createdAt;

    public Person(String name, Integer age) {
        this.name = name;
        this.age = age;
        this.createdAt = LocalDateTime.now();
    }
}
```

#### Repositoty
```
public interface PersonRedisRepository extends CrudRepository<Person, String> {
}
```

#### Example
```
@SpringBootTest
public class RedisRepositoryTest {

    @Autowired
    private PersonRedisRepository repo;

    @Test
    void test() {
        Person person = new Person("Park", 20);

        // 저장
        repo.save(person);

        // `keyspace:id` 값을 가져옴
        repo.findById(person.getId());

        // Person Entity 의 @RedisHash 에 정의되어 있는 keyspace (people) 에 속한 키의 갯수를 구함
        repo.count();

        // 삭제
        repo.delete(person);
    }
}
```
 - JPA와 동일하게 사용
 - id 값을 따로 설정하지 않으면 랜덤한 키값
 - 저장할때 `save()`, 조회할 때 findById()
