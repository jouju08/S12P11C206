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

export default function Exhibition() {
  const { fetchMyTale, myTales } = useMyTales();
  const [sortOrder, setSortOrder] = useState("날짜순");
  const [filterOption, setFilterOption] = useState("동화 전체보기");
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
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };
  const handleFilterChange = (option) => {
    setFilterOption(option);
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
        <div className="flex overflow-y-auto justify-center">
          <div className="grid grid-cols-4 gap-4">
            {sortedTales.map((story) => (
              <div key={story.taleId} className="flex items-center">
                <img
                  src={story.img}
                  alt={story.title}
                  className="w-[120px] h-[120px] object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
