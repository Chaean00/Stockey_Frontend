import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../services/userApi';

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
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!userInfo.nickname) newErrors.nickname = '닉네임을 입력해주세요.';
    if (!userInfo.account_id) newErrors.account_id = '아이디를 입력해주세요.';
    if (!userInfo.password) newErrors.password = '비밀번호를 입력해주세요.';
    if (userInfo.password !== userInfo.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await userApi.register(userInfo);
        console.log('회원가입 성공:', response.data);
        alert('회원가입에 성공했습니다!');
        navigate('/login');
      } catch (error) {
        console.error('회원가입 실패:', error.response?.data?.message || error.message);
        alert('회원가입에 실패했습니다...');
      }
    }
  };

  return (
    <div className="relative">
      <h2 className="text-3xl font-semibold mb-10 text-center animate-fadeIn">회원가입</h2>
      {/** Sign up box */}
      <div className="bg-white p-6 rounded-lg w-full animate-fadeIn">
        <form onSubmit={handleSubmit}>
          {/** 닉네임 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              닉네임
              <input
                type="text"
                placeholder="닉네임을 입력해주세요"
                value={userInfo.nickname}
                onChange={(e) => {
                  setUserInfo({ ...userInfo, nickname: e.target.value });
                }}
                className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 hover:ring-2 hover:ring-blue-100 focus:outline-none"
              />
            </label>
            {errors.nickname && <p className="text-red-100 text-xs mt-2">{errors.nickname}</p>}
          </div>

          {/** 아이디 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              아이디
              <input
                type="text"
                placeholder="아이디를 입력해주세요"
                value={userInfo.account_id}
                onChange={(e) => {
                  setUserInfo({ ...userInfo, account_id: e.target.value });
                }}
                className="w-full mt-2 px-4 py-2 border hover:ring-2 hover:ring-blue-100  rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </label>
            {errors.account_id && <p className="text-red-100 text-xs mt-2">{errors.account_id}</p>}
          </div>

          {/** 비밀번호 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              비밀번호
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={userInfo.password}
                onChange={(e) => {
                  setUserInfo({ ...userInfo, password: e.target.value });
                }}
                className="w-full mt-2 px-4 py-2 border hover:ring-2 hover:ring-blue-100  rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </label>
            {errors.password && <p className="text-red-100 text-xs mt-2">{errors.password}</p>}
          </div>

          {/** 비밀번호 확인 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              비밀번호 확인
              <input
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={userInfo.confirmPassword}
                onChange={(e) => {
                  setUserInfo({ ...userInfo, confirmPassword: e.target.value });
                }}
                className="w-full mt-2 px-4 py-2 border hover:ring-2 hover:ring-blue-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </label>
            {errors.confirmPassword && <p className="text-red-100 text-xs mt-2">{errors.confirmPassword}</p>}
          </div>

          {/** 알림 설정 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              알림 설정
              <p className="text-gray-500 text-xs mb-2">
                알림 설정 시, Slack으로 즐겨찾기한 키워드의 정보를 받으실 수 있습니다.
              </p>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAlarmOn((prev) => !prev);
                  }}
                  className={`px-4 py-2 rounded-lg text-white font-semibold ${isAlarmOn ? 'bg-blue-200' : 'bg-gray-300'}`}
                >
                  {isAlarmOn ? 'ON' : 'OFF'}
                </button>
                <input
                  type="text"
                  placeholder="슬랙 아이디를 입력해주세요"
                  value={userInfo.slack_id}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, slack_id: e.target.value });
                  }}
                  disabled={!isAlarmOn}
                  className={`w-full px-4 py-2 border ${
                    isAlarmOn ? 'border-gray-300 hover:ring-2 hover:ring-blue-100 ' : 'border-gray-200 bg-gray-100'
                  } rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none `}
                />
              </div>
            </label>
          </div>

          {/** 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full bg-blue-200 hover:bg-blue-100 text-white font-semibold py-2 px-4 rounded-lg"
          >
            회원가입하기
          </button>
        </form>
      </div>
      {/** Radial Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-100 via-blue-50 to-white z-[-1] animate-fadeIn" />
    </div>
  );
}
