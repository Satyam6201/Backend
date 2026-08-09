import mongoose from "mongoose";

const dbConnection = async (req, res) => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB is connected`);
    } catch (error) {
        console.log(`error coming from DB ${error}`);
    }
}

export default dbConnection;