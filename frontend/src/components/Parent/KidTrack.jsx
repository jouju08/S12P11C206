import React, { useEffect, useRef } from "react";
import { useKidTrack } from "@/store/parentStore";

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleString("ko-KR", options);
};

export default function KidTrack() {
  const {
    loginSummary,
    loginEvents,
    fetchKidTrackAggregate,
    fetchKidTrackEvents,
    incrementKidTrackPage,
    hasMore,
  } = useKidTrack();

  const scrollRef = useRef(null);

  useEffect(() => {
    fetchKidTrackAggregate();
    fetchKidTrackEvents();
  }, []);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    if (
      container.scrollTop + container.clientHeight >= container.scrollHeight - 10 &&
      hasMore
    ) {
      incrementKidTrackPage();
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <div className="min-h-screen p-4">
      <div className="bg-white w-[635px] h-[568px] shadow-md p-6">
        <h2 className="service-regular3 text-2xl font-bold mb-6">
          내 아이 접속 기록
        </h2>
        {/* 집계 정보 카드 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-md shadow">
            <div className="service-regular3 font-bold text-lg">최근 로그인</div>
            <div className="service-regular3">
              {loginSummary
                ? formatDateTime(loginSummary.lastLogin)
                : "Loading..."}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-md shadow">
            <div className="service-regular3 font-bold text-lg">
              일일 접속 횟수
            </div>
            <div className="service-regular3">
              {loginSummary ? loginSummary.dailyCount : "Loading..."}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-md shadow">
            <div className="service-regular3 font-bold text-lg">
              주간 접속 횟수
            </div>
            <div className="service-regular3">
              {loginSummary ? loginSummary.weeklyCount : "Loading..."}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-md shadow">
            <div className="service-regular3 font-bold text-lg">
              월간 접속 횟수
            </div>
            <div className="service-regular3">
              {loginSummary ? loginSummary.monthlyCount : "Loading..."}
            </div>
          </div>
        </div>
        {/* 개별 로그인 기록 목록 */}
        <div
          id="need-scrool"
          ref={scrollRef}
          className="overflow-y-auto"
          style={{ height: "200px" }}
        >
          {loginEvents.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 service-regular3">로그인 시간</th>
                  <th className="py-2 service-regular3">IP 주소</th>
                </tr>
              </thead>
              <tbody>
                {loginEvents.map((event, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 service-regular3">
                      {event.loginTime ? formatDateTime(event.loginTime) : ""}
                    </td>
                    <td className="py-2 service-regular3">
                      {event.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src="/Common/nodata.png"
                alt="No Data"
                className="w-[80px] h-[80px]"
              />
              <p className="service-accent2 mt-2">
                접속 기록이 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
