export function getDashboardPathForRole(role: string): string {
  switch (role) {
    case 'STUDENT':
      return '/dashboard';
    case 'FACULTY':
      return '/dashboard/faculty';
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return '/dashboard/admin';
    case 'HOD':
      return '/dashboard/hod'; // placeholder route, build next if needed
    case 'PLACEMENT_OFFICER':
      return '/dashboard/placement'; // placeholder route, build next if needed
    default:
      return '/dashboard';
  }
}