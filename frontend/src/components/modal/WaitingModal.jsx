export default function WaitingModal({isHost, onClick}) {  
  return(
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 bg-black" >
          <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-[380px] flex flex-col items-center">
          <div className="text-text-first font-NPSfont bg-center py-2 text-center flex flex-col items-center">
              {isHost?
              (<>
              <img src="/Waiting/host.gif"
                alt="Host GIF"
                className="w-[150px] h-[150px] object-cover mb-4"
              />
              <p className="text-xl font-semibold mb-2">방장으로 들어왔어요.</p>
              <p className="mb-2">팀원 4명이 모두 들어오면 시작해주세요!</p>
              </>):
              (<>
              <img src="/Waiting/member.gif"
                  alt="Member GIF"
                  className="w-[150px] h-[150px] object-cover mb-4"
                />
              <p className="text-xl font-semibold mb-2">팀원으로 들어왔어요.</p>
                <p className="mb-2">방장이 게임을 시작할때까지 기다려주세요!</p>
              </>)
              }
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