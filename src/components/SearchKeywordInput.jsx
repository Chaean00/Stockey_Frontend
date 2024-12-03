import React, { useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function SearchKeywordInput({ setSearch, searchResult, setSearchResult, searchKeyword }) {
  const resultRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultRef.current && !resultRef.current.contains(event.target)) {
        setSearchResult([]); // searchResult 초기화
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative font-sans font-semibold">
      <div className="flex items-center justify-between w-full px-5 py-1 bg-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
        <input
          className="flex-grow bg-gray-100 border-none outline-none placeholder-gray-500 text-black_default"
          maxLength={16}
          placeholder="키워드를 검색하세요"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchKeyword();
            }
          }}
        />
        <FaSearch
          className="text-gray-500 ml-3"
          onClick={() => {
            searchKeyword();
          }}
        />
      </div>
      <ul
        ref={resultRef}
        className={`absolute z-10 left-0 w-full bg-white rounded-md shadow-md max-h-60 overflow-y-auto ${
          searchResult?.length > 0 ? 'border border-gray-200' : ''
        }`}
      >
        {searchResult?.length > 0
          ? searchResult.map((el, i) => (
              <li
                className="cursor-pointer px-4 py-2 hover:bg-blue-50 border-b last:border-none flex justify-between"
                key={i}
                onClick={() => {
                  navigate(`../keyword/${el.id}`);
                  setSearchResult([]); // searchResult 초기화
                }}
              >
                <div className="font-medium text-black_default">{el.keyword}</div>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
