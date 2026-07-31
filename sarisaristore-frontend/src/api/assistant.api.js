import axiosClient from './axiosClient';

export async function sendAssistantMessage(message, history) {
  const response = await axiosClient.post('/assistant/chat', { message, history });
  return response.data;
}
