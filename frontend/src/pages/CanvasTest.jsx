import DrawingBoard from '@/components/common/DrawingBoard';
import React from 'react';

export default function CanvasTest() {
  return (
    <div>
      <DrawingBoard
        width={600}
        height={600}
        usePalette={true}
      />
    </div>
  );
}
