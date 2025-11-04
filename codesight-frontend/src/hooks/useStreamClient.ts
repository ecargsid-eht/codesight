/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {StreamChat} from 'stream-chat';
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";
import type { StreamVideoClient } from "@stream-io/video-react-sdk";


function useStreamClient(session, loadingSession: boolean, isHost: boolean, isParticipant: boolean) {
    const [streamClient, setStreamClient] = useState<StreamVideoClient | null>(null);
    const [call, setCall] = useState<any>(null);
    const [chatClient, setChatClient] = useState<StreamChat | null>(null);
    const [channel, setChannel] = useState<any>(null);
    const [isInitializingCall, setIsInitializingCall] = useState<boolean>(false);

    useEffect(() => {
        let videoCall = null;
        let chatClientInstance: StreamChat | null = null;

        const initCall = async () => {
            if(!session?.callId) return;
            if(!isHost && !isParticipant) return;

            try{
                const {token, userId, userName, userImage} = await sessionApi.getStreamToken();

                const client = await initializeStreamClient({
                    id: userId,
                    name: userName,
                    image: userImage
                }, token);

                setStreamClient(client);
                videoCall = client.call("default",session.callId);
                await videoCall.join({create:true})

                const apiKey = import.meta.env.VITE_STREAM_API_KEY || '';
                chatClientInstance =StreamChat.getInstance(apiKey);
                await chatClientInstance.connectUser({
                    id: userId,
                    name: userName,
                    image: userImage
                }, token);

                setChatClient(chatClientInstance);
                const chatChannel = chatClientInstance.channel("messaging", session.callId);
                await chatChannel.watch();
                setChannel(chatChannel);
                setCall(videoCall);
            }
            catch(error){
                toast.error("Failed to get Stream token");
                console.log(error)
            }
            finally{
                setIsInitializingCall(false);
            }
        }

        if(session && !loadingSession) initCall()

        return () => {
            (async () => {
              try {
                if (videoCall) await videoCall.leave();
                if (chatClientInstance)
                  await chatClientInstance.disconnectUser();
                await disconnectStreamClient();
              } catch (error) {
                console.error("Cleanup error:", error);
              }
            })();
        }
    },[session, loadingSession, isHost, isParticipant])

    return{
        streamClient,
        call, chatClient, channel, isInitializingCall
    }
}

export default useStreamClient;