
import axiosInstance from "../lib/axios";

export const sessionApi = {
    createSession: async(data: { problem: string, difficulty: string }) => {
        const res = await axiosInstance.post('/sessions', data);
        return res.data;
    },
    getActiveSessions: async() => {
        console.log("Fetching active sessions");
        const res = await axiosInstance.get('/sessions/active');
        console.log(res);
        return res.data;
    },
    getPastSessions: async() => {
        const res = await axiosInstance.get('/sessions/past');
        return res.data;
    },
    getSessionById: async(sessionId: string) => {
        const res = await axiosInstance.get(`/sessions/${sessionId}`);
        console.log(res.data, "session data");
        return res.data;
    },
    joinSession: async(sessionId: string) => {
        const res = await axiosInstance.post(`/sessions/${sessionId}/join`);
        return res.data;
    },
    endSession: async(sessionId: string) => {
        const res = await axiosInstance.post(`/sessions/${sessionId}/end`);
        return res.data;
    },
    getStreamToken: async() => {
        const res = await axiosInstance.get(`/chat/token`);
        return res.data;
    }
}