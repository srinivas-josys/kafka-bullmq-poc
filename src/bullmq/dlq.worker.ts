import { Worker, Queue } from 'bullmq';

const failedJobsQueueName = 'deadLetterQueue';
const originalQueueName = 'taskQueue';

// Create a worker for the DLQ
const dlqWorker = new Worker(
  failedJobsQueueName,
  async (job) => {
    console.log(`Processing job from DLQ: ${job.id}`);

    try {
      await handleDeadLetterJob(job);
    } catch (error) {
      console.error(
        `Job ${job.id} failed during DLQ processing: ${error.message}`,
      );
    }
  },
  {
    connection: {
      host: 'localhost',
      port: 6379,
    },
  },
);

async function handleDeadLetterJob(job) {
  const failureReason = job.finished().catch((err) => err);
  console.log(`Job ${job.id} failed with reason: ${failureReason}`);

  // Here you might want to inspect job.data to address the failure
  // Decide whether to retry the job or log an error/not reprocess
  if (shouldRetry(job)) {
    // Re-add to the original queue
    const originalQueue = new Queue(originalQueueName, {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });

    await originalQueue.add(job.name, job.data, {
      attempts: 3, // You can define how many times to retry after a DLQ process
      priority: job.opts.priority || 0, // Maintain the same priority
    });
    console.log(`Re-added job ${job.id} to the original queue.`);
  } else {
    // Handle the message differently, e.g., logging or notifying
    console.error(`Job ${job.id} is not eligible for retry. Logging failure.`);
  }
}

// Function to determine whether to retry the job
function shouldRetry(job) {
  // Implement your logic to decide: retry based on job attributes, failure reasons, etc.
  // For example:
  const failureReason = job.finished().catch((err) => err);
  return failureReason.includes('server error'); // Example condition for retry
}
