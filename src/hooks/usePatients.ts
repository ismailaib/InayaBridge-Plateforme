
import { getPatientsByTenant, TenantPatient } from '@/api/patients';
import { useQuery } from '@tanstack/react-query';

export function usePatients(tenantId: string | null) {
  return useQuery<TenantPatient[], Error>({
    queryKey: ['patients', tenantId],
    queryFn: async () => {
      if (!tenantId) {
        return [];
      }
      const res = await getPatientsByTenant(tenantId);
      return res.data;
    },
    enabled: !!tenantId,
  });
}
