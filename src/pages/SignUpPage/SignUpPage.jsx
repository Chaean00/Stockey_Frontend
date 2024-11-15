import React, { useState } from 'react';

export default function SignUpPage() {
  const [isAlarmOn, setIsAlarmOn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    account_id: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    slack_id: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!userInfo.nickname) newErrors.nickname = '닉네임을 입력해주세요.';
    if (!userInfo.account_id) newErrors.account_id = '아이디를 입력해주세요.';
    if (!userInfo.password) newErrors.password = '비밀번호를 입력해주세요.';
    if (userInfo.password !== userInfo.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('회원가입 정보:', userInfo);
      // 추가적인 회원가입 로직 수행
    }
  };

  return (
    <div>
      {/** Sign up box */}
      <div>
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label>
                닉네임
                <input
                  type="text"
                  placeholder="닉네임을 입력해주세요"
                  value={userInfo.nickname}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, nickname: e.target.value });
                  }}
                />
              </label>
              {errors.nickname && <p style={{ color: 'red' }}>{errors.nickname}</p>}
            </div>
            <div>
              <label>
                아이디
                <input
                  type="text"
                  placeholder="아이디를 입력해주세요"
                  value={userInfo.account_id}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, account_id: e.target.value });
                  }}
                />
              </label>
              {errors.account_id && <p style={{ color: 'red' }}>{errors.account_id}</p>}
            </div>
          </div>
          <div>
            <div>
              <label>
                비밀번호
                <input
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  value={userInfo.password}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, password: e.target.value });
                  }}
                />
              </label>
              {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
            </div>
            <div>
              <label>
                비밀번호 확인
                <input
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={userInfo.confirmPassword}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, confirmPassword: e.target.value });
                  }}
                />
              </label>
              {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
            </div>
          </div>

          <div>
            <label>
              알림 설정
              <p>알림 설정 시, Slack으로 즐겨찾기한 키워드의 정보를 받으실 수 있습니다.</p>
              <button
                type="button"
                onClick={() => {
                  setIsAlarmOn((prev) => !prev);
                }}
              >
                {isAlarmOn ? 'ON' : 'OFF'}
              </button>
              <span>ON/OFF</span>
              <input
                type="text"
                placeholder="슬랙 아이디를 입력해주세요"
                value={userInfo.slack_id}
                onChange={(e) => {
                  setUserInfo({ ...userInfo, slack_id: e.target.value });
                }}
                disabled={!isAlarmOn}
              />
            </label>
          </div>
          <button type="submit">회원가입하기</button>
        </form>
      </div>
    </div>
  );
}
