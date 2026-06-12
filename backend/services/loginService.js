import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

let latestToken = null;

export const loginAndGetToken = async (username) => {
  try {
    const apiUrl = process.env.LOGIN_API_URL;
    const password = process.env.LOGIN_PASSWORD || '12345678';
    
    const payload = {
      username: username,
      password: password,
      device_id: "web",
      ip_address: "106.219.68.65",
      operator_id: "250201",
      platform_id: "mobile",
      website: "playbd.net",
      uniqueId: 8240.981040445715
    };

    const response = await axios.post(apiUrl, payload);
    
    // The API response contains authToken either directly in data.authToken 
    // or nested inside data._doc.gameAuth_token_details.authToken
    const resData = response.data?.data;
    if (resData) {
      const nestedToken = resData._doc?.gameAuth_token_details?.authToken;
      const rootToken = resData.authToken;
      latestToken = nestedToken || rootToken;
      
      if (latestToken) {
        return latestToken;
      }
    }
    
    console.error("Unexpected API Response Structure:", JSON.stringify(response.data));
    throw new Error('Token not found in response');
  } catch (error) {
    console.error('Error calling login API:', error.message);
    throw error;
  }
};

export const getLatestToken = () => {
  return latestToken;
};
