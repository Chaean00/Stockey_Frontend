import React, { useRef, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function SearchInput({ setSearch, searchResult, setSearchResult, searchStock, setShow }) {
  const resultRef = useRef(null);
  const navigate = useNavigate();
  const [tmpSearch, setTmpSearch] = useState('');

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

  // setShow가 없으면 기본값 false로 설정
  const handleCloseModal = () => {
    if (setShow) {
      setShow(false); // setShow가 있을 때만 호출
    }
  };

  const handleSearchClick = () => {
    console.log("^^^^^")
    searchStock();
    setTmpSearch(''); // 검색 후, tmpSearch를 비워줍니다.
    setSearch(''); // setSearch를 통해 외부 상태도 초기화
  };

  return (
    <div className="relative font-sans font-semibold">
      <div className="flex items-center justify-between w-full px-5 py-1 bg-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-200 shadow-sm">
        <input
          className="flex-grow bg-gray-100 border-none outline-none placeholder-gray-400 text-black_default"
          maxLength={16}
          placeholder="원하는 종목을 검색하세요"
          onChange={(e) => {
            setTmpSearch(e.target.value);
            setSearch(e.target.value);
          }}
          value={tmpSearch} // input의 value는 tmpSearch로 설정
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSearchClick();
            }
          }}
        />
        <FaSearch className="text-gray-500 ml-3" onClick={handleSearchClick} />
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
                  handleCloseModal();
                  setTmpSearch(''); // 검색어 클릭 시, tmpSearch 초기화
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
