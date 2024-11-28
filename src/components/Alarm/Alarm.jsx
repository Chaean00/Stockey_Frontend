import { useState, useEffect } from 'react';
import userApi from '../../services/userApi';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import CloseButton from 'react-bootstrap/CloseButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Alarm.css"
import { User } from 'lucide-react';

function Alarm({ show, handleClose }) {
  const [isSwitchOn, setIsSwitchOn] = useState(false); // 스위치 상태를 관리하는 state
  const [slackId, setSlackId] = useState('');
  const [keywordList, setKeywordList] = useState([]);
  const [stockList, setStockList] = useState([]);

  useEffect (() => {
    if (show) {
      bringSlackId();
      bringKeywordList();
      bringStockList();
    }
  }, [show])

  const handleSwitchChange = () => {
    setIsSwitchOn(prevState => !prevState); // 스위치 상태를 토글
  };

  const bringSlackId = async() => {
    try {
      const response = await userApi.getCurrentUser();
      setSlackId(response.data.slack_id);
      response.data.slack_id==''? setIsSwitchOn(false): setIsSwitchOn(true)
    } catch (error) {
      console.error('사용자 정보 조회 실패:',  error.response?.data?.message || error.message);
      alert('사용자 정보 조회에 실패했습니다.');
    }
  };

  const bringKeywordList = async() => {
    try {
      const response = await userApi.getKeywordLike();
      setKeywordList(response.data.userKeywords);
    } catch (error) {
      console.error('즐겨찾기한 키워드 조회 실패:',  error.response?.data?.message || error.message);
      alert('즐겨찾기한 키워드 조회에 실패했습니다.');
    }
  }

  const bringStockList = async() => {
    try {
      const response = await userApi.getStockLike();
      setStockList(response.data.userStocks);
    } catch (error) {
      console.error('즐겨찾기한 종목 조회 실패:',  error.response?.data?.message || error.message);
      alert('즐겨찾기한 종목 조회에 실패했습니다.');
    }
  }

  const saveAlarm = () => {
    if (isSwitchOn) {
      try {
        userApi.updateSlackId({ slack_id: slackId });
        keywordList.map((el, i)=>{
          userApi.updateKeywordLike({id: el.id, alarm_status: el.alarm_status})
        })
        stockList.map((el, i)=>{
          userApi.updateStockLike({id: el.id, alarm_status: el.alarm_status})
        })
      }
      catch (error) {
        console.error('사용자 정보 수정 실패:',  error.response?.data?.message || error.message);
        alert('사용자 정보 수정에 실패했습니다.');
      }
    } else {
      try {
        userApi.updateSlackId({ slack_id: '' });
      }
      catch (error) {
        console.error('사용자 정보 수정 실패:',  error.response?.data?.message || error.message);
        alert('사용자 정보 수정에 실패했습니다.');
      }
    }
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CloseButton onClick={handleClose} />
          </div>
          <div style={{ display: 'inline-block' }}>
            <h3><b>나만의 키워드/종목 알림 받기</b></h3>
          </div>
          <div style={{ display: 'inline-block' }}>
            <Form>
              <Form.Check
                type="switch"
                id="custom-switch"
                checked={isSwitchOn} // 스위치 상태에 따라 checked 상태 변경
                onChange={handleSwitchChange} // 스위치 토글시 상태 변경
              >
              </Form.Check>
            </Form>
          </div>
          <div>
            이 설정을 켜면 <b>즐겨찾기한 키워드</b>와 <b>종목</b>에 대한 <b>순위 알림</b>을 받을 수 있어요.
          </div>

          {/* isSwitchOn이 true일 때만 아래 내용 표시 */}
          {isSwitchOn && (
            <>
              <div style={{ marginTop: '15px' }}>
                <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Control
                      type="text"
                      placeholder="슬랙 계정(또는 디스코드 계정, 카톡 아이디)을 입력해주세요."
                      value = {slackId}
                      onChange={(e) => setSlackId(e.target.value)}
                      autoFocus
                      className='bg-blue-100'
                      style={{ backgroundColor: '#F2F4F6', border: 'none', borderRadius: '8px' }}
                    />
                  </Form.Group>
                </Form>
              </div>
              <div>
                <b>알림을 받을 키워드를 선택해주세요.</b>
              </div>
              <div>
                {keywordList.map((item, index) => (
                  <div
                    key={index}
                    className="keywords"
                    style={{
                      backgroundColor: item.alarm_status==1 ? '#E0E8F0' : '#F2F4F6',
                    }}
                    onClick={() => {
                      keywordList[index].alarm_status = keywordList[index].alarm_status==1 ? 0 :1
                      setKeywordList([...keywordList])
                    }}
                  >
                    {item.keyword}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '15px' }}>
                <b>알림을 받을 종목을 선택해주세요.</b>
              </div>
              <div>
                {stockList.map((item, index) => (
                  <div
                    key={index}
                    className="stocks"
                    style={{
                      backgroundColor: item.alarm_status==1 ? '#E0E8F0' : '#F2F4F6',
                    }}
                    onClick={() => {
                      stockList[index].alarm_status = stockList[index].alarm_status==1 ? 0 :1
                      setStockList([...stockList])
                      console.log(stockList)
                    }}
                  >
                    {item.stock_name}
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" 
              onClick={()=>{
                handleClose()
                saveAlarm()
              }}>
              저장
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Alarm;
