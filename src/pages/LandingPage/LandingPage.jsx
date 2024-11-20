import React from 'react';

export default function LandingPage() {
  return (
    <div>
      {/**키워드에 대한 랭킹 및 차트 */}
      <div>
        {/** header */}
        <div>
          <div>&quot;키워드&quot;에 대한 종목 랭킹</div>
          <input placeholder="원하는 키워드를 검색해보세요" />
        </div>
        {/** ranking box */}
        <div>
          {/** stock rank */}
          <div>여기에 키워드 별 종목 랭킹을 넣어주세요</div>
          {/**  stock chart*/}
          <div>
            <div>
              <div>주식 차트 1</div>
              <div>주식 차트 1의 info</div>
            </div>
            <div>
              <div>
                <div>주식 차트 2</div>
                <div>주식 차트 2의 info</div>
              </div>
              <div>
                <div>주식 차트 3</div>
                <div>주식 차트 3의 info</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/**종목에 대한 랭킹 및 차트 */}
      <div>
        {/** header */}
        <div>
          <div>&quot;종목&quot;에 대한 키워드 랭킹</div>
          <input placeholder="원하는 종목을 검색해보세요" />
        </div>
        {/** ranking box */}
        <div>
          {/** keyword rank */}
          <div>여기에 종목 별 키워드 랭킹을 넣어주세요</div>
          {/**  keyword chart*/}
          <div>
            <div>
              <div>주식 차트 1</div>
              <div>주식 차트 1의 info</div>
            </div>
            <div>
              <div>
                <div>주식 차트 2</div>
                <div>주식 차트 2의 info</div>
              </div>
              <div>
                <div>주식 차트 3</div>
                <div>주식 차트 3의 info</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
