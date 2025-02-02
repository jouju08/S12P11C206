import React, { Children, useState } from 'react';
import KeywordInput from './Keyword/KeywordInput';
import Keyword from './Keyword';
import { useTalePlay } from '@/store/tale/playStore';
import TaleWrite from './Content/TaleWrite';
import TaleDraw from './Content/TaleDraw';

export default function Playground({ picture, audio }) {
  const { tale, page, drawDirection } = useTalePlay();

  const sentences = tale?.['sentenceOwnerPairs']?.filter(
    (item) => item.sentence
  );

  return (
    <div className="w-full h-full">
      {drawDirection.length < 1 ? (
        <TaleWrite
          page={page}
          sentences={sentences}
        />
      ) : (
        <TaleDraw page={page} />
      )}
    </div>
  );
}
