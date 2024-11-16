import axios from 'axios';
const BASE_URL = 'http://127.0.0.1:3000';
export const registerUser = async (userInfo) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, {
      account_id: userInfo.account_id,
      password: userInfo.password,
      nickname: userInfo.nickname,
      slack_id: userInfo.slack_id || null, // Set slack_id as null if it's not provided
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
