import { Module } from '@nestjs/common';
import { BullJobsProcessor } from './bullmq.processor';

@Module({
  providers: [BullJobsProcessor],
})
export class BullJobsModule {}
