import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { BullModule } from '@nestjs/bullmq';
import { BullJobsProcessor } from './bullmq/bullmq.processor';
import { AppController } from './app.controller';
import { TasksController } from './tasks/task.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController, TasksController],
  imports: [
    KafkaModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'taskQueue',
    }),
  ],
  providers: [AppService, BullJobsProcessor],
})
export class AppModule {}
