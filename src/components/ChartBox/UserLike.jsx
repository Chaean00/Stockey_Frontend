import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserLike(props) {
  const navigate = useNavigate();
  const moveToStock = (stock_id) => {
    navigate(`/stock/${stock_id}`);
  };

  return (
    <div className="border-2 w-full h-full mb-3 pl-10 py-3 rounded-xl">
      <div className="mb-2 font-semibold">종목 즐겨찾기</div>

      {props?.stockLikeList?.map((el, index) => {
        return (
          <p
            key={index}
            className="font-medium inline-block bg-gray-100 p-2 rounded-lg text-sm mr-2 hover:bg-blue-100 mb-2"
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
