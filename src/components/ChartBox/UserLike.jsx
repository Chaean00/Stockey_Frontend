import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserLike(props) {
  const navigate = useNavigate();
  const moveToStock = (stock_id) => {
    navigate(`/stock/${stock_id}`);
  };
  return (
    <div className="border w-full h-full border-gray-300 mb-3 pl-10 py-3 rounded-xl">
      <div className="mb-2">키워드 즐겨찾기</div>

      {props.stockLikeList.map((el, index) => {
        return (
          <p
            key={index}
            className="inline-block bg-gray-100 p-2 rounded-lg text-sm mr-2 hover:bg-blue-100"
            onClick={() => {
              moveToStock(el.stock_id);
            }}
          >
            {el.stock_name}
          </p>
        );
      })}
    </div>
  );
}
