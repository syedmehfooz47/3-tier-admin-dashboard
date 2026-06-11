import mongoose from 'mongoose';

/**
 * Establishes connection to MongoDB database.
 * Returns a Promise that resolves when connection is successful.
 */
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected successfully: ${con.connection.host}`);
        return con;
    } catch (error) {
        console.error(`Database connection error: ${error.message || error}`);
        throw error;
    }
};

export default connectDB;