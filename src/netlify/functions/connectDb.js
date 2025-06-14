import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI; // Obtém a URI do ambiente

async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Conectado ao MongoDB Atlas!");
    } catch (error) {
        console.error("Erro na conexão:", error);
    }
}



export default connectDB;
