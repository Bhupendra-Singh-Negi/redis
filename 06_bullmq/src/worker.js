import { Worker } from "bullmq";
import {connection} from './queue.js'


const worker =  new Worker(
    "emailQueue",
    async (job)=>{
        console.log("processing email job....". job.id, job.name, job.data);
        (await new Promise((resolve)=> setTimeout(resolve,1500)),
        console.log("processing email job....". job.id, job.name, job.data));
    },
    {connection}
)

worker.on("completed",(job)=>{
    console.log("Job Completed",job.id, job.name, job.data);
})

worker.on("failed",(job,error)=>{
    console.log("Job failed",job.id, job.name, job.data, error)
})