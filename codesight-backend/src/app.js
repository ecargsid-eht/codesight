import express from 'express';
import {ENV} from './config/env.js';
import cors from "cors";
import {serve} from "inngest/express";
import { inngest } from './config/inngest.js';

const app = express();

app.use(express.json());
//credentials:true => server allows a browser to include cookies on request.
app.use(cors({origin:ENV.CLIENT_URL, credentials:true}));

app.use("/api/inngest", serve({client:inngest, functions}))

app.get("/",(req,res) => {
    res.json({msg:"API HIT SUCCESSFULLY."});
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

app.listen(ENV.PORT, () => {
    console.log("API IS READY at PORT:", ENV.PORT);
})

export default app;
