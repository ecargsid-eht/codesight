import express from 'express';
import {ENV} from './config/env.js';
import cors from "cors";
import {serve} from "inngest/express";
import { inngest, functions } from './config/inngest.js';
import {clerkMiddleware} from '@clerk/express';
import { protectRoute } from './middlewares/protectRoute.js';
import chatRoutes from './routes/chat.routes.js'
import sessionRoutes from './routes/session.routes.js'
import executeRoute from './routes/piston.routes.js';
const app = express();

app.use(express.json());
app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()
//credentials:true => server allows a browser to include cookies on request.
app.use(cors({origin:ENV.CLIENT_URL, credentials:true}));

app.use("/api/inngest", serve({client:inngest, functions}))
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/execute", executeRoute);
app.get("/",(req,res) => {
    res.json({msg:"API HIT SUCCESSFULLY."});
})

// When you pass an array of middlewares to Express, it flattens and automatically executes them sequentially.
app.use("/video-calls",protectRoute,(req, res) => {
    res.status(200).json({msg:"This is video call route. It's protected."});
})

app.use((req,res, next) => {
    res.status(404).json({msg:"Route not found"})
})

app.use((err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
    next();
})

export default app;
