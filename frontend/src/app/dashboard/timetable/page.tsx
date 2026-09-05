'use client';

import { useStudentProfile } from '@/hooks/queries/use-student-dashboard';
import { useMyTimetable } from '@/hooks/queries/use-student-dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const daysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export default function TimetablePage() {
  const { data: profile } = useStudentProfile();
  const { data: timetable, isLoading } = useMyTimetable(profile?.departmentId?._id, profile?.semester);

  const groupedByDay = daysOrder.map((day) => ({
    day,
    classes: timetable?.filter((entry) => entry.dayOfWeek === day) ?? [],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Timetable & Classes</h1>
        <p className="text-muted-foreground">Your weekly class schedule</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <div className="space-y-4">
          {groupedByDay.map(({ day, classes }) => (
            <Card key={day}>
              <CardContent className="pt-6">
                <h2 className="font-semibold mb-3">{day.charAt(0) + day.slice(1).toLowerCase()}</h2>
                {classes.length > 0 ? (
                  <div className="space-y-2">
                    {classes
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((entry) => (
                        <div
                          key={entry._id}
                          className="flex items-center justify-between rounded-lg border p-3 text-sm"
                        >
                          <div>
                            <p className="font-medium">{entry.subjectId?.name}</p>
                            <p className="text-muted-foreground">
                              Room {entry.room} · {entry.facultyId?.name}
                            </p>
                          </div>
                          <span className="text-muted-foreground">
                            {entry.startTime} – {entry.endTime}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No classes scheduled.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}