import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('REDIS_URL'),
          tls: {}, // explicitly enable TLS — required for Upstash's rediss:// endpoints
          maxRetriesPerRequest: null, // required by BullMQ when using ioredis directly
        },
      }),
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}