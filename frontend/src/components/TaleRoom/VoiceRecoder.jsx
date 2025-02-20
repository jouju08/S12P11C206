import React, { useState, useRef, useEffect } from 'react';

const VoiceRecorder = ({
  silenceThreshold = 0.85,
  silenceDuration = 1500,
  recordedAudio,
  setRecordedAudio,
  isRecording,
  setIsRecording,
}) => {
  const mediaRecorderRef = useRef(null);
  const chunkRef = useRef([]);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);

  const filterRef = useRef(null);

  const silenceStartTimeRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  const peakHistory = useRef([]);

  useEffect(() => {
    if (isRecording) {
      // 음성 볼륨 분석 시작
      startAnalyzing(mediaRecorderRef.current?.stream);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunkRef.current = [];

      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunkRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunkRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        setIsRecording(false);
        stopAnalyzing();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      return;
    }
  };

  // 음성 분석 및 무음 감지 함수
  const startAnalyzing = (stream) => {
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    microphoneRef.current =
      audioContextRef.current.createMediaStreamSource(stream);
    microphoneRef.current.connect(analyserRef.current);

    filterRef.current = audioContextRef.current.createBiquadFilter();
    filterRef.current.type = 'bandpass'; // 특정 대역 통과

    // 중앙 주파수 (어린이 목소리 값 성인은 몰?루)
    filterRef.current.frequency.setValueAtTime(
      500,
      audioContextRef.current.currentTime
    );

    // Q 값 조절
    // Q(Quality Factor, 품질 계수):  필터가 특정 주파수 대역을 얼마나 좁게(혹은 넓게) 통과시킬지 결정하는 값
    filterRef.current.Q.setValueAtTime(2, audioContextRef.current.currentTime);

    microphoneRef.current.connect(filterRef.current);
    filterRef.current.connect(analyserRef.current);

    analyserRef.current.fftSize = 512; // 주파수 해상도
    analyserRef.current.smoothingTimeConstant = 0.9; //노이즈 제거 효과 증가

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkSilence = () => {
      analyserRef.current.getByteFrequencyData(dataArray);

      const peakVolume = Math.max(...dataArray);
      peakHistory.current.push(peakVolume);

      if (peakHistory.current.length > 5) {
        peakHistory.current.shift(); // 오래된 값 제거
      }

      const adjustedPeak = Math.max(...peakHistory.current);

      // 평균 볼륨 계산 (0~255 범위)
      const averageVolume =
        dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;

      // 설정한 임계값 아래면 무음으로 판단
      if (adjustedPeak < silenceThreshold * 255) {
        if (!silenceStartTimeRef.current) {
          silenceStartTimeRef.current = Date.now();
        } else if (Date.now() - silenceStartTimeRef.current > silenceDuration) {
          stopRecording();
          return;
        }
      } else {
        silenceStartTimeRef.current = null;
      }
      animationFrameIdRef.current = requestAnimationFrame(checkSilence);
    };

    checkSilence();
  };

  // ResetRefs
  const stopAnalyzing = async () => {
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
      microphoneRef.current = null;
      filterRef.current = null;
    }

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    if (silenceStartTimeRef.current) {
      silenceStartTimeRef.current = null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    return;
  };

  const handleRecordClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <div>
      <button
        onClick={handleRecordClick}
        // disabled={recordedAudio !== null}
        className={`w-[140px] h-[140px] flex items-center justify-center rounded-full shadow-lg transition-all duration-200
          ${isRecording ? 'bg-main-choose' : recordedAudio ? 'bg-gray-300' : 'bg-main-background'}`}>
        <img
          src={
            isRecording
              ? '/TaleKeyword/active-mic.png'
              : '/TaleKeyword/before-mic.png'
          }
          alt="microphone"
          className={`w-[100px] h-[100px]`}
        />
      </button>
    </div>
  );
};

export default VoiceRecorder;
