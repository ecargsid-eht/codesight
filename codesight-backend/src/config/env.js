import 'dotenv/config';

export const ENV = {
    PORT: process.env.PORT || 5000,
    MONGO_URL: process.env.MONGO_URL
}