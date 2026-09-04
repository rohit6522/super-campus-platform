'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useResume, useUpdateResume } from '@/hooks/queries/use-resumes';
import { Resume, EducationEntry, ExperienceEntry, ProjectEntry, CertificationEntry } from '@/lib/api/resumes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResumeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: resume, isLoading } = useResume(id);
  const updateMutation = useUpdateResume();

  const [form, setForm] = useState<Partial<Resume> | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (resume) setForm(resume);
  }, [resume]);

  if (isLoading || !form) {
    return <Skeleton className="h-96 w-full" />;
  }

  const update = (field: keyof Resume, value: any) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    setSaveMessage(null);
    await updateMutation.mutateAsync({ id, data: form });
    setSaveMessage('Saved!');
    setTimeout(() => setSaveMessage(null), 2000);
  };

  // --- Education ---
  const addEducation = () =>
    update('education', [...(form.education ?? []), { institution: '', degree: '' }]);
  const updateEducation = (index: number, patch: Partial<EducationEntry>) => {
    const list = [...(form.education ?? [])];
    list[index] = { ...list[index], ...patch };
    update('education', list);
  };
  const removeEducation = (index: number) =>
    update('education', (form.education ?? []).filter((_, i) => i !== index));

  // --- Experience ---
  const addExperience = () =>
    update('experience', [...(form.experience ?? []), { company: '', role: '' }]);
  const updateExperience = (index: number, patch: Partial<ExperienceEntry>) => {
    const list = [...(form.experience ?? [])];
    list[index] = { ...list[index], ...patch };
    update('experience', list);
  };
  const removeExperience = (index: number) =>
    update('experience', (form.experience ?? []).filter((_, i) => i !== index));

  // --- Projects ---
  const addProject = () =>
    update('projects', [...(form.projects ?? []), { title: '', technologies: [] }]);
  const updateProject = (index: number, patch: Partial<ProjectEntry>) => {
    const list = [...(form.projects ?? [])];
    list[index] = { ...list[index], ...patch };
    update('projects', list);
  };
  const removeProject = (index: number) =>
    update('projects', (form.projects ?? []).filter((_, i) => i !== index));

  // --- Certifications ---
  const addCertification = () =>
    update('certifications', [...(form.certifications ?? []), { name: '' }]);
  const updateCertification = (index: number, patch: Partial<CertificationEntry>) => {
    const list = [...(form.certifications ?? [])];
    list[index] = { ...list[index], ...patch };
    update('certifications', list);
  };
  const removeCertification = (index: number) =>
    update('certifications', (form.certifications ?? []).filter((_, i) => i !== index));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push('/dashboard/resumes')}>
          ← Back to resumes
        </Button>
        <div className="flex items-center gap-2">
          {saveMessage && <span className="text-sm text-green-600">{saveMessage}</span>}
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Resume Title</Label>
            <Input value={form.title ?? ''} onChange={(e) => update('title', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.fullName ?? ''} onChange={(e) => update('fullName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email ?? ''} onChange={(e) => update('email', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone ?? ''} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Professional Summary</Label>
            <textarea
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              rows={3}
              value={form.summary ?? ''}
              onChange={(e) => update('summary', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Comma-separated skills</Label>
          <Input
            value={(form.skills ?? []).join(', ')}
            onChange={(e) =>
              update(
                'skills',
                e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              )
            }
            placeholder="JavaScript, React, Node.js, MongoDB"
          />
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button size="sm" variant="outline" onClick={addEducation}>
            + Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(form.education ?? []).map((edu, i) => (
            <div key={i} className="space-y-2 rounded-md border p-3">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => updateEducation(i, { institution: e.target.value })}
                />
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(i, { degree: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Start Year"
                  value={edu.startYear ?? ''}
                  onChange={(e) => updateEducation(i, { startYear: e.target.value })}
                />
                <Input
                  placeholder="End Year"
                  value={edu.endYear ?? ''}
                  onChange={(e) => updateEducation(i, { endYear: e.target.value })}
                />
                <Input
                  placeholder="Grade"
                  value={edu.grade ?? ''}
                  onChange={(e) => updateEducation(i, { grade: e.target.value })}
                />
              </div>
              <Button size="sm" variant="ghost" onClick={() => removeEducation(i)}>
                Remove
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Experience</CardTitle>
          <Button size="sm" variant="outline" onClick={addExperience}>
            + Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(form.experience ?? []).map((exp, i) => (
            <div key={i} className="space-y-2 rounded-md border p-3">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(i, { company: e.target.value })}
                />
                <Input
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => updateExperience(i, { role: e.target.value })}
                />
              </div>
              <textarea
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                placeholder="Description"
                rows={2}
                value={exp.description ?? ''}
                onChange={(e) => updateExperience(i, { description: e.target.value })}
              />
              <Button size="sm" variant="ghost" onClick={() => removeExperience(i)}>
                Remove
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button size="sm" variant="outline" onClick={addProject}>
            + Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(form.projects ?? []).map((proj, i) => (
            <div key={i} className="space-y-2 rounded-md border p-3">
              <Input
                placeholder="Project Title"
                value={proj.title}
                onChange={(e) => updateProject(i, { title: e.target.value })}
              />
              <textarea
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                placeholder="Description"
                rows={2}
                value={proj.description ?? ''}
                onChange={(e) => updateProject(i, { description: e.target.value })}
              />
              <Input
                placeholder="Technologies (comma-separated)"
                value={(proj.technologies ?? []).join(', ')}
                onChange={(e) =>
                  updateProject(i, {
                    technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
              <Button size="sm" variant="ghost" onClick={() => removeProject(i)}>
                Remove
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Certifications</CardTitle>
          <Button size="sm" variant="outline" onClick={addCertification}>
            + Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(form.certifications ?? []).map((cert, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Name"
                value={cert.name}
                onChange={(e) => updateCertification(i, { name: e.target.value })}
              />
              <Input
                placeholder="Issuer"
                value={cert.issuer ?? ''}
                onChange={(e) => updateCertification(i, { issuer: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Date"
                  value={cert.date ?? ''}
                  onChange={(e) => updateCertification(i, { date: e.target.value })}
                />
                <Button size="sm" variant="ghost" onClick={() => removeCertification(i)}>
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements & Languages */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements & Languages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Achievements (comma-separated)</Label>
            <Input
              value={(form.achievements ?? []).join(', ')}
              onChange={(e) =>
                update('achievements', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Languages (comma-separated)</Label>
            <Input
              value={(form.languages ?? []).join(', ')}
              onChange={(e) =>
                update('languages', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}