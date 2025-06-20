import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaleRoom } from '@/store/roomStore';
import { useTalePlay } from '@/store/tale/playStore';
import { Loading } from '@/common/Loading';
import DrawingBoard from '@/components/Common/DrawingBoard';
import { useViduHook } from '@/store/tale/viduStore';
import OpenviduCanvas from '@/components/TaleRoom/OpenviduCanvas';
import { LocalVideoTrack, Room, RoomEvent, Track } from 'livekit-client';
import { useUser } from '@/store/userStore';
import DrawingModal from '@/components/modal/DrawingModal';
import '@/styles/taleRoom.css';
import '@/styles/main.css';

const TaleSentenceDrawing = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5분
  const [isWarning, setIsWarning] = useState(false); // 시간 얼마 안 남으면 줄 효과
  const warningAudioRef = useRef(null); //시간 임박 효과음
  const selectAudioRef = useRef(null); //확인 효과음

  const [canRead, setCanRead] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 싱글모드일때 사용, 몇번째 그림 그렸는지 확인

  const [previousDrawings, setPreviousDrawings] = useState([]); // 싱글모드일때 사용, 이전에 그린 그림들 저장

  const [loading, setLoading] = useState(true); //메시지 수신 loading
  const [canvasReady, setCanvasReady] = useState(false); // DrawingBoard 렌더링
  const [hasPublished, setHasPublished] = useState(false);

  const canvasRef = useRef(null);
  const localCanvasTrackRef = useRef(null);
  const navigate = useNavigate();

  const { currentRoom } = useTaleRoom();
  const [showDrawingModal, setShowDrawingModal] = useState(false);
  const drawingaudioRef = useRef(new Audio('/TaleSentenceDrawing/drawing.mp3')); //그리는 중 노래
  const handleDrawingMusic = () => {
    drawingaudioRef.current.volume = 1;
    drawingaudioRef.current.currentTime = 0;
    drawingaudioRef.current.loop = true;
    drawingaudioRef.current.play().catch(() => {});
    setShowDrawingModal(false);
  };
  const {
    drawDirection,
    setDrawDirection,
    submitPicture,
    submitPictureSingle,
    addPage,
    isFinish,
  } = useTalePlay();

  const { memberId } = useUser();

  const { viduRoom, localTrack, remoteTracks, getTokenByAxios, joinViduRoom } =
    useViduHook();

  //AI에서 받은 문장들
  const sortedSentences = useMemo(() => {
    return drawDirection
      ? [...drawDirection].sort((a, b) => a.order - b.order)
      : [];
  }, [drawDirection]);

  //싱글모드 문장들
  const singleModeSentences = useMemo(
    () => sortedSentences?.filter((item) => item.sentence) || [],
    [sortedSentences]
  );

  //멀티모드 개인문장
  const multiModeSentences = useMemo(
    () => sortedSentences?.find((item) => item.owner === memberId) || null,
    [sortedSentences, memberId]
  );

  const { isSingle, isEscape } = useTaleRoom(); // 싱글모드 판단

  //livekit
  const joinVidu = async () => {
    await getTokenByAxios(2);
    await joinViduRoom();

    return;
  };

  const publishCanvasTrack = async () => {
    if (!viduRoom) return;

    const canvasElement = canvasRef.current.getCanvas();
    if (!canvasElement) {
      return;
    }

    //heartbeat
    canvasRef.current.clearCanvas();

    try {
      const stream = canvasElement.captureStream(30); // 30 FPS
      const mediaStreamTrack = stream.getVideoTracks()[0];

      if (!mediaStreamTrack) {
        return;
      }

      const localVideoTrack = new LocalVideoTrack(mediaStreamTrack);

      await viduRoom.localParticipant.publishTrack(localVideoTrack, {
        name: 'video_from_canvas',
        source: Track.Source.Camera,
      });
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (!isSingle) {
      joinVidu();
    }
  }, [isSingle]);

  useEffect(() => {
    const handleConnected = () => {
      publishCanvasTrack();
    };

    if (!viduRoom) return;

    if (viduRoom.connectionState !== 'connected') {
      viduRoom.on(RoomEvent.Connected, handleConnected);
    } else {
      handleConnected();
    }

    return () => {
      if (viduRoom) {
        viduRoom.off(RoomEvent.Connected, publishCanvasTrack);
      }
    };
  }, [viduRoom]);

  // viduRoom의 연결 상태를 감지하여 openvidu track 실행
  useEffect(() => {
    if (drawDirection.length >= 4) {
      setLoading(false);
      setShowDrawingModal(true); //페이지 로딩 완료시 모달 오픈
    }
  }, [drawDirection]);

  useEffect(() => {
    //타임아웃 임박할때 효과음
    if (isWarning && warningAudioRef.current) {
      warningAudioRef.current.muted = false;
      warningAudioRef.current.currentTime = 0;
      warningAudioRef.current.volume = 1;
      warningAudioRef.current.play().catch(() => {});
    } else {
      warningAudioRef.current.pause();
      warningAudioRef.current.volume = 0;
    }
  }, [isWarning]);

  //타이머
  useEffect(() => {
    if (loading || showDrawingModal) return;

    if (currentStep >= 4) {
      setTimeLeft(0);
      setIsWarning(false);
      canvasRef.current.completeDrawing();

      return;
    }

    // 1초마다 타이머 갱신
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 35) {
          drawingaudioRef.current.pause();
          drawingaudioRef.current.currentTime = 0;
          setIsWarning(true);
        } else {
          setIsWarning(false);
        }
        if (prev <= 1) {
          handleConfirm(); // 시간이 다 되면 자동으로 확인 버튼 클릭
          clearInterval(timer);
          setIsWarning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep, loading, showDrawingModal]);

  //완료처리
  useEffect(() => {
    if (isFinish) {
      setCanRead(true);
    }
  }, [isFinish]);

  const handleConfirmSound = async () => {
    if (selectAudioRef.current) {
      //선택 효과음 재생

      selectAudioRef.current.volume = 1;
      selectAudioRef.current.currentTime = 0;
      selectAudioRef.current.play().catch(() => {});
    }
  };

  const handleConfirm = async () => {
    if (!canvasRef.current) return false;

    handleConfirmSound();

    const tmpFile = await canvasRef.current.getPNGFile();

    if (isSingle) {
      await submitPictureSingle(tmpFile);

      // 싱글모드 - 몇번째 그림 그리고 있는가
      if (currentStep <= 3) {
        setCurrentStep((prev) => prev + 1);
        setTimeLeft(300);
        setIsWarning(false);

        // 싱글모드 - 이전 그림 목록에 새로운 그림 추가

        if (previousDrawings.length < 3) {
          setPreviousDrawings([
            ...previousDrawings,
            canvasRef.current.canvas.toDataURL(),
          ]);

          // 그려진 그림 초기화
          canvasRef.current.clearCanvas();
        }
      }

      addPage();
    } else if (!isSingle) {
      await submitPicture(tmpFile);

      setCurrentStep((prev) => prev + 100);
    }
  };

  const moveToReadTale = async () => {
    if (selectAudioRef.current) {
      //선택 효과음 재생
      selectAudioRef.current.volume = 1;
      selectAudioRef.current.currentTime = 0;
      selectAudioRef.current.play().catch(() => {});
    }
    navigate('/tale/hotTale');
  };

  useEffect(() => {
    if (isEscape && !isSingle) {
      handleConfirm();
    }
  }, [isEscape]);

  useEffect(() => {
    // 페이지를 벗어날 때 음악 멈추기
    return () => {
      if (drawingaudioRef.current) {
        drawingaudioRef.current.pause();
        drawingaudioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-100">
            <Loading />
          </div>
        )}
        {showDrawingModal && (
          <DrawingModal
            onClick={() => {
              setShowDrawingModal(false);
              handleDrawingMusic();
            }}
          />
        )}
        <div
          className="w-[1024px] h-[668px] bg-contain bg-no-repeat bg-bottom flex"
          // style={{
          //   backgroundImage: "url('/TaleSentenceDrawing/sketch-bg.png')",
          //   backgroundSize: '100% 90%',
          // }}
        >
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
              className="w-[550px] h-[80px] mx-auto rounded-[10px] border-2 border-gray-400 text-center  bg-white story-basic2 text-text-first
            overflow-y-scroll">
              {/* currentStep은 1부터 시작하므로 인덱스로 사용할 때는 -1 */}
              <>{isSingle && singleModeSentences[currentStep]?.sentence}</>
              <>{!isSingle && multiModeSentences?.['sentence']}</>
            </div>

            <div className="w-[590px] h-[420px] ml-[55px] my-2">
              <DrawingBoard
                ref={canvasRef}
                width={590}
                height={420}
                usePalette={true}
                useHeartBeat={true}
              />
            </div>
            {currentStep <= 3 ? (
              <>
                <button
                  onClick={() => handleConfirm()}
                  className="h-[60px] px-3 z-10 absolute bottom-12 right-12 rounded-full bg-main-strawberry service-accent3 text-white shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] text-center">
                  확인
                </button>
              </>
            ) : (
              <>
                {canRead ? (
                  <button
                    onClick={() => moveToReadTale()}
                    className="h-[60px] px-3 z-10 absolute bottom-12 right-12 rounded-full bg-main-strawberry service-accent3 text-white shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] text-center">
                    동화보러가기
                  </button>
                ) : (
                  <button
                    disabled={!canRead}
                    className="h-[60px] px-3 z-10 absolute bottom-12 right-12 rounded-full bg-main-strawberry service-accent3 text-white shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] text-center
                    disabled:bg-slate-400">
                    <div className="tale-loader">동화가 만들어지고 있어요</div>
                  </button>
                )}
              </>
            )}
            <audio /*확인 효과음*/
              ref={selectAudioRef}
              src={'/Common/select.mp3'}
            />
          </section>

          <section className="w-[30%] px-[10px] pt-3">
            {/* 타이머 */}
            <div
              className={`relative ml-12 w-[205px] h-[70px] bg-white shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-xl border-[5px]  border-gray-500  ${isWarning ? 'time-shake red-blink' : ' border-gray-500 '}`}>
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
              <audio
                ref={warningAudioRef}
                src={'/TaleSentenceDrawing/time-out.mp3'}
                autoPlay
                muted
                onLoadedData={() => {
                  if (warningAudioRef.current && isWarning) {
                    warningAudioRef.current.muted = false;
                    warningAudioRef.current.volume = 1;
                  }
                }}
              />
            </div>

            {/* 그림 보여지는 곳(싱글은 내가 그린거, 멀티는 다른 사람 실시간) */}
            <div className="mt-4">
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
                  <div className="flex flex-col items-center gap-4">
                    {remoteTracks.length > 0 &&
                      remoteTracks.map((remoteTrack) => (
                        <OpenviduCanvas
                          key={remoteTrack.trackPublication.trackSid}
                          track={remoteTrack.trackPublication.track}
                          participantIdentity={remoteTrack.participantIdentity}
                        />
                      ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default TaleSentenceDrawing;
