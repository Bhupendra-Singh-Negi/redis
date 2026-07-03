import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json())
const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/notifications", async(req,res)=>{
    const payload={
        title:req.body.title||"Default title",
        createAt:new Date().toISOString()
    }
    const receiver=await publisher.publish("notifications",JSON.stringify(payload))
    res.json({message:`Notifications send to ${receiver} subscriber`})
})

app.listen(3000,()=>{
    console.log("running on port 3000")
})
