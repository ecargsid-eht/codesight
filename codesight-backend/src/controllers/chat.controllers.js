import { chatClient } from "../config/streams.js";

export async function getStreamToken(req, res){
    try{
        //use clerk id for stream, not mongodb - it should match the ID in the stream dashboard.
        const token = chatClient.createToken(req.user.clerkId);
        res.status(200).json({token, userId: req.user.clerkId, userName:req.user.name, userImage: req.user.image});
    }
    catch(e){
        console.log("Error in getStreamToken",e);
        res.status(500).json({msg:"Internal Server Error"});
    }
}