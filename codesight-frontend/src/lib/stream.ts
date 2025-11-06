import {StreamVideoClient, type UserRequest} from '@stream-io/video-react-sdk';

const apiKey = import.meta.env.VITE_STREAM_API_KEY || '';
let client:StreamVideoClient | null = null;


export const initializeStreamClient = async (user:UserRequest, token:string, connectedUserId?: string) => {

  if (client && connectedUserId === user.id) return client;

  if (client) {
    await disconnectStreamClient();
  }

  if (!apiKey) throw new Error("Stream API key is not provided.");

  client = new StreamVideoClient({
    apiKey,
    user,
    token,
  });

  return client;
};

export const disconnectStreamClient = async () => {
  if (client) {
    try {
      await client.disconnectUser();
      client = null;
    } catch (error) {
      console.error("Error disconnecting Stream client:", error);
    }
  }
};