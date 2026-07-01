import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis= new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

function otpKey(phone){
    return `otp:${phone}`
}

app.post('/otp', async(req,res)=>{
    const {phone} = req.body;
    const otp = Math.floor(Math.random()*900000+100000).toString();

    await redis.set(otpKey(phone),otp,"EX",30)// otp valid for 30second
    // await redis.set(otpKey(phone),otp,"EX",30,NX)EX in second, PX in miniseconds, NX for set otp if otp is not set, XX fpr when otp is already set but what new otp
    res.status(200).json({success:true, message:"otp send", otp}) // in real life send through sms or email
})

app.post('/otp/verify', async(req,res)=>{
    const {phone, otp}= req.body;
    const storedOtp = await redis.get(otpKey(phone));
    
    if(!storedOtp){
        return res.status(404).json({message:"OTP is expired"})
    }
    
    if(storedOtp !== otp){
        return res.status(400).json({message:"Wrong otp"})
    }
    // first verify user then do further**********
    await redis.del(otpKey(phone));
    res.status(200).json({success:true, message:"otp verified successfully"})
})

// ttl is time to live
app.get('/otp/:phone/ttl', async(req,res)=>{
    const ttl= await redis.ttl(otpKey(req.params.phone))
    res.status(200).json({ttl});
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});