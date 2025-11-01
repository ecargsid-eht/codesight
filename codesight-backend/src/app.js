import express from 'express';
import {ENV} from './config/env.js';
const app = express();

app.get("/",(req,res) => {
    res.json({msg:"API HIT SUCCESSFULLY."});
})

app.listen(ENV.PORT, () => {
    console.log("API IS READY at PORT:", ENV.PORT);
})

export default app;