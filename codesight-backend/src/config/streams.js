import {StreamChat} from 'stream-chat';
import { ENV } from './env.js';
import {StreamClient} from '@stream-io/node-sdk';

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    throw new Error("STREAM API KEY OR STREAM SECRET IS MISSING");
}


export const streamClient = new StreamClient(apiKey, apiSecret); // this will be used for video calls
export const chatClient = StreamChat.getInstance(apiKey, apiSecret); // this is for chat features

export const upsertStreamUser = async(userData) => {
    try{
        await chatClient.upsertUser(userData);
    }
    catch(e){
        console.log("Error upserting stream user:",e);
    }
}

export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUser(userId);
    }
    catch (e) {
        console.log("Error deleting stream user:", e);
    }
}