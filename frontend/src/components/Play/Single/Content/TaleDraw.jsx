import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Excalidraw,
  exportToCanvas,
  exportToBlob,
} from '@excalidraw/excalidraw';
import { useTalePlay } from '@/store/tale/playStore';
export default function TaleDraw({ page }) {
  const { submitPicture, drawDirection } = useTalePlay();
  const [excalidrawRef, setExcalidrawRef] = useState(null);

  const sortedSentences = useMemo(() => {
    return drawDirection
      ? [...drawDirection].sort((a, b) => a.order - b.order)
      : [];
  }, [drawDirection]);

  useEffect(() => {
    setOrder(0);
  }, [sortedSentences]);

  //현재 문장
  const [order, setOrder] = useState(0);

  const handleNextSentence = () => {
    setOrder((prev) => (prev < sortedSentences.length - 1 ? prev + 1 : prev));
  };

  const convertPNGandSendPicture = async () => {
    if (!excalidrawRef) {
      return;
    }
    //현재 씬의 요소와 상태
    const element = excalidrawRef.getSceneElements();
    if (!element || !element.length) {
      return;
    }
    const appState = excalidrawRef.getAppState();
    const files = excalidrawRef.getFiles();

    try {
      //exportToBlob을 사용하여 PNG Blob 생성
      const blob = await exportToBlob({
        element,
        appState,
        files,
        mimeType: 'image/png',
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `canvas-${timestamp}.png`;

      //Blob을 File 객체로 변환
      const file = new File([blob], 'drawing.png', { type: 'image/png' });

      if (!file) {
        console.log('Blob Fail');
        return;
      } else {
        const response = await submitPicture(file);
        console.log(response);
      }
    } catch (err) {
      console.log('PNG 변환 실패 : ', err);
    }
  };

  return (
    <div className="w-full h-3/4 bg-main-background">
      <div className="w-full h-full flex flex-col justify-between">
        <div className="flex justify-center w-full h-full flex-[3]">
          <div className="flex flex-col items-center gap-3 py-3">
            <div className="service-bold1 fancy-underline">
              내가 그려볼 문장 !
            </div>
            <div className="flex items-center w-[34rem] h-14 p-4 bg-white service-regular1 rounded-md border">
              <div>{sortedSentences[order]?.sentence}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center w-full h-full">
          <div className="w-[550px] h-[500px]">
            <Excalidraw excalidrawAPI={(ref) => setExcalidrawRef(ref)} />
          </div>
          <div className="flex items-center p-1">
            <button
              className="bg-main-strawberry rounded-full w-[4rem] h-[4rem] text-text-first"
              onClick={handleNextSentence}
              disabled={order >= sortedSentences.length - 1} // 마지막 문장일 경우 비활성화
            >
              <span
                className="service-bold3"
                onClick={() => convertPNGandSendPicture()}>
                확인
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
