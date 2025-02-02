import React, { Children, useState } from 'react';
import KeywordInput from './Keyword/KeywordInput';
import Keyword from './Keyword';
import { useTalePlay } from '@/store/tale/playStore';

export default function Playground({ picture, audio }) {
  const { tale, page, drawDirection } = useTalePlay();

  const sentences = tale?.['sentenceOwnerPairs']?.filter(
    (item) => item.sentence
  );

  return (
    <div className="w-full h-3/4 bg-main-background">
      <div className="w-full h-full flex flex-col justify-between">
        <div className="flex justify-center w-full h-full flex-[3]">
          <div className="flex flex-col items-center gap-3 py-3">
            <div className="service-bold1 fancy-underline">
              내가 바꿔볼 문장 !
            </div>
            <div className="flex items-center w-[34rem] h-14 p-4 bg-white service-regular1 rounded-md border">
              <div>{sentences?.[page]?.sentence}</div>
            </div>
          </div>
        </div>
        <div className="w-full h-full flex flex-[2] justify-between">
          <div className="flex-[3]">
            <span>Under</span>
          </div>
          <div className="flex-[2]">
            <Keyword />
          </div>
        </div>
      </div>
    </div>
  );
}
