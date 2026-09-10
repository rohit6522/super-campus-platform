import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AttendanceSession,
  AttendanceSessionDocument,
} from './schemas/attendance-session.schema.js';
import { Attendance, AttendanceDocument, AttendanceStatus } from './schemas/attendance.schema.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { MarkAttendanceDto } from './dto/mark-attendance.dto.js';
import { randomBytes } from 'crypto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(AttendanceSession.name)
    private sessionModel: Model<AttendanceSessionDocument>,
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
  ) {}

  async createSession(
    facultyId: string,
    dto: CreateSessionDto,
  ): Promise<AttendanceSessionDocument> {
    const session = new this.sessionModel({ ...dto, facultyId });
    return session.save();
  }

  async markAttendance(
    sessionId: string,
    facultyId: string,
    dto: MarkAttendanceDto,
  ): Promise<{ marked: number }> {
    const session = await this.sessionModel.findById(sessionId);
    if (!session) throw new NotFoundException('Attendance session not found');

    if (session.facultyId.toString() !== facultyId) {
      throw new BadRequestException('You did not create this session');
    }

    if (session.isFinalized) {
      throw new BadRequestException('This session has already been finalized');
    }

    const operations = dto.records.map((record) => ({
      updateOne: {
        filter: {
          sessionId: new Types.ObjectId(sessionId),
          studentId: new Types.ObjectId(record.studentId),
        },
        update: {
          $set: {
            sessionId: new Types.ObjectId(sessionId),
            studentId: new Types.ObjectId(record.studentId),
            subjectId: session.subjectId,
            status: record.status,
            markedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    await this.attendanceModel.bulkWrite(operations);

    session.isFinalized = true;
    await session.save();

    return { marked: dto.records.length };
  }


  async getStudentAttendanceForSubject(studentId: string, subjectId: string) {
    const records = await this.attendanceModel.find({ studentId, subjectId }).exec();
    const total = records.length;
    const present = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
    const percentage = total > 0 ? Math.round((present / total) * 10000) / 100 : 0;

    return { total, present, absent: total - present, percentage, records };
  }

  async getStudentOverallAttendance(studentId: string) {
    const records = await this.attendanceModel.find({ studentId }).exec();
    const total = records.length;
    const present = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
    const percentage = total > 0 ? Math.round((present / total) * 10000) / 100 : 0;

    return { total, present, absent: total - present, percentage };
  }

  async getSessionRoster(sessionId: string) {
    const session = await this.sessionModel
      .findById(sessionId)
      .populate('subjectId', 'name code')
      .exec();
    if (!session) throw new NotFoundException('Attendance session not found');

    const records = await this.attendanceModel
      .find({ sessionId })
      .populate('studentId', 'rollNumber')
      .exec();

    return { session, records };
  }
    async generateQrToken(sessionId: string, facultyId: string): Promise<{ token: string; expiresAt: Date }> {
    const session = await this.sessionModel.findById(sessionId);
    if (!session) throw new NotFoundException('Attendance session not found');

    if (session.facultyId.toString() !== facultyId) {
      throw new BadRequestException('You did not create this session');
    }

    if (session.isFinalized) {
      throw new BadRequestException('This session has already been finalized');
    }

    const token = randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 1000); // 15 second window

    session.qrToken = token;
    session.qrTokenExpiresAt = expiresAt;
    await session.save();

    return { token, expiresAt };
  }

  async scanQrCode(studentId: string, token: string): Promise<{ message: string }> {
    const session = await this.sessionModel.findOne({ qrToken: token });
    if (!session) {
      throw new BadRequestException('Invalid or expired QR code');
    }

    if (!session.qrTokenExpiresAt || new Date() > session.qrTokenExpiresAt) {
      throw new BadRequestException('This QR code has expired. Ask faculty to refresh it.');
    }

    if (session.isFinalized) {
      throw new BadRequestException('This attendance session has already been finalized');
    }

    const existing = await this.attendanceModel.findOne({ sessionId: session._id, studentId });
    if (existing) {
      throw new BadRequestException('You have already checked in for this session');
    }

    await this.attendanceModel.create({
      sessionId: session._id,
      studentId,
      subjectId: session.subjectId,
      status: AttendanceStatus.PRESENT,
      markedAt: new Date(),
    });

    return { message: 'Checked in successfully' };
  }
}