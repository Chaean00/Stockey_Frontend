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
    <div className="w-full max-w-lg">
      {/** Login box */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-2xl font-bold mb-10 text-center">로그인</h2>
        <form onSubmit={handleSubmit}>
          {/** 아이디 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              아이디
              <input
                type="text"
                placeholder="아이디를 입력해주세요"
                value={userInfo.account_id}
                onChange={(e) => {
                  setUserInfo({ ...userInfo, account_id: e.target.value });
                }}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </label>
            {errors.account_id && <p className="text-red-200 text-xs mt-2">{errors.account_id}</p>}
          </div>

          {/** 비밀번호 입력 */}
          <div className="mb-10">
            <label className="block text-sm font-bold mb-2">
              비밀번호
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={userInfo.password}
                onChange={(e) => {
                  setUserInfo({ ...userInfo, password: e.target.value });
                }}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </label>
            {errors.password && <p className="text-red-200 text-xs mt-2">{errors.password}</p>}
          </div>

          {/** 로그인 버튼 */}
          <button
            type="submit"
            className="w-full bg-blue-200 hover:bg-blue-100 text-white font-bold py-2 px-4 rounded-lg "
          >
            로그인하기
          </button>
        </form>
      </div>
    </div>
  );
}
