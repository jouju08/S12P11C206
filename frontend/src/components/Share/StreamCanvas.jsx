import React, { useEffect, useRef } from 'react';
import { Tldraw } from 'tldraw';

export default function StreamCanvas({ streamManager }) {
  const canvasRef = useRef(null);
  const tldrawRef = useRef(null);

  useEffect(() => {
    if (streamManager && canvasRef.current) {
      streamManager.addVideoElement(canvasRef.current);
    }
  }, [streamManager]);

  return (
    <div className="fixed inset-0">
      <Tldraw ref={canvasRef} />
      {/* <video
        autoPlay
        ref={canvasRef}></video> */}
    </div>
  );
}
