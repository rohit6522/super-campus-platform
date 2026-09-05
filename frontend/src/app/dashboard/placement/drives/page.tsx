'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { useCompanies } from '@/hooks/queries/use-admin-companies';
import { useCreateDrive } from '@/hooks/queries/use-officer-placements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const branchOptions = ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT'];

export default function CreateDrivePage() {
  useRoleGuard(['PLACEMENT_OFFICER']);

  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const createMutation = useCreateDrive();

  const [companyId, setCompanyId] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [packageLPA, setPackageLPA] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [minCGPA, setMinCGPA] = useState('7');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [maxBacklogs, setMaxBacklogs] = useState('0');
  const [graduationYear, setGraduationYear] = useState(String(new Date().getFullYear() + 1));
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createdDriveId, setCreatedDriveId] = useState<string | null>(null);

  const toggleBranch = (branch: string) => {
    setSelectedBranches((prev) =>
      prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch],
    );
  };

  const isValid =
    companyId && jobRole && jobDescription.length > 0 && packageLPA && selectedBranches.length > 0 && deadline;

  const handleCreate = async () => {
    setError(null);
    try {
      const drive = await createMutation.mutateAsync({
        companyId,
        jobRole,
        jobDescription,
        packageLPA: parseFloat(packageLPA),
        requiredSkills: requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        minCGPA: parseFloat(minCGPA),
        allowedBranches: selectedBranches,
        maxBacklogs: parseInt(maxBacklogs, 10),
        graduationYear: parseInt(graduationYear, 10),
        applicationDeadline: new Date(deadline).toISOString(),
      });
      setCreatedDriveId(drive._id);
    } catch {
      setError('Failed to create placement drive.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Placement Drive</h1>
        <p className="text-muted-foreground">Set up a new job opportunity for students</p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>Company</Label>
            {companiesLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
              >
                <option value="">-- Select --</option>
                {companies?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            {companies && companies.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No companies yet —{' '}
                <Link href="/dashboard/admin/companies" className="underline">
                  add one first
                </Link>
                .
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Job Role</Label>
              <Input value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="Software Engineer" />
            </div>
            <div className="space-y-2">
              <Label>Package (LPA)</Label>
              <Input type="number" value={packageLPA} onChange={(e) => setPackageLPA(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Job Description</Label>
            <textarea
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Required Skills (comma-separated)</Label>
            <Input value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Min CGPA</Label>
              <Input type="number" step="0.1" value={minCGPA} onChange={(e) => setMinCGPA(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Max Backlogs</Label>
              <Input type="number" value={maxBacklogs} onChange={(e) => setMaxBacklogs(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Graduation Year</Label>
              <Input type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allowed Branches</Label>
            <div className="flex flex-wrap gap-2">
              {branchOptions.map((branch) => (
                <button
                  key={branch}
                  type="button"
                  onClick={() => toggleBranch(branch)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    selectedBranches.includes(branch)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Application Deadline</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {createdDriveId && (
            <p className="text-sm text-green-600">
              Drive created!{' '}
              <Link href={`/dashboard/placement/drives/${createdDriveId}`} className="underline">
                View applications
              </Link>
            </p>
          )}

          <Button onClick={handleCreate} disabled={!isValid || createMutation.isPending} className="w-full">
            {createMutation.isPending ? 'Creating...' : 'Create Drive'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}