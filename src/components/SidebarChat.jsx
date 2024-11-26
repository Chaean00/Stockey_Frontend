import { useChatContext } from "../utils/chatContext";
import { useNavigate } from "react-router-dom";

export default function SidebarChat() {
    const { chatRoomList, setRoomId } = useChatContext();
    const navigate = useNavigate();

    // 사이드 바에 순위로 표시된 채팅방 클릭 시
    const roomListHandler = (roomId) => {
        setRoomId(roomId);
        navigate("/chat");
    };

    return (
        <div className="p-5">
            {/** 전체 커뮤니티 */}
            <div className="lg:text-2xl sm:text-lg mb-5 font-extrabold w-full border-b border-gray-300 pb-10">     
                <h3>전체 커뮤니티</h3>
            </div>

            {/** 지금 뜨는 키워드 커뮤니티 */}
            <div className="lg:text-2xl sm:text-lg mb-5 font-extrabold w-full border-b border-gray-300 pb-10">     
                <h3>지금 뜨는 키워드 커뮤니티</h3>
            </div>

            {/** 국밥 키워드 커뮤니티 */}
            <div className="lg:text-2xl sm:text-lg mb-5 font-extrabold w-full py-3">     
                <h3>국밥 키워드 커뮤니티</h3>
                {/** list */}
                <ul className="flex flex-col gap-1 py-3">
                    {chatRoomList?.map((el, i) => {
                    return (
                        <li key={i} className="text-xl font-extrabold flex items-center hover:bg-gray-200 p-2 px-3 rounded-2xl" onClick={() => {
                            roomListHandler(el.id);
                        }}>
                        <div className="text-2xl text-blue-200 mr-16">{i + 1}</div>
                        <div>{el.name}</div>
                        </li>
                    );
                    })}
                </ul>
            </div>
        </div>
    );
}