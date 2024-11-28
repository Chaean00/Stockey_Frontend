import React from "react";

import ChattingMain from "./ChattingMain";

export default function Sidebar() {
  return (
    <div>
      {/** 즐겨찾기 */}
      <div>
        <div>
          <h2>즐겨찾기</h2>
          <button>+추가</button>
        </div>
        <div>{/** 즐겨찾기 list */}</div>
      </div>
      {/** 실시간 키워드 랭킹 */}
      <div>
        <div>
          <h2>실시간 키워드 랭킹</h2>
          <button>+더보기</button>
        </div>
        <div>{/** 키워드 랭킹 list */}</div>
      </div>
      {/** 실시간 채팅방 */}
      <div>
        <div>
          <h2>실시간 채팅방</h2>
          <ChattingMain />
          <button>+더보기</button>
        </div>
        <div>{/** 채티방 list */}</div>
      </div>
    </div>
  );
}
