import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../services/userApi';
import { useAuth } from '../../utils/authContext';

export default function LoginPage() {
  const [userInfo, setUserInfo] = useState({
    account_id: '',
    password: '',
  });
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!userInfo.account_id) newErrors.account_id = '아이디를 입력해주세요.';
    if (!userInfo.password) newErrors.password = '비밀번호를 입력해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await userApi.login(userInfo);
        login(response.data.nickname);
        console.log('로그인 성공:', response.data);
        alert('로그인에 성공했습니다!');
        navigate('/');
      } catch (error) {
        console.error('로그인 실패:', error.response?.data?.message || error.message);
        alert('로그인에 실패했습니다...');
      }
    }
  };

  return (
    <div>
      {/** Login box */}
      <div>
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <div>
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
          </div>

          <button type="submit">로그인하기</button>
        </form>
      </div>
    </div>
  );
}
