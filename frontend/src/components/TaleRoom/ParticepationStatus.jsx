const ParticipationStatus = ({ ParticipationList }) => {
  if (ParticipationList.length === 1) {
    return (
      <div className="w-[234px] h-[65px] px-[11px] py-2.5 bg-white rounded-[100px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] justify-center items-center gap-7 inline-flex overflow-hidden">
        <div className="text-center text-text-first service-regular2">
          혼자 하고 있어요
        </div>
        {/* 참여자 목록 중 프로필 사진 렌더링 */}
        <img
          src={participant.profileImg || "/Main/profile-img.png"}
          alt="profile"
          className="w-[45px] h-[45px] relative rounded-[100px] object-cover"
        />
      </div>
    );
  } else {
    return (
      <div className="w-[234px] h-[65px] px-[11px] py-2.5 bg-white rounded-[100px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] justify-center items-center gap-7 inline-flex overflow-hidden">
        <div className="text-center text-text-first service-regular2">
          친구들
        </div>
        {ParticipationList.map((participants, index) => {
          <div key={participants.id}>
            <img
              src={participant.profileImg || "/Main/profile-img.png"}
              alt="profile"
              className="w-[45px] h-[45px] relative rounded-[100px] object-cover"
            />
          </div>;
        })}
      </div>
    );
  }
};

export default ParticipationStatus;
