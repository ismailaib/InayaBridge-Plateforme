
import { getEmployees, Employee } from '@/api/employees';
import { useQuery } from '@tanstack/react-query';

export function useEmployees(tenantId: string | null) {
  return useQuery<Employee[], Error>({
    queryKey: ['employees', tenantId],
    queryFn: async () => {
      if (!tenantId) {
        return [];
      }
      const res = await getEmployees(tenantId);
      return res.data;
    },
    enabled: !!tenantId,
  });
}
