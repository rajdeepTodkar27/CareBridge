import mongoose from "mongoose";

export async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!)

        const connection = mongoose.connection

        connection.on('connected',()=>{
            console.log("db connected")
        })

    } catch (error) {
        console.log("somthing went wrong unable to connect to the database")
        console.log(error)
        
        process.exit()
    }
}