import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Faculty, FacultySchema } from './schemas/faculty.schema.js';
import { FacultyService } from './faculty.service.js';
import { FacultyController } from './faculty.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Faculty.name, schema: FacultySchema }]),
    AuthModule,
  ],
  providers: [FacultyService],
  controllers: [FacultyController],
  exports: [MongooseModule, FacultyService],
})
export class FacultyModule {}