import React, { useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function SearchInput({ setSearch, searchResult, setSearchResult, searchStock }) {
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
    <div className="relative">
      <div className="flex items-center justify-between w-full px-5 py-1 bg-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-200 shadow-sm">
        <input
          className="flex-grow bg-gray-100 border-none outline-none placeholder-gray-700 text-black_default"
          maxLength={16}
          placeholder="원하는 종목을 검색하세요"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchStock();
            }
          }}
        />
        <FaSearch
          className="text-gray-500 ml-3"
          onClick={() => {
            searchStock();
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
                  navigate(`../stock/${el.id}`);
                  setSearchResult([]); // searchResult 초기화
                }}
              >
                <div className="font-medium text-black_default">{el.stock_name}</div>
                <div className="text-sm text-blue-100">{el.code}</div>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
