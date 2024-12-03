import React, { useState, useEffect } from 'react';
import newsApi from '../../services/newsApi';
import { ScrollContainer } from 'react-indiana-drag-scroll';
import 'react-indiana-drag-scroll/dist/style.css';
import { useNavigate } from 'react-router-dom';

export default function NewsBox({ keywordData }) {
  const [newsList, setNewsList] = useState([]);
  const navigate = useNavigate();

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      const resp = await newsApi.getNews();
      setNewsList(resp.data);
      console.log(resp.data);
    };
    fetchNews();
  }, []);

  return (
    <div>
      {/* 제목 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div
            className="font-extrabold text-2xl cursor-pointer hover:text-gray-500"
            onClick={() => {
              navigate(`../keyword/${keywordData.keyword_id}`);
            }}
          >
            <span className="text-3xl font-bold text-blue-200">[ </span>
            {keywordData?.keyword || '로딩 중...'}
            <span className="text-3xl font-bold text-blue-200"> ]</span>
            <span className="text-gray-600 text-xl hidden lg:inline-block">에 대한 관련 뉴스</span>
          </div>
        </div>
      </div>

      {/* 뉴스 */}
      <ScrollContainer className="flex flex-row gap-4 overflow-x-scroll w-full">
        {newsList.map((elem, index) => (
          <a
            key={index}
            href={elem.newsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline group" // 그룹 클래스를 추가 (애니메이션 적용)
            draggable={false}
          >
            <div className="border-none w-72 h-64 flex-shrink-0 overflow-hidden">
              {/* 썸네일 이미지 */}
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={elem.newsThumbUrl}
                  alt="News Thumbnail"
                  className="h-36 w-full object-cover pointer-events-none rounded-lg transform transition-transform duration-300 ease-in-out group-hover:scale-110"
                  draggable={false} // Disable image dragging
                />
              </div>

              {/* 언론사 이름 및 내용 */}
              <div className="p-0">
                <div className="flex flex-row items-center mb-1 pt-2">
                  <img
                    src={elem.newsCompanyThumbUrl}
                    alt="Logo"
                    className="w-6 h-6 rounded-full mr-2"
                    draggable={false} // Disable logo dragging
                  />
                  <h5 className="text-sm text-gray-700 m-0 font-medium">{elem.newsCompany}</h5>
                </div>
                <p className="text-base font-bold text-gray-900">{elem.title}</p>
              </div>
            </div>
          </a>
        ))}
      </ScrollContainer>
    </div>
  );
}
