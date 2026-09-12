import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimetableEntry, TimetableDocument } from './schemas/timetable.schema.js';
import { CreateTimetableEntryDto } from './dto/create-timetable-entry.dto.js';

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(TimetableEntry.name) private timetableModel: Model<TimetableDocument>,
  ) {}

  async create(dto: CreateTimetableEntryDto): Promise<TimetableDocument> {
    // Prevent double-booking the same faculty at the same day/time
    const facultyConflict = await this.timetableModel.findOne({
      facultyId: dto.facultyId,
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
    });
    if (facultyConflict) {
      throw new ConflictException('Faculty already has a class at this time');
    }

    // Prevent double-booking the same room at the same day/time
    const roomConflict = await this.timetableModel.findOne({
      room: dto.room,
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
    });
    if (roomConflict) {
      throw new ConflictException('Room is already booked at this time');
    }

    const entry = new this.timetableModel(dto);
    return entry.save();
  }

  async findByDepartmentAndSemester(departmentId: string, semester: number) {
    return this.timetableModel
      .find({ departmentId, semester })
      .populate('subjectId', 'name code')
      .populate('facultyId', 'name email')
      .sort({ dayOfWeek: 1, startTime: 1 })
      .exec();
  }

  async findByFaculty(facultyId: string) {
    return this.timetableModel
      .find({ facultyId })
      .populate('subjectId', 'name code')
      .populate('departmentId', 'name code')
      .sort({ dayOfWeek: 1, startTime: 1 })
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.timetableModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Timetable entry not found');
  }

    async update(id: string, dto: Partial<CreateTimetableEntryDto>): Promise<TimetableDocument> {
    // If updating day/time/room, re-check conflicts (excluding this entry itself)
    if (dto.dayOfWeek && dto.startTime) {
      const existing = await this.timetableModel.findById(id);
      if (!existing) throw new NotFoundException('Timetable entry not found');

      if (dto.facultyId ?? existing.facultyId) {
        const facultyConflict = await this.timetableModel.findOne({
          _id: { $ne: id },
          facultyId: dto.facultyId ?? existing.facultyId,
          dayOfWeek: dto.dayOfWeek,
          startTime: dto.startTime,
        });
        if (facultyConflict) {
          throw new ConflictException('Faculty already has a class at this time');
        }
      }

      if (dto.room ?? existing.room) {
        const roomConflict = await this.timetableModel.findOne({
          _id: { $ne: id },
          room: dto.room ?? existing.room,
          dayOfWeek: dto.dayOfWeek,
          startTime: dto.startTime,
        });
        if (roomConflict) {
          throw new ConflictException('Room is already booked at this time');
        }
      }
    }

    const updated = await this.timetableModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Timetable entry not found');
    return updated;
  }
}