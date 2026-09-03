import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlacementDrive, PlacementDriveSchema } from './schemas/placement-drive.schema.js';
import { Application, ApplicationSchema } from './schemas/application.schema.js';
import { PlacementsService } from './placements.service.js';
import { PlacementsController } from './placements.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { StudentsModule } from '../students/students.module.js';
import { DepartmentsModule } from '../departments/departments.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlacementDrive.name, schema: PlacementDriveSchema },
      { name: Application.name, schema: ApplicationSchema },
    ]),
    AuthModule,
    StudentsModule,
    DepartmentsModule,
  ],
  providers: [PlacementsService],
  controllers: [PlacementsController],
  exports: [MongooseModule, PlacementsService],
})
export class PlacementsModule {}