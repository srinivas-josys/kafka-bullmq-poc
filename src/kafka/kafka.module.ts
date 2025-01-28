import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'taskQueue',
    }),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
