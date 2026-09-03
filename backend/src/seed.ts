import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module.js';
import { User, UserRole } from './users/schemas/user.schema.js';
import { Department } from './departments/schemas/department.schema.js';
import { Subject } from './subjects/schemas/subject.schema.js';
import { Student } from './students/schemas/student.schema.js';
import { Faculty } from './faculty/schemas/faculty.schema.js';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<any>>(getModelToken(User.name));
  const departmentModel = app.get<Model<any>>(getModelToken(Department.name));
  const subjectModel = app.get<Model<any>>(getModelToken(Subject.name));
  const studentModel = app.get<Model<any>>(getModelToken(Student.name));
  const facultyModel = app.get<Model<any>>(getModelToken(Faculty.name));

  console.log('Clearing existing seed-relevant data...');

  await userModel.deleteMany({ email: { $regex: /@seed\.test$/ } });
  await departmentModel.deleteMany({ code: 'CSE' });
  await studentModel.deleteMany({ rollNumber: { $in: ['CSE2023001', 'CSE2023002'] } });
  await facultyModel.deleteMany({ employeeId: 'EMP001' });
  await subjectModel.deleteMany({ code: { $in: ['CS201', 'CS301'] } });

  console.log('Creating department...');
  const department = await departmentModel.create({
    name: 'Computer Science and Engineering',
    code: 'CSE',
    description: 'Department of Computer Science and Engineering',
  });

  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('Creating users...');
  const admin = await userModel.create({ name: 'Admin User', email: 'admin@seed.test', password: hashedPassword, role: UserRole.ADMIN });
  const hod = await userModel.create({ name: 'Dr. HOD User', email: 'hod@seed.test', password: hashedPassword, role: UserRole.HOD });
  const faculty = await userModel.create({ name: 'Prof. Faculty User', email: 'faculty@seed.test', password: hashedPassword, role: UserRole.FACULTY });
  const placementOfficer = await userModel.create({ name: 'Placement Officer', email: 'placement@seed.test', password: hashedPassword, role: UserRole.PLACEMENT_OFFICER });
  const studentUser1 = await userModel.create({ name: 'Rohit Sharma', email: 'student1@seed.test', password: hashedPassword, role: UserRole.STUDENT });
  const studentUser2 = await userModel.create({ name: 'Priya Verma', email: 'student2@seed.test', password: hashedPassword, role: UserRole.STUDENT });

  console.log('Creating subjects...');
  const subject1 = await subjectModel.create({ name: 'Data Structures', code: 'CS201', credits: 4, semester: 3, departmentId: department._id, facultyId: faculty._id });
  const subject2 = await subjectModel.create({ name: 'Database Management Systems', code: 'CS301', credits: 4, semester: 3, departmentId: department._id, facultyId: faculty._id });

  console.log('Creating student profiles...');
  await studentModel.create({ userId: studentUser1._id, rollNumber: 'CSE2023001', departmentId: department._id, semester: 3, batchYear: 2023, graduationYear: 2027, currentCGPA: 8.4, attendancePercentage: 87, backlogs: 0 });
  await studentModel.create({ userId: studentUser2._id, rollNumber: 'CSE2023002', departmentId: department._id, semester: 3, batchYear: 2023, graduationYear: 2027, currentCGPA: 7.9, attendancePercentage: 92, backlogs: 0 });

  console.log('Creating faculty profile...');
  await facultyModel.create({ userId: faculty._id, employeeId: 'EMP001', departmentId: department._id, designation: 'Assistant Professor', joiningDate: new Date('2020-07-01'), specialization: 'Data Structures & Algorithms' });

  console.log('\n✅ Seed complete!\n');
  console.log('Login credentials (all use password: password123):');
  console.log('  Admin:              admin@seed.test');
  console.log('  HOD:                hod@seed.test');
  console.log('  Faculty:            faculty@seed.test');
  console.log('  Placement Officer:  placement@seed.test');
  console.log('  Student 1:          student1@seed.test  (Roll: CSE2023001)');
  console.log('  Student 2:          student2@seed.test  (Roll: CSE2023002)');
  console.log(`\nDepartment ID: ${department._id}`);
  console.log(`Subject 1 ID (Data Structures): ${subject1._id}`);
  console.log(`Subject 2 ID (DBMS): ${subject2._id}`);

  await app.close();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});