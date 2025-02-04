import React, { useState, useRef } from 'react';
import ParticipationStatus from '@/components/TaleRoom/ParticepationStatus';
import FairyChatBubble from '@/components/Common/FairyChatBubble';
import { useTalePlay } from '@/store/tale/playStore';
import { useTaleRoom } from '@/store/roomStore';

// 확인용 더미데이터
const ParticipationList = [
  {
    id: 1,
    nickname: '더미데이터',
  },
];

const TaleKeyword = () => {
  const [mode, setMode] = useState('default'); // 현재 모드: default, typing, voice, writing
  const [inputText, setInputText] = useState(''); // 타자 입력 텍스트
  const [isNextActive, setIsNextActive] = useState(false); // 다음 버튼 활성화 상태
  const [recordedAudio, setRecordedAudio] = useState(null); // 녹음된 오디오 데이터

  const [order] = useState(0);
  const canvasRef = useRef(null); // 글쓰기 캔버스 참조

  const { isSingle } = useTaleRoom();

  const {
    tale,
    page,
    setCurrentKeyword,
    submitTotal,
    setPage,
    addKeyword,
    keywords,
  } = useTalePlay(); // 동화 API

  const sentences = tale?.['sentenceOwnerPairs']?.filter(
    (item) => item.sentence
  );

  const handleConfirm = () => {
    if (mode === 'typing' && inputText.trim()) {
      setIsNextActive(true);
    } else if (mode === 'writing') {
      const canvas = canvasRef.current;
      const pngData = canvas.toDataURL('image/png');
      console.log('PNG Data:', pngData); // PNG 데이터를 잠시 저장
      setIsNextActive(true);
    }
  };

  //싱글모드 대응
  const handleSubmitTextSingle = async (keyword) => {
    try {
      const response = await submitTotal(keyword);

      if (response.data.status == 'SU') {
        setPage();
        addKeyword(keyword);
        return true;
      }
    } catch {
      return false;
    }
  };

  const handleSumbitVoiceSingle = async (voice) => {};

  const handleSubmitPictureSingle = async (picture) => {};

  const handleReset = () => {
    setInputText('');
    setRecordedAudio(null);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setIsNextActive(false);
  };

  const handleNext = () => {
    if (mode === 'typing' && isSingle) {
      const state = handleSubmitTextSingle(inputText);

      state.then((resolve) => {
        if (resolve === true) {
          handleReset();
        }
      });
    } else if (mode === 'typing' && !isSingle) {
      console.log('Sending text to backend:', inputText);
    } else if (mode === 'voice' && isSingle) {
      console.log('Sending audio to backend:', recordedAudio);
    } else if (mode === 'voice' && !isSingle) {
      console.log('Sending audio to backend:', recordedAudio);
    } else if (mode === 'writing' && isSingle) {
      const canvas = canvasRef.current;
      const pngData = canvas.toDataURL('image/png');
      console.log('Sending PNG to backend:', pngData);
    } else if (mode === 'writing' && !isSingle) {
      const canvas = canvasRef.current;
      const pngData = canvas.toDataURL('image/png');
      console.log('Sending PNG to backend:', pngData);
    }
  };

  const modeButtons = [
    {
      mode: 'typing',
      text: '타자',
      imageSrc: '/TaleKeyword/keyword-keyboard.png',
    },
    {
      mode: 'voice',
      text: '목소리',
      imageSrc: '/TaleKeyword/keyword-mic.png',
    },
    {
      mode: 'writing',
      text: '글쓰기',
      imageSrc: '/TaleKeyword/keyword-writing.png',
    },
  ];

  return (
    <div className="relative w-[1024px] h-[668px]">
      {/* 배경 absolute */}
      <div
        className="absolute top-0 left-0 opacity-70 w-[1024px] h-[668px] bg-cover bg-center"
        style={{
          backgroundImage: "url('/TaleKeyword/field-background.png')",
        }}></div>

      {/* 참여인원 섹션 */}
      <div className="absolute top-4 left-[84px]">
        <ParticipationStatus ParticipationList={ParticipationList} />
      </div>

      {/* 제목 */}
      <div className="py-1.5 left-[367px] top-[80px] absolute justify-start items-center inline-flex overflow-hidden">
        <div className="w-[240px] h-[53px] relative">
          <div className="w-[240px] h-5 left-0 top-[33px] absolute bg-main-pink z-0" />
          <div className="text-center text-text-first service-accent1 relative z-10">
            내가 바꿔볼 문장!
          </div>
        </div>
        <img
          className="w-[50px] h-[50px]"
          src="/TaleKeyword/pencil.png"
        />
      </div>

      {/* 문장 */}
      <div className="absolute top-[150px] left-0 w-full text-center">
        <div className="h-[75px] px-[41px] py-4 bg-white rounded-[10px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] border border-[#787878] justify-start items-center gap-5 inline-flex overflow-hidden">
          <div className="text-center text-text-first story-basic3">
            첫째 아기 돼지는
          </div>
          <div className="w-[100px] h-[53px] relative bg-main-pink rounded-[10px] border border-gray-400" />
          <div className="text-center text-text-first story-basic3">
            (으)로 집을 지었습니다.
          </div>
        </div>
      </div>

      {/* 말풍선 */}
      <div
        className="w-[214px] h-[279px] absolute top-[250px] left-[100px] bg-cover"
        style={{
          backgroundImage: "url('/TaleKeyword/keyword-fairy.png')",
        }}
      />
      <div className="absolute top-[235px] left-[285px]">
        <FairyChatBubble>
          {mode === 'default' && (
            <>
              아래 버튼을 눌러서
              <br /> 단어를 채워보자!
            </>
          )}
          {mode === 'typing' && (
            <>
              동화를 어떻게 <br />
              바꿀까?
            </>
          )}
          {mode === 'voice' && (
            <>
              마이크를 눌러서 <br />
              크게 말해보자!
            </>
          )}
          {mode === 'writing' && (
            <>
              아래 하얀 도화지에 <br />
              단어를 써줄래?
            </>
          )}
        </FairyChatBubble>
      </div>

      {/* 모드별 UI */}
      {mode === 'typing' && (
        <div className="absolute bottom-[170px] right-[100px] h-[118px] px-7 py-5 bg-main-background rounded-[50px] justify-start items-center gap-5 inline-flex">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="내 단어"
            className="w-[395px] h-[78px] p-5 border border-gray-200 rounded-md story-basic1"
          />

          <ConfirmBtn onClick={handleConfirm} />
        </div>
      )}

      {mode === 'voice' && (
        <div className="absolute bottom-[150px] right-[250px] flex items-center gap-8">
          <VoiceRecorder
            recordedAudio={recordedAudio}
            setRecordedAudio={setRecordedAudio}
          />
          <ConfirmBtn onClick={handleConfirm} />
        </div>
      )}

      {mode === 'writing' && (
        <div className="absolute bottom-[140px] left-[333px] flex items-center gap-4">
          <canvas
            ref={canvasRef}
            width={470}
            height={165}
            className="border border-gray-200 rounded-xl bg-white"></canvas>

          <ConfirmBtn onClick={handleConfirm} />
        </div>
      )}

      {/* 하단 버튼들 */}
      {mode !== 'default' && (
        <div className="absolute bottom-[20px] right-[50px] flex gap-4">
          {/* 뒤로가기 */}
          <button
            onClick={() => {
              setMode('default');
              setIsNextActive(false);
            }}
            className="w-[100px] h-[100px]"
            style={{
              backgroundImage: "url('/TaleKeyword/keyword-back.png')",
            }}></button>

          {/* 다음 */}
          <button onClick={handleNext}>
            <img
              src={
                isNextActive
                  ? '/TaleKeyword/keyword-next-active.png'
                  : '/TaleKeyword/keyword-next-disable.png'
              }
              alt="다음"
              className={'w-[100px] h-[100px]'}
            />
          </button>

          {/* 다시하기 */}
          <button
            onClick={handleReset}
            className="w-[100px] h-[100px]"
            style={{
              backgroundImage: "url('/TaleKeyword/keyword-reset.png')",
            }}></button>
        </div>
      )}

      {/* 첫 번째 화면 버튼들 */}
      {mode === 'default' && (
        <div className="absolute bottom-[160px] left-[390px] flex gap-4">
          {modeButtons.map((button) => (
            <ModeButton
              key={button.mode}
              mode={button.mode}
              text={button.text}
              imageSrc={button.imageSrc}
              onClick={setMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaleKeyword;

const ModeButton = ({ mode, text, imageSrc, onClick }) => {
  return (
    <button
      onClick={() => onClick(mode)}
      className="w-[167px] h-[117px] py-2 bg-white rounded-[50px] border border-gray-100 flex-col justify-center items-center inline-flex overflow-hidden hover:bg-main-btn active:bg-main-btn transition-colors duration-100">
      <div className="w-[60px] h-[60px] justify-center items-center inline-flex">
        <img
          className="w-[60px] self-stretch"
          src={imageSrc}
          alt={text}
        />
      </div>
      <div className="self-stretch text-center text-text-first service-bold1">
        {text}
      </div>
    </button>
  );
};

const VoiceRecorder = ({ recordedAudio, setRecordedAudio }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        console.log('🔊', audioBlob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleRecordClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  // 녹음된 거 확인용 - 다운로드 부분 삭제 시 이것도 삭제
  const downloadWavFile = (audioBlob) => {
    if (!audioBlob) return;

    // Blob URL 생성
    const blobUrl = URL.createObjectURL(audioBlob);

    // 다운로드 링크 생성
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `recorded_audio_${new Date().getTime()}.wav`;

    // 링크를 DOM에 추가하고 클릭 이벤트 발생
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // cleanup
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div>
      <button
        onClick={handleRecordClick}
        disabled={recordedAudio !== null}
        className={`w-[140px] h-[140px] flex items-center justify-center rounded-full shadow-lg transition-all duration-200
          ${isRecording ? 'bg-main-choose' : recordedAudio ? 'bg-gray-300' : 'bg-main-background'}`}>
        <img
          src={
            isRecording
              ? '/TaleKeyword/active-mic.png'
              : '/TaleKeyword/before-mic.png'
          }
          alt="microphone"
          className={`w-[100px] h-[100px] ${recordedAudio ? 'opacity-50' : ''}`}
        />
      </button>

      {/* 녹음 완료 후 다운로드 버튼 클릭 시 */}
      <button onClick={() => downloadWavFile(recordedAudio)}>다운로드</button>
    </div>
  );
};

// 분홍색 확인 버튼
const ConfirmBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-main-strawberry w-[78px] h-[78px] text-white px-4 py-2 rounded-full service-bold2">
      확인
    </button>
  );
};
