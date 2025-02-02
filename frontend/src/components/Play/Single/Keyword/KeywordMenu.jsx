import { useTalePlay } from '@/store/tale/playStore';
import React from 'react';

export default function KeywordMenu({ back, reload }) {
  const { setPage } = useTalePlay();

  return (
    <div className="flex items-center justify-end gap-2">
      <div className="p-1">
        <button
          className="rounded-full w-[5rem] h-[5rem] text-text-first bg-blue-300"
          onClick={() => back()}>
          <span className="service-bold3">
            뒤로
            <br />
            가기
          </span>
        </button>
      </div>

      <div className="p-1">
        <button
          className="rounded-full w-[5rem] h-[5rem] text-text-first bg-green-400"
          onClick={() => setPage()}>
          <span className="service-bold3">다음</span>
        </button>
      </div>

      <div className="p-1">
        <button
          className="rounded-full w-[5rem] h-[5rem] text-text-first bg-yellow-400"
          onClick={() => reload}>
          <span className="service-bold3">
            다시
            <br />
            하기
          </span>
        </button>
      </div>
    </div>
  );
}
