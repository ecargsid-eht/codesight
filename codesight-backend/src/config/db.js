import mongoose from 'mongoose';
import {ENV} from './env.js';

const connectDB = async() => {
    try{
        if(!ENV.MONGO_URL){
            throw new Error("Some error has occured.");
        }
        await mongoose.connect(ENV.MONGO_URL);
        console.log("CONNECTED TO MONGO");
    }
    catch(e){
        console.log("Error in MONGO CONNECT: ",e);
        process.exit(1);
    }
}

export default connectDB;