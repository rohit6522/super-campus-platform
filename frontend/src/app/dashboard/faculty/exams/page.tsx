'use client';

import { useState } from 'react';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { useMySubjectsForAttendance, useStudentsByClass } from '@/hooks/queries/use-faculty-attendance';
import { useCreateExam, useEnterResults } from '@/hooks/queries/use-faculty-exams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface Subject {
  _id: string;
  name: string;
  code: string;
  semester: number;
  departmentId: { _id: string; name: string };
}

export default function FacultyExamsPage() {
  useRoleGuard(['FACULTY']);

  const { data: subjects, isLoading: subjectsLoading } = useMySubjectsForAttendance();
  const createExamMutation = useCreateExam();
  const enterResultsMutation = useEnterResults();

  const [subjectId, setSubjectId] = useState('');
  const [examType, setExamType] = useState('FINAL');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [room, setRoom] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');
  const [examId, setExamId] = useState<string | null>(null);
  const [marksInput, setMarksInput] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedSubject: Subject | undefined = subjects?.find((s: Subject) => s._id === subjectId);

  const { data: students, isLoading: studentsLoading } = useStudentsByClass(
    selectedSubject?.departmentId?._id,
    selectedSubject?.semester,
  );

  const handleCreateExam = async () => {
    if (!selectedSubject) return;
    setError(null);
    try {
      const exam = await createExamMutation.mutateAsync({
        subjectId: selectedSubject._id,
        departmentId: selectedSubject.departmentId._id,
        semester: selectedSubject.semester,
        examType,
        date,
        startTime,
        endTime,
        room,
        maxMarks: parseInt(maxMarks, 10),
      });
      setExamId(exam._id);
    } catch {
      setError('Failed to create exam. Check the room/time isn\'t already booked.');
    }
  };

  const handleEnterResults = async () => {
    if (!examId || !students) return;
    setError(null);
    setSuccess(false);
    try {
      const results = students
        .filter((s: any) => marksInput[s._id])
        .map((s: any) => ({ studentId: s._id, marksObtained: parseInt(marksInput[s._id], 10) }));

      if (results.length === 0) {
        setError('Enter marks for at least one student.');
        return;
      }

      await enterResultsMutation.mutateAsync({ examId, results });
      setSuccess(true);
    } catch {
      setError('Failed to submit results — marks may exceed the maximum allowed.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exams & Results</h1>
        <p className="text-muted-foreground">Schedule an exam and enter marks</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Create Exam</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Subject</Label>
            {subjectsLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                disabled={!!examId}
              >
                <option value="">-- Select --</option>
                {subjects?.map((s: Subject) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Exam Type</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                disabled={!!examId}
              >
                <option value="MIDTERM">Midterm</option>
                <option value="FINAL">Final</option>
                <option value="QUIZ">Quiz</option>
                <option value="ASSIGNMENT_BASED">Assignment Based</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={!!examId} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} disabled={!!examId} />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={!!examId} />
            </div>
            <div className="space-y-2">
              <Label>Max Marks</Label>
              <Input type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} disabled={!!examId} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Room</Label>
            <Input value={room} onChange={(e) => setRoom(e.target.value)} disabled={!!examId} />
          </div>

          {!examId && (
            <Button
              onClick={handleCreateExam}
              disabled={!subjectId || !date || !room || createExamMutation.isPending}
            >
              {createExamMutation.isPending ? 'Creating...' : 'Create Exam'}
            </Button>
          )}
          {examId && <p className="text-sm text-green-600">Exam created — enter marks below.</p>}
        </CardContent>
      </Card>

      {examId && (
        <Card>
          <CardHeader>
            <CardTitle>2. Enter Marks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentsLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : students && students.length > 0 ? (
              <div className="space-y-2">
                {students.map((student: any) => (
                  <div key={student._id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{student.rollNumber}</p>
                      <p className="text-sm text-muted-foreground">{student.userId?.name}</p>
                    </div>
                    <Input
                      type="number"
                      placeholder={`/ ${maxMarks}`}
                      className="w-24"
                      value={marksInput[student._id] ?? ''}
                      onChange={(e) =>
                        setMarksInput((prev) => ({ ...prev, [student._id]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No students found for this class.</p>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">Results submitted successfully!</p>}

            {!success && (
              <Button onClick={handleEnterResults} disabled={enterResultsMutation.isPending} className="w-full">
                {enterResultsMutation.isPending ? 'Submitting...' : 'Submit Results'}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}