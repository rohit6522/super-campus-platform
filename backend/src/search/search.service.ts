import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument } from '../subjects/schemas/subject.schema.js';
import { Company, CompanyDocument } from '../companies/schemas/company.schema.js';
import { CodingProblem, CodingProblemDocument } from '../coding/schemas/coding-problem.schema.js';
import { Announcement, AnnouncementDocument } from '../announcements/schemas/announcement.schema.js';

export interface SearchResult {
  type: 'subject' | 'company' | 'coding-problem' | 'announcement';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(CodingProblem.name) private codingProblemModel: Model<CodingProblemDocument>,
    @InjectModel(Announcement.name) private announcementModel: Model<AnnouncementDocument>,
  ) {}

  async search(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];

    const regex = { $regex: query, $options: 'i' };

    const [subjects, companies, problems, announcements] = await Promise.all([
      this.subjectModel.find({ $or: [{ name: regex }, { code: regex }] }).limit(5).exec(),
      this.companyModel.find({ name: regex }).limit(5).exec(),
      this.codingProblemModel.find({ title: regex }).limit(5).exec(),
      this.announcementModel.find({ title: regex }).limit(5).exec(),
    ]);

    const results: SearchResult[] = [];

    subjects.forEach((s) =>
      results.push({
        type: 'subject',
        id: String(s._id),
        title: s.name,
        subtitle: `Subject · ${s.code}`,
        href: `/dashboard/assignments`,
      }),
    );

    companies.forEach((c) =>
      results.push({
        type: 'company',
        id: String(c._id),
        title: c.name,
        subtitle: `Company · ${c.industry}`,
        href: `/dashboard/placements`,
      }),
    );

    problems.forEach((p) =>
      results.push({
        type: 'coding-problem',
        id: String(p._id),
        title: p.title,
        subtitle: `Coding Problem · ${p.difficulty}`,
        href: `/dashboard/coding/${p._id}`,
      }),
    );

    announcements.forEach((a) =>
      results.push({
        type: 'announcement',
        id: String(a._id),
        title: a.title,
        subtitle: `Announcement · ${a.category}`,
        href: `/dashboard`,
      }),
    );

    return results;
  }
}