"use client";

import { useState } from "react";
import { useDepartments } from "@/hooks/queries/use-admin-departments";
import { useAllSubjects } from "@/hooks/queries/use-admin-subjects";
import {
  useTimetableEntries,
  useCreateTimetableEntry,
  useDeleteTimetableEntry,
} from "@/hooks/queries/use-admin-timetable";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useUpdateTimetableEntry } from "@/hooks/queries/use-admin-timetable";
const daysOfWeek = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

interface FacultyOption {
  _id: string;
  userId: { _id: string; name: string };
}

export default function AdminTimetablePage() {
  useRoleGuard(["ADMIN", "SUPER_ADMIN", "HOD"]);

  const { data: departments } = useDepartments();
  const { data: subjects } = useAllSubjects();
  const createMutation = useCreateTimetableEntry();
  const deleteMutation = useDeleteTimetableEntry();

  const { data: facultyList } = useQuery({
    queryKey: ["faculty-all"],
    queryFn: async () => {
      const response = await apiClient.get<FacultyOption[]>("/faculty/all");
      return response.data;
    },
  });

  const [departmentId, setDepartmentId] = useState("");
  const [semester, setSemester] = useState("1");
  const [subjectId, setSubjectId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("MONDAY");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [room, setRoom] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRoom, setEditRoom] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");

  const updateMutation = useUpdateTimetableEntry();
  const [error, setError] = useState<string | null>(null);

  const { data: entries, isLoading: entriesLoading } = useTimetableEntries(
    departmentId || undefined,
    departmentId ? parseInt(semester, 10) : undefined,
  );

  const subjectsForDeptSem = subjects?.filter((s) => {
    const deptId =
      typeof s.departmentId === "object" ? s.departmentId._id : s.departmentId;
    return deptId === departmentId && s.semester === parseInt(semester, 10);
  });

  const handleCreate = async () => {
    setError(null);
    try {
      await createMutation.mutateAsync({
        departmentId,
        semester: parseInt(semester, 10),
        subjectId,
        facultyId,
        dayOfWeek,
        startTime,
        endTime,
        room,
      });
      setRoom("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(
          Array.isArray(err.response.data.message)
            ? err.response.data.message.join(", ")
            : err.response.data.message,
        );
      } else {
        setError("Failed to create timetable entry.");
      }
    }
  };

  const startEdit = (entry: any) => {
    setEditingId(entry._id);
    setEditRoom(entry.room);
    setEditStartTime(entry.startTime);
    setEditEndTime(entry.endTime);
  };

  const handleUpdate = async (id: string) => {
    setError(null);
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          room: editRoom,
          startTime: editStartTime,
          endTime: editEndTime,
        },
      });
      setEditingId(null);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update entry.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Timetable</h1>
        <p className="text-muted-foreground">
          Create weekly class schedule entries
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Department & Semester</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Department</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">-- Select --</option>
              {departments?.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Semester</Label>
            <Input
              type="number"
              min={1}
              max={8}
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {departmentId && (
        <Card>
          <CardHeader>
            <CardTitle>Add Timetable Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Subject</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {subjectsForDeptSem?.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
                {subjectsForDeptSem?.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No subjects found for this department/semester yet.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Faculty</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={facultyId}
                  onChange={(e) => setFacultyId(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {facultyList?.map((f) => (
                    <option key={f._id} value={f.userId._id}>
                      {f.userId.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label>Day</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                >
                  {daysOfWeek.map((d) => (
                    <option key={d} value={d}>
                      {d.charAt(0) + d.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Room</Label>
                <Input
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="101"
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              onClick={handleCreate}
              disabled={
                !subjectId || !facultyId || !room || createMutation.isPending
              }
            >
              {createMutation.isPending ? "Adding..." : "Add Entry"}
            </Button>
          </CardContent>
        </Card>
      )}

      {departmentId && (
        <Card>
          <CardHeader>
            <CardTitle>Current Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            {entriesLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : entries && entries.length > 0 ? (
              <div className="space-y-2">
                {entries.map((entry) => (
                  <div
                    key={entry._id}
                    className="rounded-md border p-3 text-sm"
                  >
                    {editingId === entry._id ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            type="time"
                            value={editStartTime}
                            onChange={(e) => setEditStartTime(e.target.value)}
                          />
                          <Input
                            type="time"
                            value={editEndTime}
                            onChange={(e) => setEditEndTime(e.target.value)}
                          />
                          <Input
                            value={editRoom}
                            onChange={(e) => setEditRoom(e.target.value)}
                            placeholder="Room"
                          />
                        </div>
                        {error && <p className="text-destructive">{error}</p>}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(entry._id)}
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {typeof entry.subjectId === "object"
                              ? entry.subjectId.name
                              : ""}{" "}
                            · {entry.dayOfWeek}
                          </p>
                          <p className="text-muted-foreground">
                            {entry.startTime}–{entry.endTime} · Room{" "}
                            {entry.room} ·{" "}
                            {typeof entry.facultyId === "object"
                              ? entry.facultyId.name
                              : ""}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(entry)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(entry._id)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No timetable entries for this department/semester yet.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
