import { useEffect, useState, useRef, useMemo } from 'react';
import {
  Excalidraw,
  exportToBlob,
  exportToCanvas,
} from '@excalidraw/excalidraw';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTaleRoom } from '@/store/roomStore';
import { useTalePlay } from '@/store/tale/playStore';

// 백에서 문장 4개가 어떻게 넘어오는지 모르겠음
// 그냥 받았다고 치자
const sentences = [
  '첫째 아기 돼지는 구름으로 집을 지었습니다.',
  '둘째 아기 돼지는 나무로 집을 지었습니다.',
  '셋째 아기 돼지는 벽돌로 집을 지었습니다.',
  '늑대가 후우 불어 집을 무너뜨렸습니다.',
];

const TaleSentenceDrawing = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5분
  const excalidrawAPIRef = useRef(null);
  const navigate = useNavigate();

  const { drawDirection, submitPicture } = useTalePlay();

  //AI에서 받은 문장들
  const sortedSentences = useMemo(() => {
    return drawDirection
      ? [...drawDirection].sort((a, b) => a.order - b.order)
      : [];
  }, [drawDirection]);

  // 싱글모드인가 아닌가
  const { isSingle } = useTaleRoom();

  // 싱글모드일때 사용, 몇번째 그림 그렸는지 확인
  const [currentStep, setCurrentStep] = useState(1);
  // 싱글모드일때 사용, 이전에 그린 그림들 저장
  const [previousDrawings, setPreviousDrawings] = useState([]);

  // 컴포넌트 마운트 시 타이머 시작
  useEffect(() => {
    const timer = setInterval(() => {
      // 1초마다 타이머 갱신
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 시간이 다 되면 자동으로 확인 버튼 클릭
          handleConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 확인 버튼 누름 or 5분 지남
  const handleConfirm = async () => {
    if (!excalidrawAPIRef.current) return;

    const elements = excalidrawAPIRef.current.getSceneElements();
    const appState = excalidrawAPIRef.current.getAppState();
    const files = excalidrawAPIRef.current.getFiles();

    try {
      // 백엔드로 그린 그림 제출
      // 현재 그린 그림을 PNG 형식으로 변환
      const exportedImage = await exportToBlob({
        elements,
        appState,
        files,
        mimeType: 'image/png',
      });

      //파일이름용
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `canvas-${timestamp}.png`;

      const file = new File([blob], fileName, { type: 'image/png' });

      if (!file) {
        console.log('Fail File');
        return;
      } else {
        const response = await submitPicture(file);
        console.log(response);
      }

      console.log('🖼️ 그린 그림 제출하고 응답 : ', response);

      // 싱글모드 canvas
      const drawing = await exportToCanvas({
        elements,
        appState,
        file,
        getDimensions: () => {
          return { width: 235, height: 168 };
        },
      });

      const ctx = drawing.getContext('2d');

      // 싱글모드 - 이전 그림 목록에 새로운 그림 추가
      setPreviousDrawings([...previousDrawings, ctx.toDataURL()]);

      // 싱글모드 - 몇번째 그림 그리고 있는가
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
        setTimeLeft(300);
        // 그려진 그림 초기화
        excalidrawAPIRef.current.resetScene();
      }
    } catch (error) {
      console.error('Error uploading drawing:', error);
    }
  };

  useEffect(() => {
    // 뒤로가기 방지
    window.history.pushState(null, document.title, window.location.href);
    const preventBack = () => {
      window.history.pushState(null, document.title, window.location.href);
    };
    window.addEventListener('popstate', preventBack);

    // 새로고침 방지
    const preventRefresh = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', preventRefresh);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('popstate', preventBack);
      window.removeEventListener('beforeunload', preventRefresh);
    };
  }, []);

  return (
    <div
      className="w-[1024px] h-[668px] bg-cover flex"
      style={{
        backgroundImage: "url('/TaleSentenceDrawing/field-background.png')",
      }}>
      <section className="w-[70%] relative text-center">
        {/* 내가 그려볼 문장 */}
        <div className="py-3 justify-start items-center inline-flex overflow-hidden">
          <div className="w-[240px] h-[53px] relative">
            <div className="w-[240px] h-5 left-0 top-[33px] absolute bg-main-beige z-0" />
            <div className="text-center text-text-first service-accent1 relative z-10">
              내가 그려볼 문장!
            </div>
          </div>
          <img
            className="w-[50px] h-[50px]"
            src="/TaleSentenceDrawing/crayon.png"
          />
        </div>

        <div className="w-[600px] mx-auto rounded-[10px] border border-gray-200 text-center py-2 bg-white story-basic2 text-text-first">
          {/* currentStep은 1부터 시작하므로 인덱스로 사용할 때는 -1 */}
          {sentences[currentStep - 1]}
        </div>

        <div className="w-[590px] h-[420px] ml-[55px] mt-[40px]">
          <Excalidraw
            excalidrawAPI={(api) => {
              excalidrawAPIRef.current = api;
            }}
            initialData={{
              elements: [],
              appState: { viewBackgroundColor: null, scrollX: 0, scrollY: 0 },
              scrollToContent: false,
            }}
          />
        </div>

        <button
          onClick={currentStep === 4 ? () => navigate('/story') : handleConfirm}
          className="h-[60px] px-3 z-10 absolute bottom-8 right-6 rounded-full bg-main-strawberry service-accent3 text-white shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] text-center">
          {currentStep === 4 ? '동화보러가기' : '확인'}
        </button>
      </section>

      <section className="w-[30%] px-[25px] pt-3">
        {/* 타이머 */}
        <div className="relative ml-7 w-[206px] h-[70px] bg-white shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-500">
          <div className="left-[25px] top-0 absolute text-text-firest text-base font-normal font-NPSfont">
            남은 시간
          </div>
          <div className="left-[60px] top-[17px] absolute text-main-carrot service-accent1">
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
            {String(timeLeft % 60).padStart(2, '0')}
          </div>
          <img
            src="/TaleSentenceDrawing/time.png"
            alt="타이머 이미지"
            className="w-[50px] h-[50px] z-10 absolute top-[15%] left-[-25px]"
          />
        </div>

        {/* 그림 보여지는 곳(싱글은 내가 그린거, 멀티는 다른 사람 실시간) */}
        <div className="mt-5">
          {/* 싱글 모드일 때 */}
          {isSingle == true && (
            <div className="flex flex-col items-center gap-4">
              {previousDrawings.map((drawing, index) => (
                <div
                  key={index}
                  className="bg-white w-[236px] h-[168px]">
                  <img
                    src={drawing}
                    alt={`Previous drawing ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
              {/* 남은 "무엇을 그릴까?" 박스를 배열로 생성하여 렌더링 */}
              {Array(3 - previousDrawings.length)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="bg-white flex justify-center items-center text-text-third story-basic3 w-[236px] h-[168px] boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)">
                    무엇을 그릴까?
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TaleSentenceDrawing;
