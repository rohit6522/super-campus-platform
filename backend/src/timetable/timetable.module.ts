import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimetableEntry, TimetableSchema } from './schemas/timetable.schema.js';
import { TimetableService } from './timetable.service.js';
import { TimetableController } from './timetable.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TimetableEntry.name, schema: TimetableSchema }]),
    AuthModule,
  ],
  providers: [TimetableService],
  controllers: [TimetableController],
  exports: [MongooseModule, TimetableService],
})
export class TimetableModule {}