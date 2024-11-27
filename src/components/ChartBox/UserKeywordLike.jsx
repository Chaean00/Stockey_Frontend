import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserKeywordLike({keywordLikeList}) {
  const navigate = useNavigate();
  const moveToStock = (keyword_id) => {
    navigate(`/keyword/${keyword_id}`);
  };

  return (
    <div className="border w-full h-full border-gray-300 mb-3 pl-10 py-3 rounded-xl">
      <div className="mb-2">키워드 즐겨찾기</div>

      {keywordLikeList?.userKeywords?.map((el, index) => {
        return (
          <p
            key={index}
            className="inline-block bg-gray-100 p-2 rounded-lg text-sm mr-2 hover:bg-blue-100 mb-2"
            // onClick={() => {
            //   moveToStock(el.id);
            // }}
          >
            {el.keyword}
          </p>
        );
      })}
    </div>
  );
}
