import { Worker } from "bullmq";
import bullConnection from "../config/bullmqRedis";
import mailsender from "../utils/mailsender";

const worker  = new Worker(
    'email' , 
    async(job) => {
        const {to , subject , html} = job.data; 
        await mailsender(to , subject , html) ; 
    },
    {
        bullConnection , 
        concurrency : 5, // up to 5 emails in flight at once
        limiter : {max : 10 , duration : 1000}, // at
        limit
    }
)

worker.on('complete' , job => {
    console.log(`[email] ${job.name} job ${job.id} sent`) ; 
});

worker.on("failed", (job, err) => {
  console.error(
    `[email] ${job?.name} job ${job?.id} failed (attempt ${job?.attemptsMade}/${job?.opts?.attempts}):`,
    err.message
  );
});

worker.on("error", (err) => {
  console.error("[email] worker error:", err.message);
});
 
export default worker;