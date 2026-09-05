import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement, AnnouncementDocument } from './schemas/announcement.schema.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(Announcement.name) private announcementModel: Model<AnnouncementDocument>,
  ) {}

  async create(postedBy: string, dto: CreateAnnouncementDto): Promise<AnnouncementDocument> {
    const announcement = new this.announcementModel({ ...dto, postedBy });
    return announcement.save();
  }

  async findAll(limit = 10) {
    return this.announcementModel
      .find()
      .populate('postedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}