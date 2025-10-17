const jwt =require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const tokenVerify=(req,res,next)=>{
    const authHeader=req.headers["authorization"];
    const token= authHeader&&authHeader.split(" ")[1];

    if(!token){
        return res.status(400).json({message:"No token, access denied"})
    }

    try{
        const bytes = CryptoJS.AES.decrypt(token,process.env.CRYPTO_KEY);
        const dToken=bytes.toString(CryptoJS.enc.Utf8);

        jwt.verify(dToken,process.env.JWT_SECRET,(err,payload)=>{
            if(err){
                return res.status(203).json({InvalidToken:true ,emessage:"Invalid or expaired Token"})
            }

            req.tokenData =payload;
            next();
        });

    }catch(err){
        
        return res.status(203).json({InvalidToken:true ,emessage:"Invalid Token"})
    }
}

module.exports=tokenVerify;