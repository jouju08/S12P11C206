import React, { Children, useState } from 'react';
import KeywordInput from './Keyword/KeywordInput';
import Keyword from './Keyword';
import { useTalePlay } from '@/store/tale/playStore';

export default function Playground({ picture, audio }) {
  const { tale, page } = useTalePlay();

  const sentences = tale?.['sentenceOwnerPairs']?.filter(
    (item) => item.sentence
  );

  return (
    <div className="w-full h-3/4 bg-main-background">
      <div className="w-full h-full flex flex-col justify-between">
        <div className="w-full h-full flex-[3]">
          {sentences?.[page]?.sentence}
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
