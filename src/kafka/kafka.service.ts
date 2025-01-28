import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class KafkaService {
  private readonly kafka = new Kafka({
    clientId: 'kafka-bullmq-poc',
    brokers: ['localhost:9092'],
  });
  private readonly producer = this.kafka.producer();
  private readonly consumer = this.kafka.consumer({
    groupId: 'test-group',
    sessionTimeout: 360000,
    heartbeatInterval: 3000,
  });

  constructor(@InjectQueue('taskQueue') private readonly taskQueue: Queue) {
    this.init();
  }

  async init() {
    try {
      await this.producer.connect();
      console.log('====== Kafka Producer Connected ======');
    } catch (error) {
      console.error(
        `====== Error connecting producer: ${error.message} ======`,
      );
    }

    try {
      await this.consumer.connect();
      console.log('====== Kafka Consumer Connected ======');
    } catch (error) {
      console.error(
        `====== Error connecting consumer: ${error.message} ======`,
      );
    }

    try {
      await this.consumer.subscribe({ topic: 'tasks', fromBeginning: true });
      console.log(`====== Kafka Subscribed to tasks topic`);
    } catch (error) {
      console.error(
        `====== Error subscribing to topic: ${error.message} ======`,
      );
    }

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const task = JSON.parse(message.value.toString());
          console.log('Task Priority being added to BullMQ : ', task.priority);
          await this.taskQueue.add(task.type, task.data, {
            attempts: task.attempts || 3,
            delay: task.delay || 0,
            priority: task.priority || 0,
          });
          console.log(
            `====== Task ${JSON.stringify(task)} added to BullMQ Queue Successfully ======`,
          );
        } catch (error) {
          console.error(
            `====== Error processing message: ${error.message} ======`,
          );
        }
      },
    });
  }

  async produceTask(topic: string, task: any) {
    console.log(`======= Producing Task to Kafka Topic : ${topic} =======`);
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(task) }],
    });
    console.log(
      `======= Produced Task Successfully to Kafka Topic : ${topic} =======`,
    );
  }
}
