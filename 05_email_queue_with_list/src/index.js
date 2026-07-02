import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis( process.env.REDIS_URL || 'redis://localhost:6379');

const QUEUE_KEY="queue:emails"

app.post("/emails",async(req,res)=>{
    const job={
        to:req.body.to,
        subject:req.body.subject||"No Subject",
        body:req.body.body||"No content",
        createAt:new Date().toISOString()
    }
    await redis.lpush(QUEUE_KEY,JSON.stringify(job));
    res.json({queue:true,job});
})
app.get('/emails/process-one',async(req,res)=>{
    const rawJob= await redis.rpop(QUEUE_KEY);
    if(!rawJob){
        return res.json({message:"no job in queue"})
    }
    const job= JSON.parse(rawJob);
    res.json({message:"email send",job})
})


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});