import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Department, DepartmentSchema } from './schemas/department.schema.js';
import { DepartmentsService } from './departments.service.js';
import { DepartmentsController } from './departments.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema }]),
    AuthModule,
  ],
  providers: [DepartmentsService],
  controllers: [DepartmentsController],
  exports: [MongooseModule, DepartmentsService],
})
export class DepartmentsModule {}