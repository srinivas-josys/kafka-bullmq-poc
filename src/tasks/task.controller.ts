import { Controller, Post, Body } from '@nestjs/common';
import { KafkaService } from 'src/kafka/kafka.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post()
  async createTask(@Body() body: any) {
    await this.kafkaService.produceTask('tasks', body);
    return { message: 'Task created successfully' };
  }

  @Post('multiple')
  async createMultipleTasks() {
    const payloads = [
      {
        type: 'High',
        data: {
          email: 'user@example.com',
          subject: 'Welcome!',
          message: 'HighTask1',
        },
        attempts: 5,
        delay: 0,
        priority: 1,
      },
      {
        type: 'Medium',
        data: {
          email: 'user@example.com',
          subject: 'Welcome!',
          message: 'MediumTask1',
        },
        attempts: 5,
        delay: 0,
        priority: 3,
      },
      {
        type: 'Low',
        data: {
          email: 'user@example.com',
          subject: 'Welcome!',
          message: 'LowTask1',
        },
        attempts: 5,
        delay: 0,
        priority: 10,
      },
      {
        type: 'High',
        data: {
          email: 'user@example.com',
          subject: 'Welcome!',
          message: 'HighTask2',
        },
        attempts: 5,
        delay: 0,
        priority: 1,
      },
      {
        type: 'High',
        data: {
          email: 'user@example.com',
          subject: 'Welcome!',
          message: 'HighTask3',
        },
        attempts: 5,
        delay: 0,
        priority: 1,
      },
      {
        type: 'High',
        data: {
          email: 'user@example.com',
          subject: 'Welcome!',
          message: 'HighTask4',
        },
        attempts: 5,
        delay: 0,
        priority: 1,
      },
      {
        type: 'Medium',
        data: {
          email: 'user@example.com',
          subject: 'Welcome!',
          message: 'MediumTask2',
        },
        attempts: 5,
        delay: 0,
        priority: 3,
      },
      {
        type: 'Low',
        data: {
          email: 'user@example.com',
          subject: 'Welcome!',
          message: 'LowTask2',
        },
        attempts: 5,
        delay: 0,
        priority: 10,
      },
      {
        type: 'Medium',
        data: {
          email: 'user@example.com',
          subject: 'Welcome!',
          message: 'MediumTask3',
        },
        attempts: 5,
        delay: 0,
        priority: 3,
      },
    ];
    payloads.forEach(async (payload) => {
      await this.kafkaService.produceTask('tasks', payload);
    });
    return { message: 'Multiple Tasks Created Successfully' };
  }
}
