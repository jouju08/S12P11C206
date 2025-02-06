import React, { useRef, useState, useEffect } from 'react';

export default function DrawingBoard({ width, height }) {
  // canvas ref 및 상태 변수들
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineColor, setLineColor] = useState('#000000'); // 기본 색: 검정
  const [lineWidth, setLineWidth] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  const colors = [
    '#000000', // 검정
    '#FF0000', // 빨강
    '#00FF00', // 초록
    '#0000FF', // 파랑
    '#FFFF00', // 노랑
    '#FF00FF', // 핑크/마젠타
    '#00FFFF', // 청록
    '#800080', // 보라
  ];

  // 초기 canvas 크기와 context 속성 설정
  useEffect(() => {
    const canvas = canvasRef.current;
    // 원하는 캔버스 크기 (예: 창의 80%)
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  // 이전 좌표를 저장할 변수
  let lastX = 0;
  let lastY = 0;

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 지우개 모드와 일반 그리기 모드 구분
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 20; // 지우개 두께 (원하는 값으로 조정)
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
    }

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // 전체 지우기 기능
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // canvas 내용을 blob으로 변환하여 PNG 파일로 저장
  const saveCanvas = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      // blob을 Object URL로 변환하여 다운로드 링크 생성
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'drawing.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        {/* 8가지 색상 팔레트 */}
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => {
              setIsEraser(false); // 색상을 선택하면 지우개 모드 해제
              setLineColor(color);
            }}
            style={{
              backgroundColor: color,
              width: '30px',
              height: '30px',
              margin: '0 5px',
              border:
                currentColor === color && !isEraser ? '2px solid #000' : 'none',
              cursor: 'pointer',
            }}
          />
        ))}

        {/* 지우개 모드 토글 버튼 */}
        <button
          onClick={() => setIsEraser((prev) => !prev)}
          style={{ marginRight: '5px' }}>
          {isEraser ? '그리기 모드' : '지우개 모드'}
        </button>

        {/* 전체 지우기 버튼 */}
        <button
          onClick={clearCanvas}
          style={{ marginRight: '5px' }}>
          전체 지우기
        </button>
      </div>

      {/* 그림을 그릴 캔버스 */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '1px solid #000',
          cursor: isEraser ? 'crosshair' : 'pointer',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
