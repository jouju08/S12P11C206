import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';

import { FaPaintBrush, FaEraser } from 'react-icons/fa';
import { MdDeleteSweep } from 'react-icons/md';

const DrawingBoard = forwardRef(
  ({ width, height, usePalette, useHeartBeat = false }, ref) => {
    const canvasRef = useRef(null);
    const [lineColor, setLineColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(1);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEraser, setIsEraser] = useState(false);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    const border = 'border-2 border-gray-200 rounded-2xl';

    const colors = [
      { name: '검정색', value: '#000000' },
      { name: '빨간색', value: '#FF0000' },
      { name: '초록색', value: '#00FF00' },
      { name: '파란색', value: '#0000FF' },
      { name: '노란색', value: '#FFFF00' },
      { name: '분홍색', value: '#FF00FF' },
      { name: '하늘색', value: '#00FFFF' },
      { name: '주항색', value: '#FFA500' },
    ];

    useEffect(() => {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }, [width, height]);

    useEffect(() => {
      if (!useHeartBeat) return;
      const interval = setInterval(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.save();

        ctx.globalAlpha = 0.01;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 1, 1);
        ctx.restore();
      }, 1000 / 30); // 30 FPS
      return () => clearInterval(interval);
    }, [useHeartBeat]);

    useImperativeHandle(ref, () => ({
      getPNGFile: () => {
        return new Promise((resolve) => {
          const canvas = canvasRef.current;

          const exportCanvas = document.createElement('canvas');
          exportCanvas.width = canvas.width;
          exportCanvas.height = canvas.height;
          const exportCtx = exportCanvas.getContext('2d');

          exportCtx.fillStyle = 'white';
          exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

          exportCtx.drawImage(canvas, 0, 0);

          exportCanvas.toBlob((blob) => {
            const file = new File([blob], 'drawing.png', { type: 'image/png' });
            resolve(file);
          }, 'image/png');
        });
      },

      clearCanvas: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      },

      getCanvas: () => canvasRef.current,
      canvas: canvasRef.current,
    }));

    const handleMouseDown = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setLastPosition({ x, y });
      setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(x, y);

      // console.log(lastPosition.x, lastPosition.y);
      // console.log(x, y);

      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 35;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
      }

      ctx.stroke();
      setLastPosition({ x, y });
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
    };

    /////

    const handleTouchDown = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setLastPosition({ x, y });
      setIsDrawing(true);
    };

    const handleTouchMove = (e) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(x, y);

      // console.log(lastPosition.x, lastPosition.y);
      // console.log(x, y);

      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 35;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
      }

      ctx.stroke();
      setLastPosition({ x, y });
    };

    const handleTouchUp = () => {
      setIsDrawing(false);
    };

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center relative">
          {usePalette && (
            <div className="absolute inset-0 top-6">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 shadow-sm"
                aria-label="Color picker"
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>
                <FaPaintBrush
                  className="w-6 h-6"
                  style={{ color: lineColor }}
                />
              </button>
              {isColorPickerOpen && (
                <div className="absolute left-36 mt-2 p-4 bg-white rounded-lg shadow-lg z-10 min-w-[300px]">
                  <div className="grid grid-cols-4 gap-3 content-center place-items-center place-content-center">
                    {colors.map((color) => (
                      <button
                        className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-400 transition-transform duration-300 hover:scale-125"
                        key={color.value}
                        onClick={() => {
                          setIsEraser(false);
                          setLineColor(color.value);
                          setIsColorPickerOpen(false);
                        }}
                        style={{
                          backgroundColor: color.value,
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="mt-4">
                    <input
                      type="color"
                      value={lineColor}
                      onChange={(e) => setLineColor(e.target.value)}
                      className="w-full h-8 px-10 cursor-pointer bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <canvas
            ref={canvasRef}
            // className={` ${isEraser ? 'eraser-cursor' : 'cursor-crosshair'} border bg-white`}
            className={`${isEraser ? 'cursor-crosshair' : 'cursor-pointer'}  ${usePalette ? `` : `${border}`} md:cursor-pointer`}
            style={{ width, height }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchDown}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchUp}
            onTouchCancel={handleTouchUp}
          />

          <div className="flex justify-evenly gap-2">
            <button
              onClick={() => setIsEraser((prev) => !prev)}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
              title="부분 지우개 (연필 지우개 모양)">
              <FaEraser className="w-6 h-6" />
            </button>

            <button
              onClick={clearCanvas}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
              title="전체 지우개">
              <MdDeleteSweep className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default DrawingBoard;
