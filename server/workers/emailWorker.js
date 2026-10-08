import { Worker } from "bullmq";
import bullConnection from "../config/bullmqRedis.js";
import mailsender from "../utils/mailsender.js";

const worker = new Worker(
  "email",
  async (job) => {
    const { to, subject, html } = job.data;
    await mailsender(to, subject, html);
  },
  {
    connection: bullConnection,
    concurrency: 5, // up to 5 emails in flight at once
    limiter: { max: 10, duration: 1000 }, // at most 10 emails per second
  }
);
console.log('hellow there');
worker.on("completed", (job) => {
  console.log(`[email] ${job.name} job ${job.id} sent`);
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