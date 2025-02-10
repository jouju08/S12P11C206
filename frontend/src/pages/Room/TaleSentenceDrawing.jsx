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
import { Loading } from '@/common/Loading';
import DrawingBoard from '@/components/Common/DrawingBoard';
import { useViduHook } from '@/store/tale/viduStore';
import OpenviduCanvas from '@/components/TaleRoom/OpenviduCanvas';
import { LocalVideoTrack, RoomEvent, Track } from 'livekit-client';
import { useLocalParticipant } from '@livekit/components-react';

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
  const canvasRef = useRef(null);
  const localCanvasTrackRef = useRef(null);
  const navigate = useNavigate();

  const {
    drawDirection,
    setDrawDirection,
    submitPicture,
    submitPictureSingle,
    addPage,
  } = useTalePlay();

  const { viduRoom, localTrack, remoteTracks, getTokenByAxios, joinViduRoom } =
    useViduHook();

  //AI에서 받은 문장들
  const sortedSentences = useMemo(() => {
    return drawDirection
      ? [...drawDirection].sort((a, b) => a.order - b.order)
      : [];
  }, [drawDirection]);

  // 싱글모드인가 아닌가
  const { isSingle } = useTaleRoom();

  // 싱글모드일때 사용, 몇번째 그림 그렸는지 확인
  const [currentStep, setCurrentStep] = useState(0);

  // 싱글모드일때 사용, 이전에 그린 그림들 저장
  const [previousDrawings, setPreviousDrawings] = useState([]);

  //메시지 수신 loading
  const [loading, setLoading] = useState(true);

  //livekit
  useEffect(() => {
    const handleVidu = async () => {
      await joinViduRoom();
    };

    handleVidu();
  }, []);

  useEffect(() => {
    if (!viduRoom) return;

    const publishCanvasTrack = () => {
      if (!canvasRef.current) {
        console.log('canvasRef.current가 아직 준비되지 않음');
        return;
      }
      const canvasElement = canvasRef.current.getCanvas();
      if (!canvasElement) {
        console.log('캔버스 엘리먼트를 찾을 수 없음');
        return;
      }

      //heartbeat
      canvasRef.current.clearCanvas();

      try {
        const stream = canvasElement.captureStream(30); // 30 FPS
        const mediaStreamTrack = stream.getVideoTracks()[0];

        if (!mediaStreamTrack) {
          console.error('captureStream에서 videoTrack 생성 실패');
          return;
        }
        console.log('생성된 videoTrack:', mediaStreamTrack);

        const localVideoTrack = new LocalVideoTrack(mediaStreamTrack);

        viduRoom.localParticipant
          .publishTrack(localVideoTrack, {
            name: 'video_from_canvas',
            source: Track.Source.Camera,
          })
          .then(() => {
            console.log('Canvas track published successfully!');
          })
          .catch((error) => {
            console.error('Error publishing canvas track:', error);
          });
      } catch (error) {
        console.error('captureStream 호출 중 에러 발생:', error);
      }
    };

    // 이미 연결되어 있으면 바로 퍼블리시
    if (viduRoom.connectionState === 'connected') {
      publishCanvasTrack();
    } else {
      // 연결 이벤트가 발생하면 퍼블리시
      viduRoom.on(RoomEvent.Connected, publishCanvasTrack);
    }

    return () => {
      // 이벤트 리스너 정리
      if (viduRoom) {
        viduRoom.off(RoomEvent.Connected, publishCanvasTrack);
      }
    };
  }, [viduRoom]);

  // 컴포넌트 마운트 시 타이머 시작
  useEffect(() => {
    const timer = setInterval(() => {
      if (isSingle && currentStep === 4) {
        return setTimeLeft(0);
      } else {
        // 1초마다 타이머 갱신
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // 시간이 다 되면 자동으로 확인 버튼 클릭
            handleConfirm();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep]);

  //Loading 처리
  useEffect(() => {
    if (drawDirection.length > 0) {
      setLoading(false);
    }
  }, [drawDirection]);

  const handleConfirm = async () => {
    if (!canvasRef.current) return false;

    const tmpFile = await canvasRef.current.getPNGFile();

    if (isSingle) {
      await submitPictureSingle(tmpFile);
    } else if (!isSingle) {
      await submitPicture(tmpFile);
    }

    // 싱글모드 - 이전 그림 목록에 새로운 그림 추가
    setPreviousDrawings([
      ...previousDrawings,
      canvasRef.current.canvas.toDataURL(),
    ]);

    // 싱글모드 - 몇번째 그림 그리고 있는가
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      setTimeLeft(300);
      // 그려진 그림 초기화
      canvasRef.current.clearCanvas();
    }
  };

  // 확인 버튼 누름 or 5분 지남
  // const handleConfirm = async () => {
  //   if (!excalidrawAPIRef.current) return false;

  //   const elements = excalidrawAPIRef.current.getSceneElements();
  //   const appState = excalidrawAPIRef.current.getAppState();
  //   const files = excalidrawAPIRef.current.getFiles();

  //   try {
  //     // 백엔드로 그린 그림 제출
  //     // 현재 그린 그림을 PNG 형식으로 변환
  //     const exportedImage = await exportToBlob({
  //       elements,
  //       appState,
  //       files,
  //       mimeType: 'image/png',
  //     });

  //     //파일이름용
  //     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  //     const fileName = `canvas-${timestamp}.png`;

  //     const file = new File([exportedImage], fileName, { type: 'image/png' });

  //     if (!file) {
  //       console.log('Fail File');
  //       return;
  //     }

  //     //싱글모드 판단
  //     if (isSingle) {
  //       const response = await submitPictureSingle(file);
  //       addPage();
  //     } else if (!isSingle) {
  //       const response = await submitPicture(file);
  //     }

  //     // 싱글모드 canvas
  //     const drawing = await exportToCanvas({
  //       elements,
  //       appState,
  //       file,
  //       getDimensions: () => {
  //         return { width: 500, height: 500 };
  //       },
  //     });

  //     // 싱글모드 - 이전 그림 목록에 새로운 그림 추가
  //     setPreviousDrawings([...previousDrawings, drawing.toDataURL()]);

  //     // 싱글모드 - 몇번째 그림 그리고 있는가
  //     if (currentStep < 3) {
  //       setCurrentStep((prev) => prev + 1);
  //       setTimeLeft(300);
  //       // 그려진 그림 초기화
  //       excalidrawAPIRef.current.resetScene();
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error('Error uploading drawing:', error);
  //   }

  //   return false;
  // };

  const moveToReadTale = async () => {
    await handleConfirm();
    navigate('/tale/hotTale');
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
    <>
      {loading ? (
        <Loading />
      ) : (
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
            <div
              className="w-[550px] h-[100px] mx-auto rounded-[10px] border border-gray-200 text-center py-2 bg-white story-basic2 text-text-first
            overflow-y-scroll">
              {/* currentStep은 1부터 시작하므로 인덱스로 사용할 때는 -1 */}
              {/* {sortedSentences[currentStep]?.sentence} */}
              나는 싸피가좋아요 너무좋아요 싸피사랑해 미Chill정도록 사랑해요
              글자수는 어떻게 될까요 크기가 고정되면 어떻게 될지 너무 궁금해요
            </div>

            <div className="w-[590px] h-[420px] ml-[55px]">
              <DrawingBoard
                ref={canvasRef}
                width={590}
                height={420}
                usePalette={true}
                useHeartBeat={true}
              />
            </div>
            <button
              onClick={
                currentStep === 3
                  ? () => moveToReadTale()
                  : () => handleConfirm()
              }
              className="h-[60px] px-3 z-10 absolute bottom-8 right-6 rounded-full bg-main-strawberry service-accent3 text-white shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] text-center">
              {currentStep === 3 ? '동화보러가기' : '확인'}
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
              {isSingle ? (
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

                  {previousDrawings.length <= 3 &&
                    Array(3 - previousDrawings.length)
                      .fill(null)
                      .map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="bg-white flex justify-center items-center text-text-third story-basic3 w-[236px] h-[168px] boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)">
                          무엇을 그릴까?
                        </div>
                      ))}
                </div>
              ) : (
                <>
                  {remoteTracks.length > 0 &&
                    remoteTracks.map((remoteTrack) => (
                      <OpenviduCanvas
                        key={remoteTrack.trackPublication.trackSid}
                        track={remoteTrack.trackPublication.track}
                        participantIdentity={remoteTrack.participantIdentity}
                      />
                    ))}
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default TaleSentenceDrawing;
