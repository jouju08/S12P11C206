export default function WaitingModal({onClick}) {  
    return(
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 bg-black" >
            <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-[380px] flex flex-col items-center">
            <div className="text-text-first font-NPSfont bg-center py-2 text-center flex flex-col items-center mb-2">
                <img src="/TaleSentenceDrawing/crayons.gif"
                  alt="Crayons GIF"
                  className="w-[150px] h-[150px] object-cover mb-4"
                />
                <p>제시된 문장에 맞는 그림을 그려주세요</p>
                <p>제한 시간은 5분이에요!</p>    
            </div>
          <button
            onClick={onClick}
            className="w-full bg-main-btn text-text-first rounded-full py-3 text-lg font-semibold shadow-md hover:bg-main-carrot transition duration-200">
            네. 확인했어요!
          </button>
        </div>
      </div>
    )
  }