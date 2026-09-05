'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCompanies, createCompany, deleteCompany, CreateCompanyInput } from '@/lib/api/admin-companies';

export function useCompanies() {
  return useQuery({
    queryKey: ['admin-companies'],
    queryFn: getCompanies,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCompanyInput) => createCompany(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-companies'] }),
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-companies'] }),
  });
}