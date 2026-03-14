import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'LIKES_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
          queue: 'likes_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService]
})
export class LikesModule {}
