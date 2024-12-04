import React, { useRef, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function SearchKeywordInput({ setSearch, searchResult, setSearchResult, searchKeyword, setShow }) {
  const resultRef = useRef(null);
  const navigate = useNavigate();
  const [tmpSearch, setTmpSearch] = useState(''); // tmpSearch는 input의 value로 사용됩니다

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
    searchKeyword();
    setTmpSearch(''); // 검색 후, tmpSearch를 비워줍니다.
    setSearch(''); // setSearch를 통해 외부 상태도 초기화
  };

  return (
    <div className="relative font-sans font-semibold">
      <div className="flex items-center justify-between w-full px-5 py-1 bg-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
        <input
          className="flex-grow bg-gray-100 border-none outline-none placeholder-gray-400 text-black_default"
          maxLength={16}
          placeholder="키워드를 검색하세요"
          onChange={(e) => {
            setTmpSearch(e.target.value); // tmpSearch 상태 업데이트
            setSearch(e.target.value); // 외부 상태에도 반영
          }}
          value={tmpSearch} // input의 value는 tmpSearch로 설정
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              searchKeyword();
              setTmpSearch('');
            }
          }}
        />
        <FaSearch
          className="text-gray-500 ml-3"
          onClick={handleSearchClick} // 검색 버튼 클릭 시 동작
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
                  handleCloseModal();
                  setTmpSearch(''); // 검색어 클릭 시, tmpSearch 초기화
                  setSearchResult([]); // searchResult 초기화
                  navigate(`../keyword/${el.id}`); // 검색된 결과 페이지로 이동
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
