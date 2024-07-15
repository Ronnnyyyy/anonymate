const mongoose = require("mongoose");
const mongoURI = process.env.MONGOURI;

const connectToMongo=()=>{
    mongoose.connect(mongoURI).then(()=>{console.log('Connected to Mongodb')}).catch((e)=>{console.log(e.message)});
}

module.exports =  connectToMongo;