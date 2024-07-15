const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017";

const connectToMongo=()=>{
    mongoose.connect(mongoURI).then(()=>{console.log('Connected to Mongodb')}).catch((e)=>{console.log(e.message)});
}

module.exports =  connectToMongo;