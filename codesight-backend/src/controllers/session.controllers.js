import { chatClient, streamClient } from "../config/streams.js";
import Session from "../models/Session.js";

export async function createSession(req, res) {
    try {
        const { problem, difficulty } = req.body
        const userId = req.user._id
        const clerkId = req.user.clerkId;

        if (!problem || !difficulty) {
            return res.status(404).json({ msg: "Problem and difficulty are required." });
        }
        //generate a unique call id for video
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        // create session in db;
        const session = await Session.create({ problem, difficulty, host: userId, callId });

        //create stream video call
        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: { problem, difficulty, sessionId: session._id.toString() }
            }
        })

        const channel = chatClient.channel("messaging", callId, {
            name: `${problem}Session`,
            created_by_id: clerkId,
            members: [clerkId]
        })
        await channel.create();
        return res.status(201).json({ session })
    } catch (e) {
        console.log("Error in createSession controller:", e);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

export async function getActiveSessions(req, res) {
    try {
        const sessions = await Session.find({ status: "active" }).populate("host").sort({ createdAt: -1 }).limit(20);


        return res.status(200).json({ sessions });
    }
    catch (e) {
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

export async function getPastSessions(req, res) {
    try {
        const userId = req.user._id;
        const sessions = await Session.find({ status: "completed", $or: [{ host: userId }, { participant: userId }] }).populate("host").populate("participant").sort({ createdAt: -1 }).limit(20);


        return res.status(200).json({ sessions });
    }
    catch (e) {
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

export async function getSessionById(req, res) {
    try {
        const { id } = req.params;
        const session = await Session.findById(id).populate("host").populate("participant");

        if(!session){
            return res.status(404).json({msg:"Session not found."});
        }
        return res.status(200).json({session});
    }
    catch (e) { 
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

export async function joinSession(req, res) { 
    try{
        const {id} = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        const session = await Session.findById(id);
        if(!session) return res.status(404).json({msg:"Session not found"});

        // check if session is already full - has a participant.
        if(session.participant) return res.status(401).json({msg:"Session is full."});
        session.participant = userId;
        await session.save();

        const channel = chatClient.channel("messaging",session.callId);
        await channel.addMembers([clerkId]);
        return res.status(200).json({session});
    }
    catch(e){
        console.log("Error in Join Session", e);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

export async function endSession(req, res) {
    try{
        const {id} = req.params;
        const userId = req.user._id;

        const session = await Session.findById(id);
        if(!session) return res.status(404).json({message:"Session not found"});

        if(session.host.toString() !== userId.toString()){
            return res.status(403).json({msg:"Only the host can end the session."});
        }
        if(session.status !== "completed"){
            return res.status(400).json({ msg: "Session is already ended." });
        }
        session.status = "completed";
        await session.save();

        const call = streamClient.video.call("default",session.callId);
        await call.delete({hard:true});

        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();

        return res.status(200).json({session, msg:"Session ended successfully."});
    }
    catch(e){
        console.log("Error in End Session", e);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}