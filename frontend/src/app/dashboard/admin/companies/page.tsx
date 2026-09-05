'use client';

import { useState } from 'react';
import { useCompanies, useCreateCompany, useDeleteCompany } from '@/hooks/queries/use-admin-companies';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';

export default function AdminCompaniesPage() {
  useRoleGuard(['ADMIN', 'SUPER_ADMIN', 'PLACEMENT_OFFICER']);

  const { data: companies, isLoading } = useCompanies();
  const createMutation = useCreateCompany();
  const deleteMutation = useDeleteCompany();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    try {
      await createMutation.mutateAsync({ name, industry, location, website: website || undefined });
      setName('');
      setIndustry('');
      setLocation('');
      setWebsite('');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(
          Array.isArray(err.response.data.message)
            ? err.response.data.message.join(', ')
            : err.response.data.message,
        );
      } else {
        setError('Something went wrong.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Companies</h1>
        <p className="text-muted-foreground">Add companies for placement drives</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Company</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="TechCorp" />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Software" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Bangalore" />
            </div>
            <div className="space-y-2">
              <Label>Website (optional)</Label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleCreate} disabled={!name || !industry || !location || createMutation.isPending}>
            {createMutation.isPending ? 'Adding...' : 'Add Company'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : companies && companies.length > 0 ? (
            <div className="space-y-2">
              {companies.map((company) => (
                <div key={company._id} className="flex items-center justify-between border-b py-2 last:border-0">
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {company.industry} · {company.location}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(company._id)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No companies yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}