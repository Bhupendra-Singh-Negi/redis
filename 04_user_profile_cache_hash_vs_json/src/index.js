import express from "express";
import Redis from "ioredis";
import { success } from "zod";

const app = express();

app.use(express.json());

const redis= new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post("/user/:id/json", async(req,res)=>{
    await redis.set(`user:${req.params.id}`,JSON.stringify(req.body))
    res.status(200).json({success:true, message:"user profile cached in json"})
})
app.get("/user/:id/json", async(req,res)=>{
    const raw=await redis.get(`user:${req.params.id}`)
    res.status(200).json({success:true, user:raw?JSON.parse(raw):null})
})

app.post("/user/:id/hash", async(req,res)=>{
    await redis.hset(`user:${req.params.id}:hash`,req.body)
    res.status(200).json({message:"user profile cached in hashset"})
})
app.get("/user/:id/hash",async(req,res)=>{
    const raw=await redis.hgetall(`user:${req.params.id}:hash`)
    res.status(200).json({success:true, user:raw?raw:null})
})

/*
hset hget hgetall hdel hexists
hkeys hvals hlen
expire(for seconds) pexpire(for milliseconds)
eg ttl along with hash
await redis.hset(`user:${req.params.id}:hash`,req.body)
await redis.expire(30) //for 30s
*/

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});