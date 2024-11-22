  import React, { useEffect, useState } from 'react';
  import { useParams } from 'react-router-dom';
  import stockApi from '../../services/stockApi';
  import ChartBox from '../../components/ChartBox/ChartBox';
  import keywordApi from '../../services/keywordApi';
  import { FaSearch } from 'react-icons/fa';
  import { AiFillHeart } from 'react-icons/ai';
import userApi from '../../services/userApi';

  export default function KeywordChartPage() {
    const { keyword_id } = useParams();
    const [chartData, setChartData] = useState([]);
    const [isLiked, setIsLiked] = useState(false); // 초기 좋아요 상태
    const [currentKeyword, setCurrentKeyword] = useState('')
    const [keywordData, setKeywordData] = useState('');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState()

    // 키워드 데이터 가져오기
    useEffect(() => {
      const getKeywordData = async () => {
        try {
          const response = await keywordApi.getStockRankAboutKeyword(keyword_id);
          setKeywordData(response.data);
        } catch (error) {
          console.error('키워드 데이터를 가져오는 중 오류 발생:', error);
        }
      };
      
      getKeywordData();
    }, [keyword_id]);

    // 차트 데이터 가져오기
    useEffect(() => {
      const getChartData = async () => {
        if (keywordData && keywordData.stock_rankings && keywordData.stock_rankings.length > 0) {
          try {
            const response = await stockApi.getStockChart(keywordData.stock_rankings[0].code);
            setChartData(response.data);
          } catch (error) {
            console.error('차트 데이터를 가져오는 중 오류 발생:', error);
          }
        }
      };
      
      getChartData();
      findInitialLikeStock();
    }, [keywordData, currentKeyword]);

    const findInitialLikeStock = async () => {
      try {
        const response = await userApi.getKeywordLike();
        response.data.userKeywords.map((like) => {
          if (like.keyword == keywordData.keyword) {
            console.log(like.keyword)
            setCurrentKeyword(like.keyword)
            setIsLiked(true);
          }
        });
      } catch (error) {
        console.error('즐겨찾기 불러오기 실패:', error.response?.data?.message || error.message);
      }
    };

    const removeLike = async (keyword) => {
      try {
        await userApi.removeKeywordLike({ keyword: keyword });
      } catch (error) {
        console.error('즐겨찾기 삭제 실패:', error.response?.data?.message || error.message);
        alert("즐겨찾기 삭제 실패")
      }
    }

    const addLike = async (keyword) => {
      //즐겨찾기에 추가
      try {
        await userApi.addKeywordLike({ keyword: keyword, alarm_status: false });
      } catch (error) {
        console.error('즐겨찾기 추가 실패:', error.response?.data?.message || error.message);
        alert("즐겨찾기 추가 실패")
      }
    };

    const searchKeyword = async () => {
      try {
        const response = await keywordApi.searchKeywordByWord(search);
        setSearchResult(response.data)
      } catch (error) {
        console.error('종목 검색 실패:', error.response?.data?.message || error.message);
      }
    }

    return (
      <div>
        {/* header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
          <h1 className="font-extrabold text-4xl">
            {keywordData?.keyword|| '로딩 중...'}
          </h1>
            <AiFillHeart
              className={`text-3xl cursor-pointer ${isLiked ? 'text-red-100' : 'text-gray-200'} `}
              onClick={() => {
                setIsLiked(!isLiked);
                if (isLiked) {
                  removeLike(keywordData?.keyword);
                } else {
                  addLike(keywordData?.keyword);
                }
              }}
            />
          </div>
          <div>
            <div className="flex items-center justify-between w-full px-5 py-1 bg-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
              <input
                className="flex-grow bg-gray-100 border-none outline-none placeholder-gray-500 text-gray-700"
                maxLength={16}
                placeholder="원하는 키워드를 검색하세요"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    searchKeyword();
                  }
                }}
              />
              <FaSearch className="text-gray-500 ml-3" />
            </div>

            <ul>
              {searchResult?.map((el, i) => {
                return (
                  <li
                    key={i}
                  >
                    <div>{el.keyword}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* main */}
        <div>
          {chartData.length > 0 && <ChartBox chartData={chartData} />}
        </div>
      </div>
    );
  }

