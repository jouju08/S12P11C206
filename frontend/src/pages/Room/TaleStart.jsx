const TaleStart = () => {
  return (
    // 전체 컨테이너 (1024x668)
    <div className="relative w-[1024px] h-[668px]">
      {/* 배경 필드 이미지 */}
      <div className="absolute inset-0">
        <img
          src="/TaleStart/field-background.png"
          alt="field background"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* 열린 책 이미지 */}
      <div className="absolute bottom-0 w-full">
        <img
          src="/TaleStart/open-book.png"
          alt="open book"
          className="w-full"
        />
      </div>

      {/* 상단 말풍선 섹션 */}
      <div className="absolute top-4 left-[84px] w-[234px] h-[65px] px-[11px] py-2.5 bg-white rounded-[100px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] justify-center items-center gap-7 inline-flex overflow-hidden">
        <div className="text-center text-text-first service-regular2">
          혼자 하고 있어요
        </div>
        <img
          src="/Main/profile-img.png"
          alt="profile"
          className="w-[45px] h-[45px] relative rounded-[100px] object-cover"
        />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="absolute top-[370px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-[84px] flex justify-around items-center">
        {/* 스토리 이미지 */}
        <div className="mb-6">
          <img
            src="/TaleStart/test-story-start.jpg"
            alt="three pigs"
            className="w-[380px] mx-auto"
          />
        </div>

        {/* 텍스트 내용 */}
        <div className="text-center relative w-[380px] h-[350px] font-CuteFont text-text-first text-3xl leading-relaxed">
          {/* <p className="w-[285px] mx-auto after:content-[''] after:bg-white after:w-[319px] after:h-[368px] after:absolute after:inset-0 after:rounded-full after:blur-2xl"> */}
          <div className="w-[319px] h-[368px] absolute top-0 left-0 -z-10 bg-white rounded-[300px] blur-2xl opacity-90" />
          <p className="w-[285px] mx-auto">
            옛날 옛적에 아기돼지 삼형제가 살고 있었습니다.
            <br />
            이들은 각자 자신만의 집을 짓기로 결정했어요.
            <br />
            늑대는 첫째 돼지의 집에 와서 말했어요.
            <br />
            "문을 열어라!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaleStart;
