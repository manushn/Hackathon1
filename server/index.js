const express=require("express");
const app=express();
const mongoose=require("mongoose");
const cors=require("cors");

require('dotenv').config()

const port=process.env.PORT||8080;
const verify=require("./middleware/VerifyToken");

const Login=require("./routes/auths/auth"); 
const ManageDoctor=require("./routes/doctors/ManageDoctors");

const DoctorDetails=require("./routes/doctors/DoctorDetails");
const Makeappoinment=require("./routes/Appoinment/Makeappoinment");

app.use(cors({ origin: "*" }));
app.use(express.json());

const ConnectAtlas=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDb Connected Successfully ")
    }catch(err){
        console.log("MongoDb Connection Failed!",err);
        process.exit(1);
    }
}
ConnectAtlas()

app.use("/upload", express.static("upload"));
app.use("/",Login);
app.use("/",verify,ManageDoctor);
app.use("/",verify,DoctorDetails);
app.use("/",verify,Makeappoinment);



app.listen(port,()=>{
    console.log(`Server is listening in port ${port}`)
})
