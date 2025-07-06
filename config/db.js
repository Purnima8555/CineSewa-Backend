const mongoose = require("mongoose");

const connectDB = async () => {

    try {
        await mongoose.connect("mongodb://localhost:27017/cinesewa_dabatase");
        console.log("MongoDb Connected")
    } catch (error) {
        console.log("MongoDb not connected");
    }
}

module.exports = connectDB;