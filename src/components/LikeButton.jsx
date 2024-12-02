import React from 'react';
import { AiFillHeart } from 'react-icons/ai';

export default function LikeButton({ isLiked, addLike, removeLike }) {
  return (
    <AiFillHeart
      className={`text-3xl cursor-pointer transition-all duration-300 ${
        isLiked ? 'text-red-100 scale-110' : 'text-gray-200'
      }`}
      onClick={() => {
        if (isLiked) {
          removeLike();
        } else {
          addLike();
        }
      }}
    />
  );
}
