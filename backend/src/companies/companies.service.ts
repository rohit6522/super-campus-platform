import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema.js';
import { CreateCompanyDto } from './dto/create-company.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async create(dto: CreateCompanyDto): Promise<CompanyDocument> {
    const company = new this.companyModel(dto);
    return company.save();
  }

  async findAll(): Promise<CompanyDocument[]> {
    return this.companyModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<CompanyDocument> {
    const company = await this.companyModel.findById(id).exec();
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<CompanyDocument> {
    const company = await this.companyModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async remove(id: string): Promise<void> {
    const result = await this.companyModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Company not found');
  }
}