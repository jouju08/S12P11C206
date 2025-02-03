import React from "react";

export default function Exhibition () {
    const stories = [
        { id: 1, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 2, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 3, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 4, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 5, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 6, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 1, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 2, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 3, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 4, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 5, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 6, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 1, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 2, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 3, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 4, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 5, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
        { id: 6, title: "아기 돼지 삼형제", date: "2025. 01. 20", image: "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png" },
    ];

    return (
        <div className="min-h-screen p-4">
            <div className="bg-white p-6 shadow-md w-[635px] h-[568px] flex flex-col">
                <div className="flex justify-end items-center space-x-[8px] mb-4">
                    <select className="service-regular3 border border-gray-300 rounded-md px-4 py-2 text-gray-700 w-[180px] h-[40px]">
                        <option>날짜순</option>
                        <option>이름순</option>
                    </select>
                    <select className="service-regular3 border border-gray-300 rounded-md px-4 py-2 text-gray-700 w-[180px] h-[40px]">
                        <option>동화 전체보기</option>
                        <option>아돼삼</option>
                    </select>
                </div>

                <div className="flex overflow-y-auto justify-center">
                    <div className="grid grid-cols-4 gap-4">
                        {stories.map((story) => (
                            <div
                                key={story.id}
                                className="flex items-center"
                            >
                                <img
                                    src={story.image}
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

