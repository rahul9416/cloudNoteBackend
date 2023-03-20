const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017/";
const mongoURI = "mongodb+srv://rahulgoyal9418:rahulgoel@cluster0.atlnfor.mongodb.net/cloudnote?retryWrites=true&w=majority";

const connectToMongo = () => {
    
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.mongoURI, ()=>{
        console.log("Hello! Connected to Mongo");
    })

}

module.exports = connectToMongo;
// useNewUrlParser: true, useUnifiedTopology: true