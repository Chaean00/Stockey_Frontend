import { useChatContext } from "../utils/chatContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import chatApi from "../services/chatApi";

// Trending keywords data
const trendingKeywords = [
    { id: 1, title: "반도체" },
    { id: 2, title: "이차전지" },
    { id: 3, title: "트럼프" },
  ]

  // National keywords data with counts
  const nationalKeywords = [
    { id: 1, title: "금리", count: 356 },
    { id: 2, title: "실적", count: 312 },
    { id: 3, title: "배당", count: 216 },
    { id: 4, title: "상승장", count: 195 },
    { id: 5, title: "매출", count: 184 },
    { id: 6, title: "인수합병", count: 120 },
    { id: 7, title: "주식분할", count: 130 },
    { id: 8, title: "경기침체", count: 65 },
    { id: 9, title: "반도체", count: 65 },
    { id: 10, title: "전기차", count: 65 },
  ]

export default function SidebarChat() {
    const { chatRoomList, setRoomId } = useChatContext();
    const [ weightRoomList, setWeightRoomList ] = useState([]);
    const [ bookmarkRoomList, setbookmarkRoomList ] = useState([]);
    const navigate = useNavigate();

    // 사이드 바에 순위로 표시된 채팅방 클릭 시
    const roomListHandler = (roomId) => {
        setRoomId(roomId);
        navigate("/chat");
    };

    // 채팅방 룸 리스트 가져오기
    useEffect(() => {
        const fetchRoomList = async () => {
            try {
                // 가중치 랭킹
                const weightResp = await chatApi.getWeightRankings();
                setWeightRoomList(weightResp.data.results);
                console.log(weightResp.data.results);
    
                // 즐겨찾기 랭킹
                const bookmarkResp = await chatApi.getBookmarkRankings();
                setbookmarkRoomList(bookmarkResp.data.results);
                console.log(bookmarkResp.data);
    
            } catch (error) {
                console.error('룸 리스트 로드 실패:', error);
            }
        }
        fetchRoomList();
    }, []);

    return (
        // <div className="p-4 text-defaultText">
        //     {/** 전체 커뮤니티 */}
        //     <div className="lg:text-2xl sm:text-lg mb-5 font-extrabold w-full border-b border-gray-300 pb-10">     
        //         <h3>전체 커뮤니티</h3>
        //     </div>

        //     {/** 지금 뜨는 키워드 커뮤니티 */}
        //     <div className="lg:text-2xl sm:text-lg mb-5 font-extrabold w-full border-b border-gray-300 pb-10">     
        //         <h3>지금 뜨는 키워드 커뮤니티</h3>
        //     </div>

        //     {/** 국밥 키워드 커뮤니티 */}
        //     <div className="lg:text-2xl sm:text-lg mb-5 font-extrabold w-full py-3">     
        //         <h3>국밥 키워드 커뮤니티</h3>
        //         {/** list */}
                // <ul className="flex flex-col gap-1 py-3">
                //     {chatRoomList?.map((el, i) => {
                //     return (
                //         <li key={i} className="text-xl font-medium flex items-center hover:bg-gray-200 p-2 px-3 rounded-2xl" onClick={() => {
                //             roomListHandler(el.id);
                //         }}>
                //         <div className="text-2xl text-blue-200 mr-16">{i + 1}</div>
                //         <div>{el.name}</div>
                //         </li>
                //     );
                //     })}
                // </ul>
        //     </div>
        // </div>
        <div className="w-full p-6">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-900 mb-8" onClick={() => {
                roomListHandler(1);
            }}>
                전체 커뮤니티
            </h2>

            {/* Divider */}
            <div className="border-t border-gray-300 my-8" />

            {/* Trending Keywords Section */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    지금 뜨는 키워드 커뮤니티
                </h2>
                <ul>
                    {weightRoomList?.map((el, i) => {
                    return (
                        <li key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-200" onClick={() => {
                            roomListHandler(el.room_id);
                        }}>
                        <div className="flex items-center font-medium">
                            <div className="text-blue-200 w-12">{i + 1}</div>
                            <div>{el.keyword}</div>
                        </div>
                        <span className="text-gray-400 font-medium">???</span>
                        </li>
                    );
                    })}
                </ul>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-8" />

            {/* National Keywords Section */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                국밥 키워드 커뮤니티
                </h2>
                <ul>
                    {bookmarkRoomList?.map((el, i) => {
                    return (
                        <li key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-200" onClick={() => {
                            roomListHandler(el.room_id);
                        }}>
                        <div className="flex items-center font-medium">
                            <div className="text-blue-200 w-12">{i + 1}</div>
                            <div>{el.keyword}</div>
                        </div>
                        <span className="text-gray-400 font-medium">{el.count}</span>
                        </li>
                    );
                    })}
                </ul>
            </div>
        </div>
    );
}