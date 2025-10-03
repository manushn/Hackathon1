const express=require("express");
const app=express();
const mongoose=require("mongoose");
const cors=require("cors");

require('dotenv').config()

const port=process.env.PORT

const Login=require("./routes/auths/auth"); 
const ManageDoctor=require("./routes/doctors/ManageDoctors");

app.use(cors());
app.use(express.json());

const ConnectAtlas=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log("MongoDb Connected Successfully ")
    }catch(err){
        console.log("MongoDb Connection Failed!",err);
        process.exit(1);
    }
}
ConnectAtlas()

app.use("/upload", express.static("upload"));
app.use("/",Login);
app.use("/",ManageDoctor);


app.listen(port,()=>{
    console.log(`Server is listening in port ${port}`)
})
