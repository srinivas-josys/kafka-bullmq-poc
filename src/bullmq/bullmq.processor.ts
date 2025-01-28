/*
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker, Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class BullJobsProcessor implements OnModuleInit {
  private worker: Worker;

  constructor(@InjectQueue('taskQueue') private readonly taskQueue: Queue) {}

  async onModuleInit() {
    console.log('-------- Starting BullMQ Worker --------');
    this.worker = new Worker(
      'taskQueue',
      async (job: Job) => {
        console.log('======= Task Consumed from BullMQ Queue =======');
        console.log(`Task Details : ${JSON.stringify(job)}`);
        await this.handleTask(job);
      },
      {
        connection: {
          host: 'localhost', // Ensure the connection is specified
          port: 6379,
        },
        concurrency: 2,
      },
    );

    this.worker.on('completed', (job: Job) => {
      console.log(
        `======= Job Completed in BullMQ Consumer : ${job.id} with Priority ${job.opts.priority} =======`,
      );
    });

    this.worker.on('failed', (job: Job, err: any) => {
      console.error(
        `Job Failed : ${job.id} in BullMQ Consumer with error: ${err.message}`,
      );
    });
  }

  private async handleTask(job: Job) {
    console.log(
      `======= Processing job ${job.id} of type ${job.name} in BullMQ Consumer =======`,
    );
    if (job.name && job.name === 'SimulateFailure') {
      throw new Error('[ERROR] Failure Simulation');
    }
  }
}
*/

export class BullJobsProcessor {
  // We do not want the BullMQ Worker to start on APP Initialization otherwise the priority based processing cant be observed,
  // as the tasks are processed in FIFO as they are all processed immediately as enqueued
}
