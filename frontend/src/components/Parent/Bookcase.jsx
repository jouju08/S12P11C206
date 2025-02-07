import React, { useEffect, useState, useMemo, useRef } from "react";
import { useMyTales } from "@/store/parentStore";

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
            onClick={() => handleOptionClick("동화 전체보기")}
            className="service-regular3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            동화 전체보기
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
  const [sortOrder, setSortOrder] = useState("날짜순");
  const [filterOption, setFilterOption] = useState("동화 전체보기");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  useEffect(() => {
    fetchMyTale();
  }, [fetchMyTale]);
  const uniqueTitles = useMemo(() => {
    const titles = myTales.map((story) => story.title);
    return Array.from(new Set(titles));
  }, [myTales]);
  const filteredTales = useMemo(() => {
    return filterOption === "동화 전체보기"
      ? myTales
      : myTales.filter((story) => story.title === filterOption);
  }, [myTales, filterOption]);
  const sortedTales = useMemo(() => {
    let sorted = [...filteredTales];
    if (sortOrder === "날짜순") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "이름순") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [filteredTales, sortOrder]);
  const totalPages = Math.ceil(sortedTales.length / itemsPerPage);
  const paginatedTales = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTales.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTales, currentPage]);
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };
  const handleFilterChange = (option) => {
    setFilterOption(option);
    setCurrentPage(1);
  };
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  return (
    <div className="min-h-screen p-4">
      <div className="bg-white p-6 shadow-md w-[635px] h-[568px] flex flex-col">
        <div className="flex justify-end items-center space-x-[8px] mb-4">
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="service-regular3 border border-gray-300 rounded-md px-4 py-2 text-gray-700 w-[180px] h-[40px]"
          >
            <option value="날짜순">날짜순</option>
            <option value="이름순">이름순</option>
          </select>
          <CustomSelect
            options={uniqueTitles}
            value={filterOption === "동화 전체보기" ? "" : filterOption}
            onChange={handleFilterChange}
            placeholder="동화 전체보기"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {paginatedTales.length > 0 ? (
              paginatedTales.map((story) => (
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
                    <button className="bg-main-point text-text-first service-regular3 w-[85px] h-[27px] rounded-[16px] hover:bg-main-point2">
                      보러가기
                    </button>
                  </div>
                  <img
                    src={story.img}
                    alt={story.title}
                    className="w-[100px] h-[100px] object-cover rounded-md"
                  />
                </div>
              ))
            ) : (
              <p className="text-center w-full text-gray-500">
                동화 목록이 없습니다.
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
