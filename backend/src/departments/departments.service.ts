import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema.js';
import { CreateDepartmentDto } from './dto/create-department.dto.js';
import { UpdateDepartmentDto } from './dto/update-department.dto.js';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>,
  ) {}

  async create(dto: CreateDepartmentDto): Promise<DepartmentDocument> {
    const existing = await this.departmentModel.findOne({
      $or: [{ name: dto.name }, { code: dto.code.toUpperCase() }],
    });

    if (existing) {
      throw new ConflictException('Department with this name or code already exists');
    }

    const department = new this.departmentModel(dto);
    return department.save();
  }

  async findAll(): Promise<DepartmentDocument[]> {
    return this.departmentModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<DepartmentDocument> {
    const department = await this.departmentModel.findById(id).exec();
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<DepartmentDocument> {
    const department = await this.departmentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }

  async remove(id: string): Promise<void> {
    const result = await this.departmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Department not found');
    }
  }
}