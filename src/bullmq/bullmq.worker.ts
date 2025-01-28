import { Worker, Job, Queue } from 'bullmq';

const queueName = 'taskQueue';
const dlqName = 'deadLetterQueue';

const worker = new Worker(
  queueName,
  async (job: Job) => {
    console.log('======= Task Consumed from BullMQ Queue =======');
    console.log(`Task Details : ${JSON.stringify(job)}`);
    await handleTask(job);
  },
  {
    connection: {
      host: 'localhost',
      port: 6379,
    },
    concurrency: 5,
  },
);

worker.on('completed', (job: Job) => {
  console.log(
    `======= Job Completed in BullMQ Consumer : ${job.id} with Priority ${job.opts.priority} =======`,
  );
});

worker.on('failed', async (job: Job, err: any) => {
  console.error(
    `Job Failed : ${job.id} in BullMQ Consumer with error: ${err.message}`,
  );

  const maxAttempts = job.opts.attempts || 3;
  if (job.attemptsMade >= maxAttempts) {
    console.error(`Job ${job.id} has failed after all retry attempts.`);
    await handleExhaustedFailure(job);
  } else {
    console.log(
      `Job ${job.id} will be retried. Attempts made: ${job.attemptsMade}`,
    );
  }
});

async function handleTask(job: Job) {
  console.log(
    `======= Processing job ${job.id} of type ${job.name} in BullMQ Consumer =======`,
  );
  if (job.name && job.name === 'SimulateFailure') {
    throw new Error('[ERROR] Failure Simulation');
  }
}

async function handleExhaustedFailure(job) {
  // Implement your logic for handling the exhausted job failure e.g., moving to a Dead Letter Queue
  console.log('All Retry attempts exhausted');
  const dlq = new Queue(dlqName, {
    connection: {
      host: 'localhost',
      port: 6379,
    },
  });

  // Check if the DLQ exists by checking the number of jobs
  const jobCounts = await dlq.getJobCounts();
  if (
    jobCounts.waiting === 0 &&
    jobCounts.active === 0 &&
    jobCounts.completed === 0 &&
    jobCounts.failed === 0
  ) {
    console.log(`DLQ ${dlqName} does not exist, creating and adding jobs.`);
  } else {
    console.log(`DLQ ${dlqName} already exists, adding job to it.`);
  }
  await dlq.add(job.name, job.data, {
    attempts: 0, // Do not retry in the DLQ
    removeOnComplete: true,
  });
}

// ts-node src/bullmq/bullmq.worker.ts
