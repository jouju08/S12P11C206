import React, { useEffect, useState, useMemo, useRef } from "react";
import { useMyTales } from "@/store/parentStore";
import { useCollection } from "@/store/collectionStore";
import CollectionModal from "@/components/modal/CollectionModal";

function CustomSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block w-[180px]">
      <div
        onClick={() => setOpen(!open)}
        className="service-regular3 border border-gray-300 rounded-md px-4 py-2 text-gray-700 cursor-pointer select-none"
      >
        {value || placeholder}
      </div>
      {open && (
        <div
          className="absolute top-full left-0 w-full mt-1 border border-gray-300 bg-white rounded-md shadow-lg z-10"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          <div
            onClick={() => handleOptionClick("전체보기")}
            className="service-regular3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            전체 보기
          </div>
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleOptionClick(option)}
              className="service-regular3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfileEdit() {
  const { fetchMyTale, myTales } = useMyTales();
  const { setTaleStart, setSeeTaleId } = useCollection();

  const [sortBy, setSortBy] = useState("최신순");
  const [filterBy, setFilterBy] = useState("전체보기");

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchMyTale(0, 4, sortBy, filterBy);
  }, [sortBy, filterBy, fetchMyTale]);

  const filteredTales = useMemo(() => {
    return filterBy === "전체보기"
      ? myTales
      : myTales.filter((story) => story.title === filterBy);
  }, [myTales, filterBy]);

  const sortedTales = useMemo(() => {
    let sorted = [...filteredTales];
    if (sortBy === "최신순") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "과거순") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return sorted;
  }, [filteredTales, sortBy]);

  const uniqueTitles = useMemo(() => {
    const titles = myTales.map((story) => story.title);
    return [...new Set(titles)].sort((a, b) => a.localeCompare(b));
  }, [myTales]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      const nextPage = page + 1;
      fetchMyTale(nextPage, 4, sortBy, filterBy).then((newData) => {
        if (!newData || newData.length < 4) {
          setHasMore(false);
        }
      });
      setPage(nextPage);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, sortBy, filterBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (option) => {
    setFilterBy(option);
  };

  const handleOpenModal = (story) => {
    setTaleStart(story.baseTaleId);
    setSeeTaleId(story.taleId);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="bg-white p-6 shadow-md w-[635px] h-[568px] flex flex-col relative">
        <div className="flex justify-end items-center space-x-[8px] mb-4">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="service-regular3 border border-gray-300 rounded-md px-4 py-2 text-gray-700 w-[180px] h-[40px]"
          >
            <option value="전체보기">전체 보기</option>
            <option value="최신순">최신순</option>
            <option value="과거순">과거순</option>
          </select>
          <CustomSelect
            options={uniqueTitles}
            value={filterBy === "전체보기" ? "" : filterBy}
            onChange={handleFilterChange}
            placeholder="전체 보기"
          />
        </div>
        
        <section
          id="need-scrool"
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
        >
          {sortedTales.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {sortedTales.map((story) => (
                <div
                  key={story.taleId}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-4"
                >
                  <div className="flex-1">
                    <h3 className="text-text-first service-regular3 mb-2">
                      {story.title}
                    </h3>
                    <p className="text-sm text-text-third mb-4">
                      {story.createdAt.substring(0, 10)}
                    </p>
                    <button
                      onClick={() => handleOpenModal(story)}
                      className="bg-main-point text-text-first service-regular3 w-[85px] h-[27px] rounded-[16px] hover:bg-main-point2"
                    >
                      보러가기
                    </button>
                  </div>
                  <img
                    src={story.img}
                    alt={story.title}
                    className="w-[100px] h-[100px] object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <img
                src="/Common/nodata.png"
                alt="No Data"
                className="w-[80px] h-[80px]"
              />
              <p className="service-accent2 mt-2">아직 만들어진 동화가 없어요</p>
            </div>
          )}
        </section>
        {showModal && (
          <div className="absolute top-[-100px] left-0 z-50 w-full h-dvh bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
            <CollectionModal handleExit={() => setShowModal(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
