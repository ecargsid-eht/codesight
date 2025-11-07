import app from './src/app.js';
import connectDB from './src/config/db.js';
import { ENV } from './src/config/env.js';

async function startServer(){
    try{
        await connectDB();
        app.listen(ENV.PORT,() => {
            console.log("The app is started.", ENV.PORT);
        })
    }
    catch(e){
        console.log("Some error occured",e);
        process.exit(1);
    }
}

// startServer();
export default app;