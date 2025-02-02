import { useTalePlay } from '@/store/tale/playStore';
import React, { useEffect, useState } from 'react';

export default function TaleAudioPlayer() {
  const [audioUrl, setAudioUrl] = useState();
  const [hotAudioUrl, setHotAudioUrl] = useState();

  const { tale, hotTale } = useTalePlay();

  //기본 동화 voice 변경 sideEffect
  useEffect(() => {
    const voice = tale.taleStartScriptVoice;
    setAudioUrl(voice);
  }, [tale.taleStartScriptVoice]);

  //햇 동화 voice 변경 sideEffect
  useEffect(() => {
    const voice = hotTale.taleHotScriptVoice;
    setHotAudioUrl(voice);
  }, [hotTale.taleHotScriptVoice]);

  return (
    <div>
      <audio
        src={audioUrl}
        autoPlay>
        audio
      </audio>
      Audio
    </div>
  );
}
